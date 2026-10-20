"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
import { extractYouTubeId } from "@/lib/youtube";
import { updateSettingsAction } from "../actions";

export interface SettingsFormProps {
  initialSettings: Array<{
    key: string;
    value: string;
    isPublic: boolean;
    description?: string | null;
  }>;
  canUpdate?: boolean;
}

interface SettingMeta {
  label: string;
  description: string;
  placeholder?: string;
  category: "video" | "identitas" | "kontak" | "lainnya";
}

const SETTING_METADATA: Record<string, SettingMeta> = {
  video_profile_url: {
    label: "URL Video Profil Resmi (YouTube)",
    description:
      "Tautan video profil resmi YouTube tahunan (mendukung format link pendek https://youtu.be/..., https://www.youtube.com/watch?v=..., embed, maupun kode iframe). Video ini langsung terhubung ke pemutar di beranda utama website.",
    placeholder: "Contoh: https://youtu.be/JWg_p9PfnTg atau https://www.youtube.com/watch?v=...",
    category: "video",
  },
  site_name: {
    label: "Nama Situs / Organisasi",
    description: "Nama resmi organisasi yang ditampilkan di seluruh penjuru website.",
    placeholder: "UKM PERISAI UMI",
    category: "identitas",
  },
  site_tagline: {
    label: "Tagline / Slogan Resmi",
    description: "Slogan utama yang merepresentasikan visi riset UKM PERISAI UMI.",
    placeholder: "Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia",
    category: "identitas",
  },
  current_generasi: {
    label: "Generasi Kepengurusan Aktif",
    description: "Nomor generasi kepengurusan aktif saat ini (misalnya: 11).",
    placeholder: "Contoh: 11",
    category: "identitas",
  },
  history_content: {
    label: "Ringkasan Sejarah Singkat",
    description: "Teks rangkuman sejarah pendirian UKM PERISAI UMI.",
    category: "identitas",
  },
  contact_email: {
    label: "Email Narahubung Resmi",
    description: "Alamat email resmi untuk persuratan dan kontak publik.",
    placeholder: "ukmperisai@umi.ac.id",
    category: "kontak",
  },
  contact_phone: {
    label: "Nomor WhatsApp / Telepon Narahubung",
    description: "Nomor kontak sekretariat yang aktif dihubungi.",
    placeholder: "+62 812-4489-9985",
    category: "kontak",
  },
  address: {
    label: "Alamat Sekretariat",
    description: "Lokasi fisik sekretariat organisasi di lingkungan kampus.",
    placeholder: "Gedung Menara UMI Lt. 4, Kampus II UMI, Makassar",
    category: "kontak",
  },
  instagram_url: {
    label: "Akun Instagram Resmi",
    description: "Tautan ke profil media sosial Instagram UKM PERISAI UMI.",
    placeholder: "https://instagram.com/ukmperisai_umi",
    category: "kontak",
  },
};

