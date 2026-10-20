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

/**
 * Mengambil daftar seluruh peran di basis data dengan jumlah akun yang terikat
 */
export async function getRoles(): Promise<RoleListItem[]> {
  const roles = await prisma.mRole.findMany({
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
  });

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

    const users = role.akun
      .map((a) => a.anggota)
      .filter((m): m is NonNullable<typeof m> => Boolean(m));

    return {
      id: role.idRole,
      name: role.namaRole,
      label: role.label,
      description: role.deskripsi,
      permissions,
      isSystem: Boolean(role.isSystem),
      userCount: role.akun.length,
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
  const role = await prisma.mRole.findUnique({
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
  });

  if (!role) return null;

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

  const users = role.akun
    .map((a) => a.anggota)
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return {
    id: role.idRole,
    name: role.namaRole,
    label: role.label,
    description: role.deskripsi,
    permissions,
    isSystem: Boolean(role.isSystem),
    userCount: role.akun.length,
    users,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
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
    namaLengkap: a.anggota.namaLengkap,
    email: a.anggota.email,
    fotoUrl: a.anggota.fotoUrl,
    currentRole: a.role.namaRole,
    idRole: a.role.idRole,
  }));
}
