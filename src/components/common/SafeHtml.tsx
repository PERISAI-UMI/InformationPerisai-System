import React from "react";
import { sanitizeHtml } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

export interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const cleanHtml = sanitizeHtml(html);

  return (
    <div
      className={cn("prose prose-zinc dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
