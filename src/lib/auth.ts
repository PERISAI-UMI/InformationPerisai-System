/**
 * auth.ts — Session Management (Edge-safe)
 *
 * Menggunakan cookie-based session dengan opaque token ber-entropi tinggi (32 bytes).
 * Setiap sesi tersimpan dan divalidasi ke tabel `T_Sesi` (model Prisma `tSesi`)
 * yang mencakup pengecekan masa aktif (`expires_at`), verifikasi status akun aktif,
 * serta penghapusan sesi kedaluwarsa.
 *
 * Modul crypto diakses melalui Web Crypto API (globalThis.crypto) yang kompatibel
 * murni dengan Cloudflare Workers Isolate dan Node.js 20+.
 */

import { cookies } from "next/headers";
import type { AuthUser, Session } from "@/types";
import prisma from "./db";

export const SESSION_COOKIE_NAME = "perisai_session_id";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 hari

/**
 * Buat sesi baru di tabel T_Sesi dan kembalikan token unik ber-entropi tinggi.
 */
export async function createSessionRecord({
  idAkun,
  ipAddress,
  userAgent,
}: {
  idAkun: number;
  ipAddress?: string;
  userAgent?: string | null;
}): Promise<{ token: string; expiresAt: number }> {
  const tokenBytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(tokenBytes);
  const token = Array.from(tokenBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const idSesi = globalThis.crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;

  await prisma.tSesi.create({
    data: {
      idSesi,
      idAkun,
      token,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

/**
 * Hapus sesi dari database berdasarkan token.
 */
export async function destroySessionRecord(token: string): Promise<void> {
  if (!token) return;
  try {
    await prisma.tSesi.deleteMany({
      where: { token },
    });
  } catch (err) {
    console.warn("[auth] Gagal menghapus record T_Sesi:", err);
  }
}

/**
 * Ambil sesi dari cookie request saat ini.
 * Memvalidasi token terhadap tabel `T_Sesi` di database dan memeriksa masa kedaluwarsa.
 * Mengembalikan null jika token tidak ada, kedaluwarsa, atau akun tidak aktif.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token || token.trim() === "") {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);

    // Lookup record sesi di T_Sesi dengan eager loading akun & relasinya
    const sessionRecord = await prisma.tSesi.findUnique({
      where: { token },
      include: {
        akun: {
          include: {
            role: {
              select: { namaRole: true },
            },
            anggota: {
              select: {
                idPerisai: true,
                namaLengkap: true,
                email: true,
                kepengurusan: {
                  where: { status: "aktif" },
                  select: {
                    departemen: {
                      select: { slug: true },
                    },
                  },
                  take: 1,
                  orderBy: { idKepengurusan: "desc" },
                },
              },
            },
          },
        },
      },
    });

    if (!sessionRecord) {
      return null;
    }

    // Validasi masa aktif sesi
    if (sessionRecord.expiresAt <= now) {
      // Sesi telah expired: hapus secara asynchronous dari database
      prisma.tSesi.delete({ where: { token } }).catch(() => {});
      return null;
    }

    const { akun } = sessionRecord;
    if (!akun || !akun.isActive || akun.isActive !== 1 || !akun.anggota) {
      return null;
    }

    const { anggota, role } = akun;
    const cmsRole = mapRoleToCmsRole(role.namaRole);

    return {
      user: {
        id: anggota.idPerisai,
        name: anggota.namaLengkap,
        email: anggota.email,
        role: cmsRole,
        isActive: Boolean(akun.isActive),
        departmentId: anggota.kepengurusan[0]?.departemen?.slug || undefined,
      },
      expires: new Date(sessionRecord.expiresAt * 1000).toISOString(),
    };
  } catch (err) {
    console.error("[auth] Error retrieving session:", err);
    return null;
  }
}

/**
 * Map nama role dari database PSDM ke role CMS internal.
 */
export function mapRoleToCmsRole(namaRole: string): AuthUser["role"] {
  switch (namaRole.toUpperCase()) {
    case "SUPER_ADMIN":
      return "SUPER_ADMIN";
    case "BPH":
    case "KADEP":
      return "ADMIN";
    default:
      return "EDITOR";
  }
}

/**
 * Verifikasi password terhadap hash yang tersimpan.
 *
 * Mendukung dua format hash:
 * 1. scrypt — format: "salt:hexKey" (sistem baru, lebih aman)
 * 2. SHA-256 hex — format legacy untuk seed data awal
 *
 * Menggunakan Web Crypto API (globalThis.crypto) yang tersedia di
 * Cloudflare Workers dan Node.js 20+ tanpa perlu import `node:crypto`.
 * Untuk fungsi scryptSync, menggunakan `node:crypto` dengan dynamic import
 * karena Web Crypto API tidak mendukung scrypt natively.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    if (!storedHash) return false;

    // Format 1: scrypt (salt:hexKey)
    if (storedHash.includes(":")) {
      const parts = storedHash.split(":");
      if (parts.length !== 2 || !parts[0] || !parts[1]) return false;

      const [salt, hexKey] = parts;

      // Gunakan node:crypto scryptSync di bawah nodejs_compat flag
      const { scryptSync, timingSafeEqual } = await import("node:crypto");
      const keyBuffer = Buffer.from(hexKey, "hex");
      const derivedKey = scryptSync(password, salt, keyBuffer.length);
      return timingSafeEqual(keyBuffer, derivedKey);
    }

    // Format 2: SHA-256 hex (legacy seed data)
    if (storedHash.length === 64) {
      // Gunakan Web Crypto API — tersedia di Cloudflare Workers & Node.js 20+
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await globalThis.crypto.subtle.digest(
        "SHA-256",
        data
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Perbandingan timing-safe menggunakan Web Crypto
      const normalizedStored = storedHash.toLowerCase();
      if (sha256Hex.length !== normalizedStored.length) return false;

      // Manual timing-safe compare untuk string hex
      let diff = 0;
      for (let i = 0; i < sha256Hex.length; i++) {
        diff |= sha256Hex.charCodeAt(i) ^ normalizedStored.charCodeAt(i);
      }
      return diff === 0;
    }

    return false;
  } catch (err) {
    console.error("[auth] Error verifying password:", err);
    return false;
  }
}

/**
 * Buat hash scrypt baru dalam format "salt:hexKey".
 * Menggunakan salt 16 bytes acak dan derived key scrypt 64 bytes.
 */
export async function hashPassword(password: string): Promise<string> {
  const { scryptSync, randomBytes } = await import("node:crypto");
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Cek apakah string hash kata sandi masih menggunakan format legacy SHA-256 (64 hex characters tanpa separator colon).
 */
export function isLegacyPasswordHash(storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== "string") return false;
  return !storedHash.includes(":") && storedHash.trim().length === 64;
}

export { SESSION_COOKIE_NAME as default };


