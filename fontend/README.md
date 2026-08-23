# kdmv Admin

A clone of the kdmv store admin dashboard — Dashboard, Products, Coupons,
Users, and Banners — built with Next.js (App Router), Tailwind CSS, and
Redux Toolkit for global state, backed by mock data.

## Stack

- **Next.js** (App Router, latest)
- **Tailwind CSS**
- **Redux Toolkit** + **react-redux** — one slice per resource
  (`products`, `coupons`, `users`, `banners`, `orders`, `dashboard`,
  `settings`, `auth`), all seeded with mock data in `store/slices/`
- **recharts** — revenue bar chart + order/payment status donut charts
- **lucide-react** — icon set

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects straight to `/dashboard`.

## Structure

```
app/
  (admin)/
    layout.js        # sidebar + topbar shell shared by every page
    dashboard/
    products/
    coupons/
    users/
    banners/
    orders/           # not in the reference screenshots, built for nav completeness
    collections/       # intentionally minimal, per instructions
    settings/           # intentionally minimal, per instructions
components/
  Sidebar.jsx, Topbar.jsx, PageHeader.jsx, PrimaryButton.jsx,
  StatusBadge.jsx, RowActions.jsx, Avatar.jsx, ImageThumb.jsx, StatCard.jsx
  charts/RevenueChart.jsx, charts/DonutChart.jsx
store/
  store.js, StoreProvider.jsx, slices/*.js
```

## Notes

- All data is mock/in-memory via Redux — nothing is persisted or fetched.
  Wire the slices' async thunks up to real API routes when the backend
  (per the MVP spec) is ready.
- Product/banner images are rendered as colored placeholder thumbnails
  (no real image assets were provided) — swap `ImageThumb` for a real
  `<Image>` once URLs exist.
- The font stack falls back to the system sans-serif stack rather than
  `next/font/google` (Inter), since this environment couldn't reach
  Google Fonts at build time — swap back to `next/font/google` freely
  once you have network access.
