import { getAdminSettings } from "@/features/settings/queries.admin";
import { SettingsForm } from "@/features/settings/components/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Pengaturan Sistem
        </h1>
        <p className="text-sm text-zinc-500">
          Konfigurasi informasi umum situs, kontak narahubung, dan variabel aplikasi.
        </p>
      </div>

      <SettingsForm
        initialSettings={settings.map((s) => ({
          key: s.key,
          value: s.value || "",
          isPublic: true,
          description: null,
        }))}
      />
    </div>
  );
}
