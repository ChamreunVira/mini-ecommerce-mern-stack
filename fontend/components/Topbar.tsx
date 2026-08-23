"use client";

import { PanelLeft, UserRound, Bell, Sun } from "lucide-react";
import { useAppSelector } from "@/store/store";
import Avatar from "./Avatar";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`;

  return (
    <header className="h-[73px] shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={19} strokeWidth={1.75} />
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Avatar name={fullName} hasPhoto size={34} />
          <span className="text-sm font-semibold text-ink">{fullName}</span>
        </div>

        <span className="h-6 w-px bg-gray-200" />

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Account"
        >
          <UserRound size={19} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun size={17} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
