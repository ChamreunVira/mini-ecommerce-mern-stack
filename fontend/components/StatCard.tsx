import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  footnote?: string;
  trend?: string;
  icon?: LucideIcon;
}

export default function StatCard({ label, value, footnote, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && <Icon size={18} className="text-gray-400" strokeWidth={1.75} />}
      </div>
      <div className="mt-4 text-[28px] font-extrabold tracking-tight text-ink">
        {value}
      </div>
      {trend ? (
        <p className="mt-1.5 text-sm text-gray-500">
          <span className="text-green-600 font-medium">↑ {trend}</span> from last period
        </p>
      ) : (
        footnote && <p className="mt-1.5 text-sm text-gray-500">{footnote}</p>
      )}
    </div>
  );
}
