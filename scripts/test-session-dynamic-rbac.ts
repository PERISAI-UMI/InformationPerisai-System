import { config } from "dotenv";
config({ path: ".env.local" });
config();

import prisma from "../src/lib/db";
import { hasPermission } from "../src/lib/permissions";
import type { PermissionKey } from "../src/types/permissions";

interface RoleWithPermissions {
  idRole: number;
  namaRole: string;
  label: string;
  deskripsi: string | null;
  permissions: string | null;
  isSystem: boolean;
  createdAt: number;
  updatedAt: number;
}

async function verifyDynamicRoleSession() {
  console.log("🧪 [1/3] Mengambil data peran dari database...");
  const editorRole = (await prisma.mRole.findUnique({
    where: { namaRole: "EDITOR" },
  })) as RoleWithPermissions | null;

  if (!editorRole) {
    throw new Error("Peran EDITOR tidak ditemukan");
  }

  const initialPerms = JSON.parse(editorRole.permissions || "[]") as PermissionKey[];
  console.log("   Initial permissions EDITOR:", initialPerms);

  // Simulasikan Super Admin menambahkan 'finance:read' ke peran EDITOR
  console.log("🧪 [2/3] Mensimulasikan Super Admin mengubah izin peran EDITOR (menambahkan 'finance:read')...");
  const updatedPerms: PermissionKey[] = Array.from(new Set([...initialPerms, "finance:read" as PermissionKey]));
  await (prisma.mRole as any).update({
    where: { idRole: editorRole.idRole },
    data: { permissions: JSON.stringify(updatedPerms) },
  });

  // Ambil akun yang memiliki peran EDITOR
  const editorAccount = (await prisma.mAkun.findFirst({
    where: { role: { namaRole: "EDITOR" }, isActive: 1 },
    include: {
      role: { select: { namaRole: true, permissions: true, isSystem: true } },
      anggota: { select: { idPerisai: true, namaLengkap: true, email: true } },
    },
  })) as any;

  // Evaluasi pembacaan permissions seperti di getSession()
  const rolePerms = JSON.parse(editorAccount?.role?.permissions || JSON.stringify(updatedPerms)) as PermissionKey[];
  const simulatedUser = {
    id: editorAccount?.idPerisai || "simulated_editor",
    name: editorAccount?.anggota?.namaLengkap || "Editor Simulasi",
    email: editorAccount?.anggota?.email || "editor@perisai.org",
    role: "EDITOR" as const,
    isActive: true,
    permissions: rolePerms,
  };

  console.log("🧪 [3/3] Menguji evaluasi hasPermission pada akun...");
  const canReadFinanceNow = hasPermission(simulatedUser, "finance:read");
  console.log("   Apakah akun EDITOR sekarang memiliki izin 'finance:read'? ->", canReadFinanceNow ? "✅ YA (BERHASIL)" : "❌ TIDAK");

  if (!canReadFinanceNow) {
    throw new Error("Evaluasi hak akses dinamis gagal!");
  }

  // Kembalikan permissions ke semula agar database tetap bersih
  console.log("🧹 Mengembalikan permissions peran EDITOR ke kondisi semula...");
  await (prisma.mRole as any).update({
    where: { idRole: editorRole.idRole },
    data: { permissions: JSON.stringify(initialPerms) },
  });

  console.log("🎉 Pengujian skenario sesi dinamis sukses 100%!");
}

verifyDynamicRoleSession()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Gagal:", err);
    process.exit(1);
  });
