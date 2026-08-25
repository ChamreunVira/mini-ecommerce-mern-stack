# MVP Specification — Mini E-commerce

> Backend: Node.js, Express.js, TypeScript, MongoDB, Mongoose
> Frontend: Next.js
> Payment: Bakong dynamic KHQR, manual admin fallback
>
> v3 changes from v2: fixed cart-item variant identification, fixed the
> CartItem unique index, added transaction handling for checkout, made
> API versioning/namespacing consistent, added pagination, added missing
> indexes, clamped discount/total to non-negative, removed a duplicated
> section.

---

## 1. Project Goal

Build a simple e-commerce application where customers can browse, search,
and filter products, view details, manage a cart, checkout, and track
orders. Admins manage products, categories, users, orders, coupons,
banners, and settings.

This MVP is a working end-to-end shopping experience — not a full
e-commerce platform.

---

## 2. User Roles

### Customer
Register, login/logout, browse/search/filter products (incl. price
range), view product details, manage cart (add/update/remove), checkout,
view own orders, manage profile and shipping addresses, change password.

### Admin
Login/logout, view dashboard, manage categories/products/orders/coupons/
users/banners/settings, update order status, verify manual QR payments.

---

## 3. Core Features

### 3.1 Authentication
- Register, login, logout
- JWT access token (returned in response body, held client-side in memory)
- Refresh token in an `HttpOnly` + `Secure` cookie
- Role-based authorization middleware on protected routes
- Password hashing (bcrypt/argon2), change-password endpoint

Roles: `customer`, `admin`

**Security baseline:** rate-limit `/auth/login` and `/auth/register`
(e.g. `express-rate-limit`), validate all input at the route boundary
(`zod` or `express-validator`), and use `helmet` for standard HTTP
security headers. Auth endpoints are the most common brute-force target —
don't skip this even for an MVP.

---

### 3.2 Categories

**Features:** create, list, get by ID, update, soft delete (status
toggle), activate, deactivate.

| Field | Type | Notes |
|---|---|---|
| name | String | |
| description | String | |
| image | String | |
| status | String (`active`/`inactive`) | soft-deleted → `inactive`, never removed |
| createdAt / updatedAt | Date | |

**Index:** none required beyond default `_id`; add `{ status: 1 }` if
the catalog grows large enough that filtering active categories shows up
in slow-query logs.

---

### 3.3 Products

**Features:** create, list, get by ID, update, delete, search, filter
(category, price range).

| Field | Type | Notes |
|---|---|---|
| name | String | |
| description | String | |
| price | Number | ignored for a line once a variant is selected |
| quantity | Number | ignored for a line once a variant is selected |
| discount | Number | |
| images | String[] | first entry is treated as the primary/hero image |
| variants | Variant[] | optional, `[]` if none; each gets its own Mongoose subdocument `_id` |
| categoryId | ObjectId → Category | |
| createdAt / updatedAt | Date | |

**Variant fields:** `sku` (unique), `color`, `size`, `price`, `quantity`,
`images[]`. When a product has variants, the variant's own `price`/
`quantity` are authoritative for that variant — the base product fields
are display fallbacks only.

**Required indexes:**
- Text index on `{ name: "text", description: "text" }` for search
- Compound `{ categoryId: 1, price: 1 }` for category + price-range filtering

```
Product
   │
   └── categoryId → Category._id
```

---

### 3.4 Product Images

Uploaded separately from product creation.

```http
POST /api/v1/uploads/images
Content-Type: multipart/form-data
```

Server generates a unique filename, stores it under `/uploads/products/`,
returns:

```json
{ "path": "/uploads/products/550e8400-e29b-41d4-a716-446655440000.jpg" }
```

Product creation (`POST /api/v1/products`) is plain JSON referencing
already-uploaded paths.

---

### 3.5 Cart

Split across two collections so a single line can be added/updated/
removed without rewriting a whole array.

**Cart**

| Field | Type | Notes |
|---|---|---|
| userId | ObjectId → User | unique — one cart per user |

**CartItem**

| Field | Type | Notes |
|---|---|---|
| cartId | ObjectId → Cart | |
| productId | ObjectId → Product | |
| variantSku | String | **default `""`, not undefined/null** — see index note below |
| quantity | Number | min 1 |
| priceSnapshot | Number | unit price when added |

