import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", subtitle: "On all orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% secure payment" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "30 days return policy" },
  { icon: Headset, title: "24/7 Support", subtitle: "Dedicated support" },
];

export default function FeatureStrip() {
  return (
    <section className="grid grid-cols-2 gap-4 rounded-card border border-border p-6 sm:grid-cols-4">
      {features.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex items-center gap-3">
          <Icon size={22} className="shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-ink">{title}</p>
            <p className="text-xs text-ink/50">{subtitle}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
