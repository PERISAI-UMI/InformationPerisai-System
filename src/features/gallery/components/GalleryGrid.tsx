"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";

export interface GalleryGridProps {
  items: Array<{
    id: string;
    url: string;
    originalName: string;
    createdAt?: Date | string;
  }>;
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string } | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
        Belum ada dokumentasi galeri.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage({ url: item.url, caption: item.originalName })}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-zinc-100 transition hover:opacity-90 dark:bg-zinc-800"
          >
            <Image
              src={item.url}
              alt={item.originalName}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition group-hover:opacity-100 flex items-end p-3">
              <span className="text-xs text-white truncate font-medium">
                {item.originalName}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url}
        caption={selectedImage?.caption}
      />
    </>
  );
}
