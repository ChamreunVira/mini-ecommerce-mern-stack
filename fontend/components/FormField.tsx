import { ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-400";

export const inputErrorClass =
  "w-full rounded-xl border border-red-300 bg-red-50/40 px-4 py-2.5 text-sm text-ink outline-none focus:border-red-400";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  /** Span both columns inside a two-column grid. */
  wide?: boolean;
}

export default function FormField({ label, error, hint, children, wide }: FormFieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-gray-600">{label}</span>
      {children}
      {error ? (
        <span className="text-xs font-medium text-red-600">{error}</span>
      ) : (
        hint && <span className="text-xs text-gray-400">{hint}</span>
      )}
    </label>
  );
}
