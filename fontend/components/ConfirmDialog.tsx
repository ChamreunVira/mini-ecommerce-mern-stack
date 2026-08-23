"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import Modal from "./Modal";
import PrimaryButton from "./PrimaryButton";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [working, setWorking] = useState(false);

  async function handleConfirm() {
    setWorking(true);
    try {
      await onConfirm();
    } finally {
      setWorking(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={working ? () => {} : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <PrimaryButton icon={false} variant="secondary" onClick={onCancel} disabled={working}>
            Cancel
          </PrimaryButton>
          <PrimaryButton icon={false} variant="danger" onClick={handleConfirm} loading={working}>
            {working ? "Working…" : confirmLabel}
          </PrimaryButton>
        </>
      }
    >
      <div className="flex gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert size={19} />
        </span>
        <p className="pt-2 text-sm leading-relaxed text-gray-600">{message}</p>
      </div>
    </Modal>
  );
}
