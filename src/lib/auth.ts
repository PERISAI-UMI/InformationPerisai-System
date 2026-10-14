/**
 * auth.ts — Session Management (Edge-safe)
 *
 * Menggunakan cookie-based session. Cookie berisi `id_perisai` yang
 * digunakan untuk lookup data anggota di database.
 *
 * ⚠️ Catatan arsitektur: Tabel T_Sesi ada di skema tapi belum digunakan
 * untuk validasi sesi di sini. Ini adalah area utama technical debt — di masa
 * depan, cookie seharusnya berisi opaque token yang diverifikasi via T_Sesi.
 *
 * Modul `crypto` diakses melalui Web Crypto API (globalThis.crypto) yang
 * tersedia baik di Cloudflare Workers maupun Node.js 20+, tanpa `node:crypto`.
 */

import { cookies } from "next/headers";
import type { AuthUser, Session } from "@/types";
import prisma from "./db";

export const SESSION_COOKIE_NAME = "perisai_session_id";

/**
 * Ambil sesi dari cookie request saat ini.
 * Mengembalikan null jika tidak ada sesi atau sesi tidak valid.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId || sessionId.trim() === "") {
      return null;
    }

    // Lookup anggota berdasarkan id_perisai yang tersimpan di cookie
    const anggota = await prisma.mAnggota.findUnique({
      where: { idPerisai: sessionId },
      select: {
        idPerisai: true,
        namaLengkap: true,
        email: true,
        akun: {
          select: {
            isActive: true,
            role: {
              select: { namaRole: true },
            },
          },
        },
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
    });

    if (!anggota || !anggota.akun || !anggota.akun.isActive) {
      return null;
    }

    // Mapping nama role PSDM → role CMS
    const cmsRole = mapRoleToCmsRole(anggota.akun.role.namaRole);

    return {
      user: {
        id: anggota.idPerisai,
        name: anggota.namaLengkap,
        email: anggota.email,
        role: cmsRole,
        isActive: Boolean(anggota.akun.isActive),
        departmentId:
          anggota.kepengurusan[0]?.departemen?.slug || undefined,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch (err) {
    console.error("[auth] Error retrieving session:", err);
    return null;
  }
}

/**
 * Map nama role dari database PSDM ke role CMS internal.
 */
function mapRoleToCmsRole(namaRole: string): AuthUser["role"] {
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
      // (tidak bisa pakai timingSafeEqual karena string berbeda panjang kadang ada)
      if (sha256Hex.length !== storedHash.length) return false;

      // Manual timing-safe compare untuk string hex
      let diff = 0;
      for (let i = 0; i < sha256Hex.length; i++) {
        diff |= sha256Hex.charCodeAt(i) ^ storedHash.charCodeAt(i);
      }
      return diff === 0;
    }

    return false;
  } catch (err) {
    console.error("[auth] Error verifying password:", err);
    return false;
  }
}

export { SESSION_COOKIE_NAME as default };
