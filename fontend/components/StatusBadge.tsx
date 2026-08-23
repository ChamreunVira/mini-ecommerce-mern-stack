const STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  "in stock": "text-green-700 bg-transparent px-0",
  inactive: "text-red-600 bg-transparent px-0",
  deleted: "text-red-400 bg-transparent px-0 line-through",
  pending: "bg-orange-50 text-orange-600",
  confirmed: "bg-teal-50 text-teal-700",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
  paid: "bg-green-50 text-green-700",
  unpaid: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = status?.toLowerCase();
  const className = STYLES[key] ?? "bg-gray-100 text-gray-600";
  const pill = className.includes("px-0") ? "" : "rounded-full px-2.5 py-0.5";

  return (
    <span className={`inline-flex items-center text-xs font-medium ${pill} ${className}`}>
      {status}
    </span>
  );
}
