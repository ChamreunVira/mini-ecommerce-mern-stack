import { Check, Clock, Truck, PackageCheck, XCircle } from "lucide-react";
import { OrderStatus } from "@/types";

const STEPS: { key: OrderStatus; label: string; icon: any }[] = [
  { key: "PENDING", label: "បញ្ជាទិញ", icon: Clock },
  { key: "CONFIRMED", label: "បានបញ្ជាក់", icon: Check },
  { key: "SHIPPED", label: "កំពុងដឹកជញ្ជូន", icon: Truck },
  { key: "DELIVERED", label: "បានដឹកដល់", icon: PackageCheck },
];

const ORDER_INDEX: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: -1,
};

export default function OrderStatusTracker({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-semibold">
        <XCircle size={18} />
        ការបញ្ជាទិញនេះត្រូវបានបោះបង់ (Cancelled)
      </div>
    );
  }

  const currentIdx = ORDER_INDEX[status] ?? 0;

  return (
    <div className="py-6 border-y border-gray-200">
      <div className="flex items-center justify-between relative max-w-xl mx-auto">
        {/* Progress bar line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0">
          <div
            className="h-full bg-[#0a0a0a] transition-all duration-500"
            style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((s, i) => {
          const completed = i <= currentIdx;
          const Icon = s.icon;
          return (
            <div key={s.key} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  completed
                    ? "bg-[#0a0a0a] border-[#0a0a0a] text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <Icon size={14} />
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  completed ? "text-[#0a0a0a] font-bold" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
