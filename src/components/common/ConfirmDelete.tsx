"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface ConfirmDeleteProps {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  triggerText?: string;
  className?: string;
  showIcon?: boolean;
}

export function ConfirmDelete({
  title = "Konfirmasi Penghapusan",
  description = "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?",
  onConfirm,
  triggerText = "Hapus",
  className,
  showIcon = true,
}: ConfirmDeleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (err) {
      console.error("Gagal saat konfirmasi:", err);
      toast.error("Terjadi galat saat memproses penghapusan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        className={cn(
          "px-2.5 py-1.5 rounded-lg text-xs font-semibold gap-1 inline-flex items-center shrink-0 shadow-sm",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {showIcon && (
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
        <span>{triggerText}</span>
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        description={description}
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            Ya, Hapus Data
          </Button>
        </div>
      </Dialog>
    </>
  );
}