**Unique compound index:** `{ cartId: 1, productId: 1, variantSku: 1 }`.
Defaulting `variantSku` to `""` (rather than leaving it unset) is
required — Mongo treats a missing field as `null` in a unique index, so
two cart lines for the same variant-less product would otherwise collide
on that shared `null`.

**Identifying a line item:** cart mutation routes use the `CartItem`'s
own `_id`, not `productId` — a product can appear in the cart multiple
times under different variants, and `productId` alone can't disambiguate
which line to update or remove.

**Calculation** (always recomputed server-side, never trusted from the
client):

```
Subtotal + Shipping + Tax − Discount = Total
```

---

### 3.6 Orders

Split across `Order` (header) and `OrderItem` (line items). Both the
shipping address and each line's product name/image/price are
**snapshotted** at checkout time — never referenced — so later edits to
the address book or catalog can't rewrite order history.

**Order**

| Field | Type | Notes |
|---|---|---|
| orderNumber | String | unique, `ORD-YYYYMMDD-XXXXXX` — see 12.3 for collision-safe generation |
| userId | ObjectId → User | |
| shippingAddress | Address (embedded snapshot) | see 3.7 |
| subtotal / shippingFee / tax / discount / total | Number | server-calculated, `discount` capped at `subtotal`, `total` floored at `0` |
| couponCode | String | optional |
| status | String | `pending / confirmed / shipped / delivered / cancelled` |
| payment | Payment (embedded) | see 3.8 |
| createdAt / updatedAt | Date | |

**OrderItem**

| Field | Type | Notes |
|---|---|---|
| orderId | ObjectId → Order | |
| productId | ObjectId → Product | |
| variantSku | String | optional |
| name, image, price | snapshot | copied at purchase time |
| quantity | Number | |
| subtotal | Number | `price × quantity` |

**Required indexes:** `{ orderNumber: 1 }` unique, `{ userId: 1 }` for a
customer's order history, `{ status: 1 }` for admin dashboard filtering.

---

### 3.7 User Profile & Shipping Addresses

Embedded array on the `User` document — `/api/v1/addresses` endpoints
operate on this array. Each address gets its own Mongoose subdocument
`_id`; that `_id` is what checkout's `addressId` refers to (not a
separately generated UUID).

| Field | Type | Notes |
|---|---|---|
| fullName | String | |
| phone | String | |
| address | String | |
| city | String | |
| province | String | optional |
| postalCode | String | optional |
| country | String | |
| isDefault | Boolean | |

---

### 3.8 QR Payment (Bakong)

No online payment gateway — Bakong dynamic KHQR with manual admin
fallback.

```
Checkout → Create Order → Generate dynamic KHQR → Show QR
   ↓
Customer pays via Bakong app
   ↓
Server polls "check transaction by md5" (dynamic KHQR only)
   ↓
Paid → Order confirmed   |   Not detected → Admin verifies manually → confirms order
```

- MD5-based status checks apply to **dynamic** KHQR only.
- Each generated QR gets its own unique `transactionId`.
- QR expires within **10 minutes**; after that, fall back to manual
  admin verification.
- **Future hardening (not MVP-blocking):** add a `POST
  /api/v1/webhooks/bakong` endpoint with HMAC signature verification as
  the primary confirmation path, keeping polling as a fallback rather
  than the only mechanism — stronger under load and avoids polling
  latency.

**Payment (embedded in Order)**

| Field | Type | Notes |
|---|---|---|
| qrString | String | KHQR payload rendered as the QR image |
| md5 | String | used to poll transaction status |
| transactionId | String | unique per QR generated |
| bakongHash | String | returned once Bakong confirms the transfer |
| status | String | `unpaid / pending / paid / failed` |
| amount | Number | |
| currency | String | `KHR` / `USD` |
| qrExpiresAt | Date | ≤ 10 minutes after generation |
| paidAt | Date | |
| verifiedBy | ObjectId → User | admin, manual-confirm fallback |
| verifiedAt | Date | |

---

### 3.9 Coupons

**Admin:** create, update, activate/deactivate, delete, view.
**Customer:** apply at checkout. Validation always server-side.

| Field | Type | Notes |
|---|---|---|
| code | String | unique, uppercase |
| discountType | String | `percentage` / `fixed` |
| discount | Number | value depends on `discountType` |
| totalUsers | Number | current redemption count, default 0 |
| maxUsers | Number | redemption cap |
| expiryDate | Date | |
| status | String | `active` / `inactive` |

