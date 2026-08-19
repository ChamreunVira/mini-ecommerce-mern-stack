"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Copy, Edit2, Trash2, Eye } from "lucide-react";
import { store } from "@/lib/store";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "success" | "warning";
}

interface ActionDropdownProps {
  id: string;
  idLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  customActions?: ActionItem[];
}

export default function ActionDropdown({
  id,
  idLabel = "ID",
  onEdit,
  onDelete,
  onView,
  customActions = [],
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.copyToClipboard(id, idLabel);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-ink/70 hover:bg-surface hover:text-ink transition-colors shadow-sm focus:outline-none"
        aria-label="More options"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-50 w-48 rounded-xl border border-border bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          {/* Copy ID Action */}
          <button
            type="button"
            onClick={handleCopyId}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-ink/80 hover:bg-slate-50 hover:text-ink transition-colors"
          >
            <Copy size={14} className="text-slate-500" />
            Copy {idLabel}
          </button>

          {onView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-ink/80 hover:bg-slate-50 hover:text-ink transition-colors"
            >
              <Eye size={14} className="text-blue-500" />
              View Details
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-ink/80 hover:bg-slate-50 hover:text-ink transition-colors"
            >
              <Edit2 size={14} className="text-amber-500" />
              Edit Item
            </button>
          )}

          {customActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                action.variant === "danger"
                  ? "text-rose-600 hover:bg-rose-50"
                  : action.variant === "success"
                  ? "text-emerald-600 hover:bg-emerald-50"
                  : action.variant === "warning"
                  ? "text-amber-600 hover:bg-amber-50"
                  : "text-ink/80 hover:bg-slate-50 hover:text-ink"
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}

          {onDelete && (
            <>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 size={14} className="text-rose-500" />
                Delete Item
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
