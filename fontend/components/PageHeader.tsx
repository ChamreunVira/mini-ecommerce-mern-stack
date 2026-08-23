import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-9">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
