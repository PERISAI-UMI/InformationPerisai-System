import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { storage } from "@/lib/storage";
import { processImage, getOutputExtension, getOutputMimeType } from "@/lib/images";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// Batas ukuran file: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Tipe file yang diizinkan
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.user, "create", "gallery")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada berkas yang diunggah" },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Ukuran berkas melebihi batas maksimum (${MAX_FILE_SIZE / 1024 / 1024} MB)` },
        { status: 400 }
      );
    }

    // Validasi tipe MIME
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Tipe berkas tidak didukung: ${file.type}` },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith("image/");
    const buffer = Buffer.from(await file.arrayBuffer());

    // Proses gambar (edge-safe: bypass sharp di Cloudflare Workers)
    const processedBuffer = isImage
      ? await processImage(buffer, { maxWidth: 1920 })
      : buffer;

    // Tentukan ekstensi dan MIME type output (edge-aware)
    const originalExt = "." + (file.name.split(".").pop() || "bin").toLowerCase();
    const outputExt = isImage
      ? getOutputExtension(file.type, originalExt)
      : originalExt;
    const outputMime = isImage ? getOutputMimeType(file.type) : file.type;

    // Sanitasi nama file: hapus karakter non-alphanumeric kecuali _ dan -
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 100); // batasi panjang nama

    // Tambahkan random salt untuk menjamin keunikan kunci penyimpanan saat upload paralel/batch
    const randomSalt = Math.random().toString(36).substring(2, 8);
    const cleanFilename = `${Date.now()}-${randomSalt}-${baseName}${outputExt}`;

    // Upload ke storage (R2 atau lokal)
    const uploaded = await storage.upload(processedBuffer, cleanFilename, outputMime);

    // Simpan metadata ke T_Media
    const idMedia = `med-${Date.now()}-${randomSalt}`;
    const mediaRecord = await prisma.tMedia.create({
      data: {
        idMedia,
        kunciPenyimpanan: cleanFilename,
        namaBerkas: file.name,
        tipeMime: outputMime,
        ukuranByte: processedBuffer.length,
        url: uploaded.url,
        diunggahOleh: session.user.id,
        createdAt: Math.floor(Date.now() / 1000),
      },
    });

    return NextResponse.json({
      id: mediaRecord.idMedia,
      storageKey: mediaRecord.kunciPenyimpanan,
      url: uploaded.url,
      path: uploaded.path,
      mimeType: outputMime,
      sizeBytes: processedBuffer.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/media] Gagal mengunggah media:", message);
    return NextResponse.json(
      { error: "Gagal mengunggah media: " + message },
      { status: 500 }
    );
  }
}
