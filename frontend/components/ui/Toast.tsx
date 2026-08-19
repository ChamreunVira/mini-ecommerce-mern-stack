"use client";

import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { store, useToasts } from "@/lib/store";

export default function ToastContainer() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isInfo = toast.type === "info";
        const isWarning = toast.type === "warning";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? "bg-slate-900 border-emerald-500/40 text-white"
                : isInfo
                ? "bg-slate-900 border-blue-500/40 text-white"
                : isWarning
                ? "bg-slate-900 border-amber-500/40 text-white"
                : "bg-slate-900 border-rose-500/40 text-white"
            }`}
          >
            {isSuccess && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
            {isInfo && <Info size={18} className="text-blue-400 shrink-0" />}
            {isWarning && <AlertTriangle size={18} className="text-amber-400 shrink-0" />}
            {isError && <XCircle size={18} className="text-rose-400 shrink-0" />}

            <p className="text-xs font-medium flex-1">{toast.text}</p>

            <button
              onClick={() => store.removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
