# Marlo — E-commerce Marketplace (Next.js)

A buyer-facing marketplace front end scaffolded from a 4-page design brief: **Home, Category, Product Detail, Cart**. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Verified with a clean production build (`npm run build`) before delivery.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Pages are statically generated at build time from the mock data in `lib/data.ts`.

## What's implemented

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Hero, feature strip, category grid, best sellers |
| Category | `/category/[slug]` | Breadcrumb, banner, filter sidebar, sortable grid. Try `/category/all`, `/category/men`, etc. |
| Product detail | `/product/[id]` | Gallery, color/size/qty selectors, tabs, related products |
| Cart | `/cart` | Editable quantities, remove line, live order summary, upsell row |

All four pages share one `Navbar` / `Footer` via `app/layout.tsx`.

## Design tokens

Defined in `tailwind.config.ts`:
- **Colors** — `primary` (blue, #2F5FF6), `ink` (text, #14213D), `surface` (light backgrounds), `sale` (discount red), `rating` (star amber)
- **Type** — Sora for headings (`font-display`), Inter for body/UI (`font-body`)

Change these two files and the whole app restyles consistently.

## What's mocked vs. real

This is a **front-end layout scaffold**, not a full backend:
- Product/category data lives in `lib/data.ts` — swap this for real API/DB calls later (the function signatures like `getProductBySlug`, `getProductsByCategory` are designed to become async fetches without touching the pages).
- Cart state is local `useState` in `components/cart/CartView.tsx`. For a real app, replace with a global store (Zustand/Context) so the navbar cart count and cart page share state — flagged with a comment-worthy TODO if you grep for `CartView`.
- Filter sidebar (price/size) and sort dropdown render but aren't wired to actually filter/sort yet — the UI is there; hook up the logic once you have real query params or an API.
- Search input, login, and checkout are placeholders/links with no auth or payment logic.

## Folder structure

```
app/                    Routes (App Router)
  page.tsx              Home
  category/[slug]/      Category listing
  product/[id]/         Product detail
  cart/                 Cart
  layout.tsx            Root layout (fonts, Navbar, Footer)
  globals.css

components/
  layout/                Navbar, Footer
  home/                   Hero, FeatureStrip, CategoryGrid, ProductSection
  product/                ProductCard, ProductGallery, ProductInfo, ProductTabs
  category/               FilterSidebar, SortBar
  cart/                   CartView, CartItemRow, OrderSummary
  ui/                     Rating, QuantityStepper, Breadcrumb — small shared primitives

lib/data.ts              Mock products/categories + query helpers (swap for real API later)
types/product.ts         Shared TypeScript types
```

## Next steps toward the full marketplace

This scaffold only covers the buyer-facing pages from the brief. When you're ready to scale it into the full marketplace, add:
- `app/(seller)/seller/...` — seller dashboard, product management, orders, payouts
- `app/(admin)/admin/...` — seller approval, moderation, disputes
- `app/checkout/` — multi-step checkout flow
- `app/api/` or a separate backend — auth, orders, payments
- A global cart/auth store instead of page-local state

(This matches the fuller route-group structure discussed earlier in this project's planning — ask your assistant to scaffold any of these next.)
