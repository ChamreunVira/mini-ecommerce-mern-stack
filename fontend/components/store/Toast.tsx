"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { dismissToast } from "@/store/slices/uiSlice";

const ICONS = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error: <XCircle size={18} className="text-red-500 shrink-0" />,
  info: <Info size={18} className="text-blue-500 shrink-0" />,
};

function ToastItem({ id, type, message }: { id: string; type: "success" | "error" | "info"; message: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(id)), 4000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <div className="flex items-start gap-3 bg-white border border-gray-200 shadow-md rounded-sm px-4 py-3 min-w-[280px] max-w-sm animate-in slide-in-from-right-4 fade-in duration-200">
      {ICONS[type]}
      <p className="text-sm text-[#0a0a0a] flex-1">{message}</p>
      <button
        type="button"
        onClick={() => dispatch(dismissToast(id))}
        className="text-gray-400 hover:text-[#0a0a0a] ml-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function Toast() {
  const toasts = useAppSelector((s) => s.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
