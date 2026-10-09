import prisma from "@/lib/db";

export async function getAdminSettings() {
  return prisma.setting.findMany({
    orderBy: { key: "asc" },
  });
}
