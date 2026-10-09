"use client";

import React from "react";
import { Dialog } from "@/components/ui/Dialog";

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  caption?: string | null;
}

export function Lightbox({ isOpen, onClose, imageUrl, caption }: LightboxProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-4xl p-2 bg-black/90">
      <div className="relative flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={caption || "Preview"}
          className="max-h-[80vh] w-auto object-contain rounded-lg"
        />
        {caption && (
          <p className="mt-3 text-center text-sm text-zinc-300 font-medium">
            {caption}
          </p>
        )}
      </div>
    </Dialog>
  );
}
