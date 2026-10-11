"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "@/components/ui/Toast";

export interface AdminNotificationBellProps {
  initialUnreadCount?: number;
}

export function AdminNotificationBell({
  initialUnreadCount = 0,
}: AdminNotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const requestPushPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser Anda tidak mendukung Web Push Notification.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        toast.success("Push Notifikasi browser berhasil diaktifkan!", {
          pushToBrowser: true,
          title: "Notifikasi Aktif",
        });
      } else if (result === "denied") {
        toast.warning("Izin push notification ditolak di pengaturan browser Anda.");
      }
    } catch (err) {
      console.error("Gagal meminta izin notifikasi:", err);
      toast.error("Gagal meminta izin notifikasi.");
    }
  };

  const triggerTestNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("UKM PERISAI UMI — Pemberitahuan", {
          body: "Push notification berfungsi secara normal! Sistem siap memantau aktivitas riset.",
          icon: "/logoperisaii.png",
        });
      } catch {
        // Fallback
      }
    }
    toast.success("Notifikasi uji coba berhasil dikirim!", {
      title: "Uji Coba Push Notif",
      pushToBrowser: true,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pusat Pemberitahuan"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:border-[#FFB22C]/40 hover:text-[#FFB22C] hover:bg-[#FFB22C]/10 transition-all cursor-pointer"
      >
        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Pulsing indicator badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#FFB22C] opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FFB22C] border-2 border-[#1a1a20]" />
        </span>
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#202026]/95 backdrop-blur-2xl shadow-2xl z-50 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Pusat Pemberitahuan
              </h4>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
              Sistem Aktif
            </span>
          </div>

          {/* Web Push Notification Status & Controls */}
          <div className="rounded-xl border border-white/10 bg-[#16161a] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Push Notifikasi Browser
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  permission === "granted"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : permission === "denied"
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                    : "bg-[#FFB22C]/15 text-[#FFB22C] border border-[#FFB22C]/30"
                }`}
              >
                {permission === "granted"
                  ? "Aktif"
                  : permission === "denied"
                  ? "Diblokir"
                  : "Belum Aktif"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Dapatkan pesan peringatan, pesan masuk baru, dan status sistem langsung di desktop atau ponsel Anda.
            </p>

            <div className="flex items-center gap-2 pt-1">
              {permission !== "granted" ? (
                <button
                  type="button"
                  onClick={requestPushPermission}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FFB22C] px-3 py-1.5 text-xs font-bold text-[#16161a] hover:bg-[#FFA000] transition cursor-pointer"
                >
                  Izinkan Notifikasi Push
                </button>
              ) : (
                <button
                  type="button"
                  onClick={triggerTestNotification}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <svg className="w-3 h-3 text-[#FFB22C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Tes Notifikasi Push
                </button>
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-1.5">
            <Link
              href="/admin/inbox"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFB22C]/10 text-[#FFB22C]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#FFB22C] transition-colors">
                    Pesan Masuk Pengunjung
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Cek aspirasi dan pertanyaan riset
                  </p>
                </div>
              </div>
              <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">→</span>
            </Link>

            <Link
              href="/admin/audit-log"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                    Log Audit & Keamanan
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Aktivitas sistem dan pengurus
                  </p>
                </div>
              </div>
              <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">→</span>
            </Link>
          </div>

          <div className="pt-1 text-center">
            <span className="text-[10px] text-zinc-500">
              Notifikasi real-time UKM PERISAI UMI
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