Redeemable when `status === active`, `expiryDate > now`, and
`totalUsers < maxUsers`. For "one use per customer" instead of a global
cap, add a `CouponRedemption` log (`userId + couponId + orderId`) later.

**Index:** `{ code: 1 }` unique.

---

### 3.10 User Management (Admin)

Admin can list, view, update, and activate/deactivate users. **Admin
must never be able to access a user's password.**

| Field | Type | Notes |
|---|---|---|
| firstName / lastName | String | |
| email | String | unique |
| password | String | hashed, never returned by the API |
| gender | String | `male` / `female` / `other`, optional |
| telephone | String | optional |
| country / city / province | String | optional |
| addresses | Address[] | see 3.7 |
| role | String | `customer` / `admin` |
| status | String | `active` / `inactive` |

**Index:** `{ email: 1 }` unique.

---

### 3.11 Banner Management

Admin can create, update, delete, activate/deactivate banners.

| Field | Type | Notes |
|---|---|---|
| image | String | |
| title | String | |
| description | String | optional |
| link | String | optional |
| order | Number | sort position, ascending |
| status | String | `active` / `inactive` |

---

### 3.12 Application Settings

```
storeName, storeLogo, storeDescription,
shippingFee, taxRate, currency,
contactEmail, contactPhone
```

Single global document — flat rate for all customers is an accepted MVP
simplification (no per-region shipping).

---

## 4. API Endpoints

All routes versioned under `/api/v1/`. Admin-only mutations live under
`/api/v1/admin/...` consistently across every resource — no exceptions,
so the auth middleware boundary is predictable from the URL alone.

List endpoints (`GET` collections) accept `?page=&limit=&sort=` and
return the paginated envelope in §9.

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
PATCH  /api/v1/auth/change-password
```

### Categories
```
GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
PATCH  /api/v1/admin/categories/:id/status
```

### Products
```
GET    /api/v1/products                                   list/search/filter
GET    /api/v1/products/:productId                        with variants
GET    /api/v1/products/lookup?sku=...                     find variant by SKU/barcode
POST   /api/v1/admin/products                              variants inline or auto-generated
PATCH  /api/v1/admin/products/:productId
DELETE /api/v1/admin/products/:productId                   archive
POST   /api/v1/admin/products/:productId/variants
PATCH  /api/v1/admin/products/:productId/variants/:variantId
PATCH  /api/v1/admin/products/:productId/variants/:variantId/stock   delta, atomic
DELETE /api/v1/admin/products/:productId/variants/:variantId
```

### Uploads
```
POST   /api/v1/admin/uploads/images
```

### Cart
```
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:itemId          CartItem._id, not productId
DELETE /api/v1/cart/items/:itemId
DELETE /api/v1/cart
```

### Orders
```
POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id
GET    /api/v1/orders/:id/payment-status

GET    /api/v1/admin/orders
GET    /api/v1/admin/orders/:id
PATCH  /api/v1/admin/orders/:id/status
```

### Addresses
```
GET    /api/v1/addresses
POST   /api/v1/addresses
PATCH  /api/v1/addresses/:id
DELETE /api/v1/addresses/:id
```

### Users
```
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id/status
```

### Coupons
```
POST   /api/v1/coupons/validate            customer — checks a code against the current cart

GET    /api/v1/admin/coupons
GET    /api/v1/admin/coupons/:id
POST   /api/v1/admin/coupons
PATCH  /api/v1/admin/coupons/:id
PATCH  /api/v1/admin/coupons/:id/status
DELETE /api/v1/admin/coupons/:id
```

### Banners
```
GET    /api/v1/banners                     public, active only, sorted by order

GET    /api/v1/admin/banners
POST   /api/v1/admin/banners
PATCH  /api/v1/admin/banners/:id
PATCH  /api/v1/admin/banners/:id/status
DELETE /api/v1/admin/banners/:id
```

### Settings
```
GET    /api/v1/settings                    public, store-facing subset

GET    /api/v1/admin/settings
PATCH  /api/v1/admin/settings
```

---

## 5. MVP Customer Flow

```
Register → Login → Browse Products → Search / Filter → Product Details
   → Select Variant → Add to Cart → Update Cart → Checkout
   → Select Shipping Address → Calculate Total → Create Order
   → Bakong QR Payment → Order Pending → Admin Confirms Payment
   → Order Confirmed → Shipped → Delivered
