import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDateTimeWITA } from "@/lib/dates";

export interface AuditTableProps {
  logs: Array<{
    id: string;
    action: string;
    resource: string;
    resourceId?: string | null;
    details?: string | null;
    ipAddress?: string | null;
    createdAt: Date | string;
    user?: { name: string; email: string } | null;
  }>;
}

import { EmptyState } from "@/components/common/EmptyState";

export function AuditTable({ logs }: AuditTableProps) {
  if (!logs || logs.length === 0) {
    return (
      <EmptyState
        type="empty"
        title="Belum Ada Riwayat Aktivitas"
        description="Belum ada catatan log aktivitas pengurus atau sistem yang terekam pada basis data audit."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Waktu (WITA)</TableHead>
          <TableHead>Pengguna / Pelaku</TableHead>
          <TableHead>Aksi</TableHead>
          <TableHead>Modul</TableHead>
          <TableHead>Keterangan Rinci</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="text-xs font-mono text-zinc-400">{formatDateTimeWITA(log.createdAt)}</TableCell>
            <TableCell className="text-xs">
              <span className="font-semibold text-white">
                {log.user?.name || "Sistem"}
              </span>
              {log.user && <span className="block text-zinc-500 font-normal">{log.user.email}</span>}
            </TableCell>
            <TableCell>
              <Badge variant="primary">{log.action}</Badge>
            </TableCell>
            <TableCell className="text-xs font-mono text-zinc-300">{log.resource}</TableCell>
            <TableCell className="text-xs text-zinc-400 max-w-sm truncate">
              {log.details || "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
