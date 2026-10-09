import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { storage } from "@/lib/storage";
import { processImage } from "@/lib/images";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.user, "create", "gallery")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada berkas yang diunggah" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith("image/");

    // Optimasi citra jika berkas berupa gambar
    const processedBuffer = isImage ? await processImage(buffer, { maxWidth: 1920 }) : buffer;
    const extension = isImage ? ".webp" : "." + (file.name.split(".").pop() || "bin");
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanFilename = `${Date.now()}-${baseName}${extension}`;

    const uploaded = await storage.upload(
      processedBuffer,
      cleanFilename,
      isImage ? "image/webp" : file.type
    );

    const mediaRecord = await prisma.media.create({
      data: {
        storageKey: cleanFilename,
        originalName: file.name,
        mimeType: isImage ? "image/webp" : file.type,
        sizeBytes: processedBuffer.length,
        uploadedBy: session.user.id,
        createdAt: Math.floor(Date.now() / 1000),
      },
    });

    return NextResponse.json({
      ...mediaRecord,
      url: uploaded.url,
      path: uploaded.path,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Gagal mengunggah media: " + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
