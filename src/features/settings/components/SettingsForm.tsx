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

export function SettingsForm({ initialSettings }: SettingsFormProps) {
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

  const renderSettingItem = (item: (typeof settings)[0]) => {
    const meta = SETTING_METADATA[item.key] || {
      label: item.key,
      description: item.description || "Pengaturan kustom aplikasi.",
      placeholder: "",
    };

    const isVideo = item.key === "video_profile_url";

    return (
      <div
        key={item.key}
        className={`rounded-2xl border ${
          isVideo ? "border-[#FFB22C]/40 bg-[#1e1e26]" : "border-white/10 bg-[#202026]"
        } p-5 space-y-3 shadow-lg transition-all`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
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

          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none shrink-0 pt-0.5">
            <input
              type="checkbox"
              checked={item.isPublic}
              onChange={(e) => handleTogglePublic(item.key, e.target.checked)}
              className="rounded border-white/20 bg-[#16161a] text-[#FFB22C] accent-[#FFB22C] focus:ring-[#FFB22C] h-4 w-4"
            />
            Publik
          </label>
        </div>

        <div>
          <Input
            value={item.value}
            onChange={(e) => handleChange(item.key, e.target.value)}
            placeholder={meta.placeholder}
            className="w-full text-sm"
          />
        </div>

        {/* Khusus Video Profile: Tampilkan Live Preview Player */}
        {isVideo && (
          <div className="mt-4 pt-3 border-t border-white/10">
            {detectedVideoId ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#FFB22C] flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Video YouTube Terverifikasi (ID: <code className="text-white font-mono">{detectedVideoId}</code>)</span>
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

                {/* Player Frame Preview */}
                <div className="group relative aspect-video w-full max-w-lg overflow-hidden rounded-xl border border-[#FFB22C]/30 bg-black shadow-xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${detectedVideoId}?rel=0`}
                    title="Live Preview Video Profil UKM PERISAI UMI"
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Video di atas akan langsung ditayangkan di bagian <strong>Video Profile</strong> beranda publik.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300">
                ⚠️ ID video YouTube belum terdeteksi. Silakan tempelkan tautan yang valid (contoh: <code>https://youtu.be/JWg_p9PfnTg</code> atau <code>https://www.youtube.com/watch?v=...</code>).
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
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
        <div className="space-y-4">
          {videoSettings.map(renderSettingItem)}
        </div>
      </div>

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
          <div className="space-y-4">
            {identitasSettings.map(renderSettingItem)}
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
          <div className="space-y-4">
            {kontakSettings.map(renderSettingItem)}
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
          <div className="space-y-4">
            {otherSettings.map(renderSettingItem)}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <p className="text-xs text-zinc-500">
          Semua perubahan langsung diterapkan ke halaman publik.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="bg-gradient-to-r from-[#FFB22C] to-[#FFA000] text-[#141417] font-bold hover:brightness-110 shadow-lg shadow-[#FFB22C]/20 transition-all"
          isLoading={isLoading}
        >
          {isLoading ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}
        </Button>
      </div>
    </form>
  );
}
