import { User } from "lucide-react";

const PALETTE = [
  { bg: "#1d4ed8", fg: "#dbeafe" },
  { bg: "#0f766e", fg: "#ccfbf1" },
  { bg: "#b45309", fg: "#fef3c7" },
  { bg: "#be123c", fg: "#ffe4e6" },
  { bg: "#6d28d9", fg: "#ede9fe" },
];

function colorFor(name = "") {
  const code = name.charCodeAt(0) || 0;
  return PALETTE[code % PALETTE.length];
}

interface AvatarProps {
  name?: string;
  size?: number;
  hasPhoto?: boolean;
}

export default function Avatar({ name = "?", size = 36, hasPhoto = false }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!hasPhoto) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400"
      >
        <User size={size * 0.55} strokeWidth={1.75} />
      </div>
    );
  }

  const { bg, fg } = colorFor(name);
  return (
    <div
      style={{ width: size, height: size, background: bg, color: fg }}
      className="flex shrink-0 items-center justify-center rounded-full font-semibold"
    >
      <span style={{ fontSize: size * 0.38 }}>{initials}</span>
    </div>
  );
}
