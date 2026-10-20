import { getAdminSettings } from "@/features/settings/queries.admin";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { requirePermission } from "@/lib/permissions.server";
import { hasPermission } from "@/lib/permissions";

export default async function AdminSettingsPage() {
  const session = await requirePermission("settings:read");
  const user = session.user;
  const canUpdate = hasPermission(user, "settings:update");

  const settings = await getAdminSettings();

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FFB22C] shadow-[0_0_8px_#FFB22C]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFB22C]">
              Sistem & Keamanan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Pengaturan Sistem
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-light">
            Konfigurasi informasi umum situs, video profil organisasi, kontak narahubung, dan variabel aplikasi.
          </p>
        </div>
      </div>

      <SettingsForm
        initialSettings={settings.map((s) => ({
          key: s.key,
          value: s.value || "",
          isPublic: true,
          description: null,
        }))}
        canUpdate={canUpdate}
      />
    </div>
  );
}
