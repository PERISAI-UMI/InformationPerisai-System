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

export function AuditTable({ logs }: AuditTableProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada riwayat aktivitas yang tercatat.
      </div>
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
            <TableCell className="text-xs font-mono">{formatDateTimeWITA(log.createdAt)}</TableCell>
            <TableCell className="text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {log.user?.name || "Sistem"}
              </span>
              {log.user && <span className="block text-zinc-400">{log.user.email}</span>}
            </TableCell>
            <TableCell>
              <Badge variant="primary">{log.action}</Badge>
            </TableCell>
            <TableCell className="text-xs font-mono">{log.resource}</TableCell>
            <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm truncate">
              {log.details || "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
