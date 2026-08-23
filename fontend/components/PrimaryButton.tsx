"use client";

import { ReactNode } from "react";
import { Loader2, Plus } from "lucide-react";

type Variant = "primary" | "secondary" | "danger";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: boolean;
  type?: "button" | "submit";
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-gray-800",
  secondary: "border border-gray-200 bg-white text-ink hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function PrimaryButton({
  children,
  onClick,
  icon = true,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
      ) : (
        icon && <Plus size={16} strokeWidth={2.5} />
      )}
      {children}
    </button>
  );
}
