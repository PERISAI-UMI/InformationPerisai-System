import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ResponsiveImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: "video" | "square" | "banner";
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  width = 800,
  height = 500,
  className,
  aspectRatio = "video",
  priority = false,
}: ResponsiveImageProps) {
  const fallback = "/og-default.jpg";
  const imageSrc = src || fallback;

  const aspectStyles = {
    video: "aspect-video",
    square: "aspect-square",
    banner: "aspect-[21/9]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-zinc-100 dark:bg-zinc-800",
        aspectStyles[aspectRatio],
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="h-full w-full object-cover transition duration-300 hover:scale-105"
      />
    </div>
  );
}