```

## 6. MVP Admin Flow

```
Login → Dashboard → Manage Categories → Manage Products → View Orders
   → Verify Payment → Update Order Status
   → Manage Users / Coupons / Banners / Settings
```

---

## 7. Out of Scope

Stripe/other payment gateways, reviews/ratings, wishlist, recommendation
engine, real-time notifications, chat, advanced analytics, microservices,
Elasticsearch, Redis, Kafka, event-driven architecture, complex inventory
management, multi-vendor, multiple warehouses. Candidates for future
versions.

---

## 8. Technical Requirements

**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT,
HttpOnly Secure Cookie, Multer, Docker, Docker Compose. External: Bakong
Open API (dynamic KHQR generation + transaction status).

**Security:** `helmet`, `express-rate-limit` on auth routes, request
validation with `zod`/`express-validator` at every route boundary.

**Architecture:**
```
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── validations/
├── utils/
├── types/
└── app.ts
```

Business logic lives in the service layer. Controllers: request
validation result → service call → response, nothing else. Services:
DB operations, calculations, product/order rules.

---

## 9. API Response Format

**Success (single resource)**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "_id": "...", "name": "Oversized T-Shirt" }
}
```

**Success (paginated list)**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [ { "_id": "...", "name": "..." } ],
  "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 }
}
```

**Error**
```json
{
  "success": false,
  "message": "Product not found",
  "error": { "code": "PRODUCT_NOT_FOUND" }
}
```

Avoid unnecessary nesting like `{ "data": { "data": {} } }`.

---

## 10. Definition of Done

**Authentication:** register, login, logout, access token, refresh token
via HttpOnly Secure Cookie, role-based authorization, hashed passwords,
rate-limited auth routes.

**Products:** admin CRUD, browse/search/filter/details for customers,
variants supported, images uploadable, search/filter indexes in place.

**Categories:** admin CRUD, soft delete, status toggle, products
reference categories correctly.

**Cart:** add/update/remove by line-item id, variant selection
disambiguated correctly, server-calculated subtotal/shipping/tax/total.

**Orders:** checkout wrapped in a DB transaction, address selection,
order stored in MongoDB, customer can view orders/details, admin can
view all orders and update status.

**Payment:** customer sees Bakong QR payment info, order supports manual
payment verification, admin can confirm payment/order.

**Quality:** consistent error handling, request validation, auth + role
middleware, correct MongoDB relationships and indexes, env-based config,
runs via Docker Compose, testable via Postman/Insomnia, paginated list
endpoints.

---

## 11. Data Model Relationships

```
User ──< Address (embedded, subdocument _id used as addressId)
User ──< Cart ──< CartItem >── Product ──> Category
User ──< Order ──< OrderItem >── Product
Order ─┬─ shippingAddress (snapshot copy, not a ref)
       └─ payment (embedded Bakong payment state)
