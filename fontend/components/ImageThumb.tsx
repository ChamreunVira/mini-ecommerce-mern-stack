import { ImageOff } from "lucide-react";

interface ImageThumbProps {
  color?: string;
  size?: number;
  rounded?: string;
}

export default function ImageThumb({
  color = "#111827",
  size = 44,
  rounded = "rounded-lg",
}: ImageThumbProps) {
  return (
    <div
      style={{ width: size, height: size, background: color }}
      className={`flex shrink-0 items-center justify-center ${rounded}`}
    >
      <ImageOff size={size * 0.4} strokeWidth={1.5} className="text-white/30" />
    </div>
  );
}