export function SettingsForm({
  initialSettings,
  canUpdate = true,
}: SettingsFormProps) {
  // Pastikan video_profile_url selalu ada di daftar pengaturan
  const normalizedInitial = [...initialSettings];
  if (!normalizedInitial.some((s) => s.key === "video_profile_url")) {
    normalizedInitial.unshift({
      key: "video_profile_url",
      value: "https://www.youtube.com/embed/JWg_p9PfnTg?si=87vTr-0un14kRxu6",
      isPublic: true,
      description: null,
    });
  }

  const [settings, setSettings] = useState(normalizedInitial);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleTogglePublic = (key: string, isPublic: boolean) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, isPublic } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const res = await updateSettingsAction(settings);
    setIsLoading(false);

    if (res.success) {
      const msg = "Pengaturan sistem dan link video profil berhasil disimpan!";
      setStatusMessage({ type: "success", text: msg });
      toast.success(msg);
    } else {
      const msg = res.message || "Gagal menyimpan pengaturan.";
      setStatusMessage({ type: "error", text: msg });
      toast.error(msg);
    }
  };

  // Video Profile Item khusus untuk live preview
  const videoSetting = settings.find((s) => s.key === "video_profile_url");
  const detectedVideoId = extractYouTubeId(videoSetting?.value);

  // Filter per kategori
  const videoSettings = settings.filter((s) => s.key === "video_profile_url");
  const identitasSettings = settings.filter((s) => {
    const meta = SETTING_METADATA[s.key];
    return meta?.category === "identitas";
  });
  const kontakSettings = settings.filter((s) => {
    const meta = SETTING_METADATA[s.key];
    return meta?.category === "kontak";
  });
  const otherSettings = settings.filter((s) => {
    const meta = SETTING_METADATA[s.key];
    return s.key !== "video_profile_url" && (!meta || meta.category === "lainnya");
  });

  const renderSettingItem = (item: (typeof settings)[0], isFullWidth = false) => {
    const meta = SETTING_METADATA[item.key] || {
      label: item.key,
      description: item.description || "Pengaturan kustom aplikasi.",
      placeholder: "",
    };

    return (
      <div
        key={item.key}
        className={`rounded-2xl border border-white/10 bg-[#202026] p-5 sm:p-6 space-y-3.5 shadow-lg hover:border-white/20 transition-all flex flex-col justify-between ${
          isFullWidth ? "md:col-span-2" : "col-span-1"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white tracking-wide">
                {meta.label}
              </span>
              <code className="text-[10px] text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                {item.key}
              </code>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {meta.description}
            </p>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none shrink-0 pt-0.5 hover:text-zinc-200 transition-colors">
            <input
              type="checkbox"
              checked={item.isPublic}
              onChange={(e) => handleTogglePublic(item.key, e.target.checked)}
              className="rounded border-white/20 bg-[#16161a] text-[#FFB22C] accent-[#FFB22C] focus:ring-[#FFB22C] h-4 w-4"
            />
            <span>Publik</span>
          </label>
        </div>

        <div className="pt-1">
          <Input
            value={item.value}
            onChange={(e) => handleChange(item.key, e.target.value)}
            placeholder={meta.placeholder}
            className="w-full text-sm"
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "success" : "error"}
          title={statusMessage.type === "success" ? "Pembaruan Berhasil" : "Gagal Memperbarui"}
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage.text}
        </Alert>
      )}

      {/* 1. SEKSI VIDEO PROFIL RESMI */}
      {videoSetting && (
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎬</span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Video Profil Resmi Organisasi (Update Tahunan)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Ganti atau perbarui tautan video YouTube ini setiap pergantian periode kepengurusan untuk memperbarui video di beranda situs.
            </p>
          </div>

          <div className="rounded-2xl border border-[#FFB22C]/35 bg-[#1e1e24] p-5 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                    URL Video Profil Resmi (YouTube)
                  </span>
                  <code className="text-[10px] text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                    video_profile_url
                  </code>
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  Tautan video profil resmi YouTube tahunan (mendukung format link pendek https://youtu.be/..., reguler watch?v=..., embed, maupun iframe). Video ini langsung terhubung ke pemutar video di beranda utama website.
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-300 font-medium cursor-pointer select-none shrink-0 pt-0.5">
                <input
                  type="checkbox"
                  checked={videoSetting.isPublic}
                  onChange={(e) => handleTogglePublic(videoSetting.key, e.target.checked)}
                  className="rounded border-white/20 bg-[#16161a] text-[#FFB22C] accent-[#FFB22C] focus:ring-[#FFB22C] h-4 w-4"
                />
                <span>Publik</span>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Tautan Video YouTube
                  </label>
                  <Input
                    value={videoSetting.value}
                    onChange={(e) => handleChange(videoSetting.key, e.target.value)}
                    placeholder="Contoh: https://youtu.be/JWg_p9PfnTg atau https://www.youtube.com/watch?v=..."
                    className="w-full text-sm"
                  />
                </div>

                {detectedVideoId ? (
                  <div className="space-y-2 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-950/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-400 flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Video YouTube Terverifikasi</span>
                      </span>
                      <a
                        href={`https://www.youtube.com/watch?v=${detectedVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-[#FFB22C] text-xs underline inline-flex items-center gap-1"
                      >
                        <span>Uji Putar di YouTube</span>
                        <span>↗</span>
                      </a>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400">
                      ID Video: <span className="text-white font-bold">{detectedVideoId}</span>
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300">
                    ⚠️ ID video YouTube belum terdeteksi. Silakan tempelkan tautan yang valid (contoh: <code>https://youtu.be/JWg_p9PfnTg</code>).
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                {detectedVideoId ? (
                  <div className="w-full">
                    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-[#FFB22C]/30 bg-black shadow-2xl">
                      <iframe
                        src={`https://www.youtube.com/embed/${detectedVideoId}?rel=0`}
                        title="Live Preview Video Profil UKM PERISAI UMI"
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <p className="mt-2 text-center text-[11px] text-zinc-400">
                      Video di atas akan langsung ditayangkan di bagian <strong>Video Profile</strong> beranda publik.
                    </p>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-2xl border border-dashed border-white/10 bg-[#16161a] flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                    <svg className="w-12 h-12 mb-2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-semibold text-zinc-400">Pratinjau Pemutar Video</p>
                    <p className="text-[11px] text-zinc-500 mt-1">Masukkan URL YouTube di sebelah kiri untuk melihat pratinjau live video.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SEKSI IDENTITAS & PROFIL */}
      {identitasSettings.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏛️</span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Identitas & Profil Organisasi
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Pengaturan nama resmi, generasi kepengurusan aktif, dan ringkasan profil.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {identitasSettings.map((item) =>
              renderSettingItem(item, item.key === "history_content")
            )}
          </div>
        </div>
      )}

      {/* 3. SEKSI KONTAK & MEDIA SOSIAL */}
      {kontakSettings.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Kontak & Media Sosial
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Informasi narahubung sekretariat, nomor telepon WhatsApp, dan tautan sosial media.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {kontakSettings.map((item) =>
              renderSettingItem(item, item.key === "address")
            )}
          </div>
        </div>
      )}

      {/* 4. SEKSI LAINNYA */}
      {otherSettings.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Pengaturan Lainnya
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {otherSettings.map((item) => renderSettingItem(item))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      {canUpdate && (
        <div className="sticky bottom-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/15 bg-[#1b1b22]/95 backdrop-blur-md shadow-2xl">
          <p className="text-xs text-zinc-400 text-center sm:text-left">
            Semua perubahan konfigurasi langsung diterapkan secara instan ke halaman publik.
          </p>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-6 bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#141417] font-extrabold hover:brightness-110 shadow-lg shadow-[#FFB22C]/20 transition-all shrink-0"
            isLoading={isLoading}
          >
            {isLoading ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}
          </Button>
        </div>
      )}
    </form>
  );
}
