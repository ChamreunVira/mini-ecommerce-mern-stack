import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: number;
}

export default function Rating({ value, reviewCount, size = 14 }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(value) ? "fill-rating text-rating" : "fill-border text-border"}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink/60 tabular">({reviewCount})</span>
      )}
    </div>
  );
}
