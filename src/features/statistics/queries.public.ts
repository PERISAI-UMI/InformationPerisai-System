import { cache } from "react";
import prisma from "@/lib/db";

export const getPublicStatistics = cache(async function getPublicStatistics() {
  try {
    const [totalPengurus, totalDept, totalPrestasi, totalProker] = await Promise.all([
      prisma.tKepengurusan.count({
        where: {
          periode: { isActive: 1 },
          status: "aktif",
        },
      }),
      prisma.mDepartemen.count({
        where: { isActive: 1 },
      }),
      prisma.tPrestasi.count(),
      prisma.tProker.count(),
    ]);

    return [
      {
        id: "stat-pengurus",
        label: "Pengurus Aktif",
        value: totalPengurus > 0 ? String(totalPengurus) : "42",
        description: "Fungsionaris Aktif Periode Berjalan",
        orderIndex: 1,
        isActive: true,
      },
      {
        id: "stat-departemen",
        label: "Departemen & Badan",
        value: totalDept > 0 ? String(totalDept) : "8",
        description: "Pilar bidang keilmuan dan riset",
        orderIndex: 2,
        isActive: true,
      },
      {
        id: "stat-prestasi",
        label: "Prestasi Ilmiah",
        value: totalPrestasi > 0 ? `${totalPrestasi}+` : "50+",
        description: "Tingkat nasional & regional",
        orderIndex: 3,
        isActive: true,
      },
      {
        id: "stat-proker",
        label: "Karya & Inovasi",
        value: totalProker > 0 ? `${totalProker}+` : "25+",
        description: "Prototipe, KTI, dan PKM didanai",
        orderIndex: 4,
        isActive: true,
      },
    ];
  } catch (error) {
    console.error("Gagal menghitung statistik real:", error);
    return [
      { id: "stat-1", label: "Pengurus Aktif", value: "42", description: "Fungsionaris Generasi 11", orderIndex: 1, isActive: true },
      { id: "stat-2", label: "Departemen & Badan", value: "8", description: "Pilar keilmuan dan riset", orderIndex: 2, isActive: true },
      { id: "stat-3", label: "Prestasi Ilmiah", value: "50+", description: "Tingkat nasional & regional", orderIndex: 3, isActive: true },
      { id: "stat-4", label: "Karya & Inovasi", value: "25+", description: "Prototipe, KTI, dan PKM didanai", orderIndex: 4, isActive: true },
    ];
  }
});
