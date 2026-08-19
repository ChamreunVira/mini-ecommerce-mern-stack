import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All categories", href: "/category/all" },
      { label: "Deals", href: "/category/all" },
      { label: "New arrivals", href: "/category/all" },
    ],
  },
  {
    title: "Sell on Marlo",
    links: [
      { label: "Become a seller", href: "/seller/onboarding" },
      { label: "Seller dashboard", href: "/seller/dashboard" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track order", href: "/account/orders" },
      { label: "Returns", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <span className="font-display text-lg font-bold text-ink">Marlo</span>
          <p className="mt-2 text-sm text-ink/60">
            A marketplace for independent sellers and everyday finds.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ink/60 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-ink/50 sm:px-6">
        © {new Date().getFullYear()} Marlo Market. All rights reserved.
      </div>
    </footer>
  );
}
