"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Logo3DViewerProps {
  className?: string;
}

export function Logo3DViewer({ className = "" }: Logo3DViewerProps) {
  const [isClient, setIsClient] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Load browser-native Web Component <model-viewer> secara dinamis
    if (typeof window !== "undefined" && !customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      script.crossOrigin = "anonymous";
      script.onload = () => setIsReady(true);
      document.head.appendChild(script);
    } else {
      setIsReady(true);
    }
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Radial Golden Glow di belakang Logo 3D */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[30rem] sm:w-[30rem] lg:h-[34rem] lg:w-[34rem]"
        style={{
          background: "radial-gradient(circle, rgba(255,178,44,0.45) 0%, rgba(255,160,0,0.15) 50%, transparent 70%)",
          animation: "pr-glow 6s ease-in-out infinite",
        }}
      />

      {/* Orbit Rings Efek Futuristik */}
      <div className="pointer-events-none absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full border border-[#FFB22C]/20 border-dashed animate-spin [animation-duration:45s]" />
      <div className="pointer-events-none absolute h-60 w-60 sm:h-80 sm:w-80 rounded-full border border-[#FFB22C]/10 [animation-duration:30s]" />

      {/* Kontainer 3D Canvas */}
      <div className="relative z-10 h-80 w-80 sm:h-[440px] sm:w-[440px] lg:h-[520px] lg:w-[520px]">
        {isClient && isReady ? (
          <model-viewer
            src="/logo-3d.glb"
            alt="Logo 3D Resmi UKM PERISAI UMI"
            auto-rotate
            rotation-per-second="25deg"
            camera-controls
            touch-action="pan-y"
            interaction-prompt="none"
            shadow-intensity="1.8"
            shadow-softness="0.85"
            exposure="1.25"
            camera-orbit="0deg 75deg 2.6m"
            min-camera-orbit="auto auto 1.8m"
            max-camera-orbit="auto auto 4.5m"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              outline: "none",
            }}
          >
            {/* Slot Poster: Tampil saat model 3D sedang didownload di background */}
            <div
              slot="poster"
              className="flex h-full w-full flex-col items-center justify-center p-6 transition-opacity duration-700"
            >
              <div className="relative h-44 w-44 sm:h-56 sm:w-56 animate-pulse">
                <Image
                  src="/logoperisaii.webp"
                  alt="Logo PERISAI UMI 3D Loading"
                  fill
                  sizes="224px"
                  className="object-contain drop-shadow-[0_0_25px_rgba(255,178,44,0.4)]"
                  priority
                />
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-full border border-[#FFB22C]/30 bg-[#1b1b1f]/80 px-4 py-1 text-xs font-semibold text-[#FFB22C] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#FFB22C] animate-ping" />
                <span>Memuat Interaksi 3D...</span>
              </div>
            </div>
          </model-viewer>
        ) : (
          /* SSR / Initial Poster */
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="relative h-44 w-44 sm:h-56 sm:w-56">
              <Image
                src="/logoperisaii.webp"
                alt="Logo PERISAI UMI 3D"
                fill
                sizes="224px"
                className="object-contain drop-shadow-[0_0_25px_rgba(255,178,44,0.3)]"
                priority
              />
            </div>
          </div>
        )}

        {/* Badge Interaktivitas 3D di Sudut Bawah */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 sm:bottom-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB22C]/40 bg-[#1b1b1f]/85 px-3.5 py-1 text-[11px] font-bold text-[#FFB22C] shadow-[0_4px_15px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all hover:bg-[#1b1b1f]">
            <svg
              className="h-3.5 w-3.5 animate-spin [animation-duration:8s]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Putar 360° • Interaktif 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
}