Coupon (referenced by Order.couponCode at checkout time, not stored as a ref)
Banner, Setting — standalone, admin-managed
```

---

## 12. Business Logic Implementation Guide

### 12.1 Add item to cart — `POST /api/v1/cart/items`

**Controller:** read `userId` from auth middleware, validate
`{ productId, variantSku?, quantity }`, call service, return `201`.

**Service (`cartService.addItem`):**
1. Find the user's `Cart`; create one if it doesn't exist.
2. Load the `Product`. If `variantSku` given, find the matching variant;
   otherwise use the product's own price/quantity.
3. Check stock: requested `quantity` ≤ available, else throw
   `INSUFFICIENT_STOCK`.
4. Upsert the `CartItem` for `cartId + productId + (variantSku ?? "")` —
   increment `quantity` if it exists, else create with `priceSnapshot` =
   current price.
5. Return the updated cart with items populated.

### 12.2 Update / remove cart item — `PATCH` / `DELETE /api/v1/cart/items/:itemId`

1. Find the `CartItem` by its own `_id`, scoped to the requesting user's
   cart (never trust `itemId` alone — verify ownership via `cartId`).
2. For update: re-check stock for the new quantity before saving.
3. For remove: delete the `CartItem`.

### 12.3 Checkout — create order — `POST /api/v1/orders`

**Controller:** validate `{ addressId, couponCode? }`, call
`orderService.createOrder(userId, dto)`, return the order including
`payment.qrString`.

**Service (`orderService.createOrder`)** — run inside a Mongoose
session/transaction from step 8 onward, so a failure at any point rolls
back stock decrements, coupon usage, and the created order together:

1. Load the user's `Cart` + `CartItem`s (populated). Empty → `CART_EMPTY`.
2. Re-check stock for every line at this moment — never trust the cart
   snapshot.
3. Recalculate each line's price from the current `Product`/variant —
   never trust client-sent totals.
4. Resolve the shipping address from `user.addresses` by its subdocument
   `_id`, copy its fields into the order's embedded `shippingAddress`.
5. Compute `subtotal = Σ(price × quantity)`.
6. If `couponCode` present: validate it (12.6), compute `discount =
   Math.min(computedDiscount, subtotal)`.
7. Load `shippingFee`/`taxRate` from Settings; compute `shippingFee`, `tax`.
8. **[transaction starts]** `total = Math.max(0, subtotal + shippingFee + tax − discount)`.
9. Call the Bakong service to generate a dynamic KHQR for `total`: get
   `qrString`, `md5`, unique `transactionId`; set `qrExpiresAt = now + 10
   min`, `payment.status = 'pending'`. If this call fails, abort the
   transaction before any writes happen.
10. Generate `orderNumber`: `ORD-YYYYMMDD-` + a per-day atomic counter
    (a small `Counter` collection keyed by date, incremented with
    `findOneAndUpdate({ $inc: { seq: 1 } }, { upsert: true })`) — not a
    bare random suffix, which will eventually collide under load.
11. Create the `Order` (`status: 'pending'`) with the embedded `payment`.
12. Create one `OrderItem` per cart line (snapshotted `name`/`image`/`price`).
13. Atomically decrement stock per line (`findOneAndUpdate` with a
    `quantity >= ordered` guard, so concurrent checkouts can't oversell).
14. If a coupon was applied, atomically `$inc totalUsers` **with a
    guard** `totalUsers < maxUsers` in the same query.
15. Delete the user's `CartItem`s.
16. **[transaction commits]** Return the order + QR payload.

### 12.4 Confirm Bakong payment

**Polling — `GET /api/v1/orders/:id/payment-status`:**
1. Load the order; if already `payment.status === 'paid'`, return immediately.
2. Call Bakong's "check transaction by md5" with `payment.md5`.
3. Success → `payment.status = 'paid'`, set `paidAt`/`bakongHash`, move
   `order.status` to `'confirmed'`.
4. Not found and QR not expired → return `pending` (client keeps polling).
5. QR expired and unpaid → `payment.status = 'failed'`, leave for manual
   admin follow-up.

**Admin manual confirm — `PATCH /api/v1/admin/orders/:id/status`:**
1. Admin has verified the transfer out-of-band.
2. Set `payment.status = 'paid'`, `verifiedBy`, `verifiedAt`.
3. Move `order.status` to `'confirmed'`.

### 12.5 Update order status (admin)

1. Validate the transition is legal: `pending → confirmed → shipped →
   delivered`, or `→ cancelled` from `pending`/`confirmed`.
2. If cancelling after stock was already decremented, restock each
   `OrderItem`'s quantity.
3. Save the new `status`.

### 12.6 Apply/validate a coupon (reusable helper)

1. Fetch `Coupon` by `code`.
2. Check `status === 'active'`.
3. Check `expiryDate > now`.
4. Check `totalUsers < maxUsers`.
5. On failure, throw a specific code (`COUPON_EXPIRED`,
   `COUPON_LIMIT_REACHED`, …) rather than a generic error.
6. Compute discount: `discountType === 'percentage' ? subtotal *
   (discount / 100) : discount`, then clamp to `Math.min(result,
   subtotal)`.

---

## 13. Suggested File Mapping

| Controller | Service | Handles |
|---|---|---|
| `cart.controller.ts` | `cart.service.ts` | 12.1, 12.2 |
| `order.controller.ts` | `order.service.ts` | 12.3, 12.5 |
| `payment.controller.ts` (or part of order) | `bakong.service.ts` | 12.4, QR generation/polling |
| `coupon.controller.ts` | `coupon.service.ts` | 12.6, admin CRUD |
| `banner.controller.ts` | `banner.service.ts` | 3.11 CRUD |
| `settings.controller.ts` | `settings.service.ts` | 3.12 CRUD |

Keep `bakong.service.ts` isolated from `order.service.ts` — the order
service calls `bakongService.generateQr()` /
`bakongService.checkStatus(md5)` rather than making HTTP calls to Bakong
directly, so the payment provider stays swappable later.