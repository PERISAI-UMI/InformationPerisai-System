import prisma from "@/lib/db";
import type { PermissionKey } from "@/types/permissions";

export interface RoleListItem {
  id: number;
  name: string;
  label: string;
  description: string | null;
  permissions: PermissionKey[];
  isSystem: boolean;
  userCount: number;
  users: {
    idPerisai: string;
    namaLengkap: string;
    email: string;
    fotoUrl: string | null;
  }[];
  createdAt: number;
  updatedAt: number;
}

export interface EligibleUser {
  idPerisai: string;
  namaLengkap: string;
  email: string;
  fotoUrl: string | null;
  currentRole: string;
  idRole: number;
}

interface RawRoleRecord {
  idRole: number;
  namaRole: string;
  label: string;
  deskripsi: string | null;
  permissions?: string | null;
  isSystem?: boolean | number;
  createdAt: number;
  updatedAt: number;
  akun?: Array<{
    idPerisai: string;
    anggota: RoleListItem["users"][number] | null;
  }>;
}

/**
 * Mengambil daftar seluruh peran di basis data dengan jumlah akun yang terikat
 */
export async function getRoles(): Promise<RoleListItem[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roles = (await (prisma.mRole.findMany as any)({
    orderBy: [{ isSystem: "desc" }, { idRole: "asc" }],
    include: {
      akun: {
        where: { isActive: 1 },
        select: {
          idPerisai: true,
          anggota: {
            select: {
              idPerisai: true,
              namaLengkap: true,
              email: true,
              fotoUrl: true,
            },
          },
        },
      },
    },
  })) as RawRoleRecord[];

  return roles.map((role) => {
    let permissions: PermissionKey[] = [];
    if (role.permissions) {
      try {
        const parsed = JSON.parse(role.permissions);
        if (Array.isArray(parsed)) {
          permissions = parsed as PermissionKey[];
        }
      } catch {
        permissions = [];
      }
    }

    const users = (role.akun || [])
      .map((a) => a.anggota)
      .filter((m): m is RoleListItem["users"][number] => Boolean(m));

    return {
      id: role.idRole,
      name: role.namaRole,
      label: role.label,
      description: role.deskripsi,
      permissions,
      isSystem: Boolean(role.isSystem),
      userCount: role.akun?.length || 0,
      users,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  });
}

/**
 * Mengambil detail peran berdasarkan ID beserta daftar akun yang saat ini terikat
 */
export async function getRoleById(id: number): Promise<RoleListItem | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawRole = (await (prisma.mRole.findUnique as any)({
    where: { idRole: id },
    include: {
      akun: {
        select: {
          idPerisai: true,
          anggota: {
            select: {
              idPerisai: true,
              namaLengkap: true,
              email: true,
              fotoUrl: true,
            },
          },
        },
      },
    },
  })) as RawRoleRecord | null;

  if (!rawRole) return null;

  let permissions: PermissionKey[] = [];
  if (rawRole.permissions) {
    try {
      const parsed = JSON.parse(rawRole.permissions);
      if (Array.isArray(parsed)) {
        permissions = parsed as PermissionKey[];
      }
    } catch {
      permissions = [];
    }
  }

  const users = (rawRole.akun || [])
    .map((a) => a.anggota)
    .filter((m): m is RoleListItem["users"][number] => Boolean(m));

  return {
    id: rawRole.idRole,
    name: rawRole.namaRole,
    label: rawRole.label,
    description: rawRole.deskripsi,
    permissions,
    isSystem: Boolean(rawRole.isSystem),
    userCount: rawRole.akun?.length || 0,
    users,
    createdAt: rawRole.createdAt,
    updatedAt: rawRole.updatedAt,
  };
}

/**
 * Mengambil seluruh akun pengurus aktif yang dapat dialokasikan ke peran
 */
export async function getEligibleUsers(): Promise<EligibleUser[]> {
  const akuns = await prisma.mAkun.findMany({
    where: { isActive: 1 },
    include: {
      anggota: {
        select: {
          idPerisai: true,
          namaLengkap: true,
          email: true,
          fotoUrl: true,
        },
      },
      role: {
        select: {
          idRole: true,
          namaRole: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return akuns.map((a) => ({
    idPerisai: a.idPerisai,
    namaLengkap: a.anggota?.namaLengkap || "Tanpa Nama",
    email: a.anggota?.email || a.idPerisai,
    fotoUrl: a.anggota?.fotoUrl || null,
    currentRole: a.role?.namaRole || "Anggota",
    idRole: a.role?.idRole || a.idRole || 0,
  }));
}
