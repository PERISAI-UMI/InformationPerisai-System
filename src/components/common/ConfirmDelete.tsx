"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export interface ConfirmDeleteProps {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  triggerText?: string;
  className?: string;
}

export function ConfirmDelete({
  title = "Konfirmasi Penghapusan",
  description = "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?",
  onConfirm,
  triggerText = "Hapus",
  className,
}: ConfirmDeleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {triggerText}
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
