import prisma from "@/lib/db";
import { getPublicStatistics } from "./queries.public";

export async function getAdminStatistics() {
  const stats = await getPublicStatistics();
  return stats.map(s => ({
    id: s.id,
    label: s.label,
    value: s.value,
    description: s.description,
    sortOrder: s.orderIndex,
    isActive: 1,
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }));
}

export async function getAdminStatisticById(id: string) {
  const stats = await getAdminStatistics();
  return stats.find(s => s.id === id) || null;
}
