# MVP Specification — Mini E-commerce (v2)

> This is the original MVP spec merged with the finalized Mongoose field
> designs for Cart, CartItem, Order, OrderItem, Banner, Coupon, and User
> (including Bakong QR payment), plus a business-logic implementation guide.

---

## 1. Project Goal

Build a simple e-commerce application where customers can:

* Browse products
* Search and filter products
* View product details
* Add products to a cart
* Checkout
* Create orders
* View their orders
* Track order status

Administrators can:

* Manage products
* Manage categories
* Manage users
* Manage orders
* Manage coupons
* Manage banners
* Manage application settings

The goal of this MVP is to provide a working end-to-end shopping experience without implementing advanced e-commerce infrastructure.

---

## 2. User Roles

### Customer

A customer can:

* Register an account
* Login / Logout
* View, search, and filter products (including by price range)
* View product details
* Add products to cart, update quantity, remove products
* Checkout and create an order
* View their orders and order details
* Manage profile (name, gender, telephone, country, city/province)
* Add and manage shipping addresses
* Change password / manage account security

### Admin

An admin can:

* Login / Logout
* View dashboard
* Manage categories, products, orders, coupons, users, banners, and application settings
* Update order status
* Verify manual QR payments

---

## 3. Core Features

### 3.1 Authentication

* User registration, login, logout
* JWT access token
* Refresh token, stored in an `HttpOnly` + `Secure` cookie
* Role-based authorization, protected routes
* Password hashing, change password

Roles: `customer`, `admin`

---

### 3.2 Categories

**Features:** create, list, get by ID, update, soft delete, activate, deactivate.

| Field | Type | Notes |
|---|---|---|
| name | String | |
| description | String | |
| image | String | |
| status | String (`active`/`inactive`) | soft-deleted categories become `inactive`, never removed |
| createdAt / updatedAt | Date | |

---

### 3.3 Products

**Features:** create, list, get by ID, update, delete, search, filter (by category, by price range).

| Field | Type | Notes |
|---|---|---|
| name | String | |
| description | String | |
| price | Number | |
| quantity | Number | |
| discount | Number | |
| images | String[] | |
| variants | Variant[] | optional, `[]` if none |
| categoryId | ObjectId → Category | |
| createdAt / updatedAt | Date | |

**Variant fields:** `sku`, `color`, `size`, `price`, `quantity`, `images[]`. When a product has variants, the variant-level `price`/`quantity` are authoritative for that variant.

```
Product
   │
   └── categoryId → Category._id
```

---

### 3.4 Product Images

Images are uploaded separately from product creation.

```http
POST /api/uploads/images
Content-Type: multipart/form-data
```

The server generates a unique filename, stores the file under `/uploads/products/`, and returns:

```json
{
  "path": "/uploads/products/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

The returned path is what gets stored in the Product document. Product creation itself is plain JSON (`POST /api/products`) referencing already-uploaded paths.

---

### 3.5 Cart

**Features:** add product, update quantity, remove product, view cart, calculate subtotal/shipping/tax/total.

Split across two collections: `Cart` (ownership) and `CartItem` (line items), so a single line can be added/updated/removed without rewriting a whole array.

**Cart**

| Field | Type | Notes |
|---|---|---|
| userId | ObjectId → User | unique — one cart per user |

**CartItem**

| Field | Type | Notes |
|---|---|---|
| cartId | ObjectId → Cart | |
| productId | ObjectId → Product | |
| variantSku | String | optional, when product has variants |
| quantity | Number | min 1 |
| priceSnapshot | Number | unit price when added |

Unique compound index: `cartId + productId + variantSku`.

**Calculation** (always recomputed server-side, never trusted from the client):

```
Subtotal
   +
Shipping
   +
Tax
   -
Discount
   =
Total
```

---

### 3.6 Orders

**Customer:** create an order, view their orders, view order details/status.
**Admin:** view all orders, view order details, update order status.

Split across `Order` (header) and `OrderItem` (line items). Both the shipping address and each line's product name/image/price are **snapshotted** into the order at checkout time — never referenced — so later edits to the address book or product catalog can't rewrite order history.

**Order**

| Field | Type | Notes |
|---|---|---|
| orderNumber | String | unique, auto-generated (`ORD-YYYYMMDD-XXXXXX`) |
| userId | ObjectId → User | |
| shippingAddress | Address (embedded snapshot) | see 3.7 |
| subtotal / shippingFee / tax / discount / total | Number | server-calculated |
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

---

### 3.7 User Profile & Shipping Addresses

Shipping addresses live as an **embedded array on the User document** rather than a standalone collection — the `/api/addresses` endpoints operate on this array.

Customers can add, update, delete an address, and select one during checkout.

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

The MVP does not integrate an online payment gateway (no Stripe). Checkout uses **Bakong dynamic KHQR** with manual admin fallback verification.

```
Checkout → Create Order → Generate dynamic KHQR → Show QR
   ↓
Customer pays via Bakong app
   ↓
Server polls "check transaction by md5" (dynamic KHQR only)
   ↓
Paid → Order confirmed          |   Not detected → Admin verifies manually → confirms order
```

Notes on the Bakong integration:

* MD5-based status checks apply to **dynamic** KHQR only; static QR would need to be checked directly against a bank PG database instead.
* Each generated QR needs its own unique `transactionId`.
* The QR should expire within **10 minutes**; after that, fall back to the manual admin-verification path already in the spec.

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

**Admin:** create, update, activate/deactivate, delete, view coupons.
**Customer:** apply coupon at checkout. Validation always happens server-side.

| Field | Type | Notes |
|---|---|---|
| code | String | unique, uppercase |
| discountType | String | `percentage` / `fixed` |
| discount | Number | value depends on `discountType` |
| totalUsers | Number | current redemption count, default 0 |
| maxUsers | Number | redemption cap |
| expiryDate | Date | |
| status | String | `active` / `inactive` |

A coupon is redeemable when `status === active`, `expiryDate > now`, and `totalUsers < maxUsers`. If you need "one use per customer" rather than a global cap, add a small `CouponRedemption` log (`userId + couponId + orderId`) later.

---

### 3.10 User Management (Admin)

Admin can list, view, update, and activate/deactivate users. **Admin must never be able to access a user's password.**

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

---

### 3.11 Banner Management

Admin can create, update, delete, activate/deactivate banners.

| Field | Type | Notes |
|---|---|---|
| image | String | |
| title | String | |
| description | String | optional |
| link | String | optional |
| order | Number | sort position in the hero carousel, ascending |
| status | String | `active` / `inactive` |

---

### 3.12 Application Settings

Admin can manage basic application settings:

```
storeName
storeLogo
storeDescription
shippingFee
taxRate
currency
contactEmail
contactPhone
```

---

## 4. API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
PATCH  /api/auth/change-password
```

### Categories
```
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
PATCH  /api/categories/:id/status
```

### Products
```
POST   /api/products
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

### Uploads
```
POST   /api/uploads/images
```

### Cart
```
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:productId
DELETE /api/cart/items/:productId
DELETE /api/cart
```

### Orders
```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
GET    /api/orders/:id/payment-status
```

Admin:
```
GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id/status
```

### Addresses
```
GET    /api/addresses
POST   /api/addresses
PATCH  /api/addresses/:id
DELETE /api/addresses/:id
```

### Users
Admin:
```
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id
PATCH  /api/admin/users/:id/status
```

### Coupons *(added — was described in 3.9 but missing from the original endpoint list)*
```
POST   /api/admin/coupons
GET    /api/admin/coupons
GET    /api/admin/coupons/:id
PATCH  /api/admin/coupons/:id
PATCH  /api/admin/coupons/:id/status
DELETE /api/admin/coupons/:id
POST   /api/coupons/validate      (customer — checks a code against the current cart)
```

### Banners *(added)*
```
GET    /api/banners                (public, active only, sorted by order)
POST   /api/admin/banners
GET    /api/admin/banners
PATCH  /api/admin/banners/:id
DELETE /api/admin/banners/:id
PATCH  /api/admin/banners/:id/status
```

### Settings *(added)*
```
GET    /api/settings               (public, store-facing subset)
GET    /api/admin/settings
PATCH  /api/admin/settings
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

Stripe or other online payment gateways, product reviews/ratings, wishlist, recommendation system, real-time notifications, chat, advanced analytics, microservices, Elasticsearch, Redis, Kafka, event-driven architecture, complex inventory management, multi-vendor marketplace, multiple warehouses. May be added in future versions.

---

## 8. Technical Requirements

**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, HttpOnly Secure Cookie, Multer, Docker, Docker Compose. External: Bakong Open API (dynamic KHQR generation + transaction status).

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

Business logic lives primarily in the service layer. Controllers handle HTTP request/validation-result/service-call/response only. Services handle business logic, DB operations, calculations, and product/order rules.

---

## 9. API Response Format

**Success**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "_id": "...", "name": "Oversized T-Shirt" }
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

**Authentication:** register, login, logout, access token, refresh token via HttpOnly Secure Cookie, role-based authorization, hashed passwords.

**Products:** admin CRUD, browse/search/filter/details for customers, variants supported, images uploadable.

**Categories:** admin CRUD, soft delete, status toggle, products reference categories correctly.

**Cart:** add/update/remove, variant selection, server-calculated subtotal/shipping/tax/total.

**Orders:** checkout with address selection, order stored in MongoDB, customer can view orders/details, admin can view all orders and update status.

**Payment:** customer sees Bakong QR payment info, order supports manual payment verification, admin can confirm payment/order.

**Quality:** consistent error handling, request validation, auth + role middleware, correct MongoDB relationships, env-based config, runs via Docker Compose, testable via Postman/Insomnia.

---

## 11. Data Model Relationships

```
User ──< Address (embedded)
User ──< Cart ──< CartItem >── Product ──> Category
User ──< Order ──< OrderItem >── Product
Order ─┬─ shippingAddress (snapshot copy, not a ref)
       └─ payment (embedded Bakong payment state)
Coupon (referenced by Order.couponCode at checkout time, not stored as a ref)
Banner, Setting — standalone, admin-managed
```

---

## 12. Business Logic Implementation Guide

### 12.1 Add item to cart — `POST /api/cart/items`

**Controller:** read `userId` from auth middleware, validate `{ productId, variantSku?, quantity }`, call service, return `201`.

**Service (`cartService.addItem`):**
1. Find the user's `Cart`; create one if it doesn't exist.
2. Load the `Product`. If `variantSku` is given, find the matching variant; otherwise use the product's own price/quantity.
3. Check stock: requested `quantity` ≤ available quantity, else throw `INSUFFICIENT_STOCK`.
4. Upsert the `CartItem` for `cartId + productId + variantSku` — increment `quantity` if it exists, otherwise create it with `priceSnapshot` = current price.
5. Return the updated cart with items populated.

### 12.2 Update / remove cart item — `PATCH` / `DELETE /api/cart/items/:productId`

1. Find the `CartItem` by `cartId + productId (+ variantSku)`.
2. For update: re-check stock for the new quantity before saving.
3. For remove: delete the `CartItem`.

### 12.3 Checkout — create order — `POST /api/orders`

**Controller:** validate `{ addressId, couponCode? }`, call `orderService.createOrder(userId, dto)`, return the order including `payment.qrString`.

**Service (`orderService.createOrder`):**
1. Load the user's `Cart` + `CartItem`s (populated). Empty → `CART_EMPTY`.
2. Re-check stock for every line at this moment — never trust the cart snapshot.
3. Recalculate each line's price from the current `Product`/variant — never trust client-sent totals.
4. Resolve the shipping address from `user.addresses` by `addressId`, and copy its fields into the order's embedded `shippingAddress`.
5. Compute `subtotal = Σ(price × quantity)`.
6. If `couponCode` present: validate it (12.6), compute `discount`.
7. Load `shippingFee` / `taxRate` from Settings; compute `shippingFee`, `tax`.
8. `total = subtotal + shippingFee + tax − discount`.
9. Call the Bakong service to generate a dynamic KHQR for `total`: get `qrString`, `md5`, unique `transactionId`; set `qrExpiresAt = now + 10 min`, `payment.status = 'pending'`.
10. Create the `Order` (`status: 'pending'`) with the embedded `payment`.
11. Create one `OrderItem` per cart line (snapshotted `name`/`image`/`price`).
12. Atomically decrement stock per line (`findOneAndUpdate` with a `quantity >= ordered` guard, so concurrent checkouts can't oversell).
13. If a coupon was applied, atomically `$inc totalUsers` **with a guard** `totalUsers < maxUsers` in the same query.
14. Delete the user's `CartItem`s.
15. Return the order + QR payload.

### 12.4 Confirm Bakong payment

**Polling — `GET /api/orders/:id/payment-status`:**
1. Load the order; if already `payment.status === 'paid'`, return immediately.
2. Call Bakong's "check transaction by md5" with `payment.md5`.
3. Success → `payment.status = 'paid'`, set `paidAt`/`bakongHash`, move `order.status` to `'confirmed'`.
4. Not found and QR not expired → return `pending` (client keeps polling).
5. QR expired and unpaid → `payment.status = 'failed'`, leave for manual admin follow-up.

**Admin manual confirm — `PATCH /api/admin/orders/:id/status`:**
1. Admin has verified the transfer out-of-band.
2. Set `payment.status = 'paid'`, `verifiedBy`, `verifiedAt`.
3. Move `order.status` to `'confirmed'`.

### 12.5 Update order status (admin)

1. Validate the transition is legal: `pending → confirmed → shipped → delivered`, or `→ cancelled` from `pending`/`confirmed`.
2. If cancelling after stock was already decremented, restock each `OrderItem`'s quantity.
3. Save the new `status`.

### 12.6 Apply/validate a coupon (reusable helper)

1. Fetch `Coupon` by `code`.
2. Check `status === 'active'`.
3. Check `expiryDate > now`.
4. Check `totalUsers < maxUsers`.
5. On failure, throw a specific code (`COUPON_EXPIRED`, `COUPON_LIMIT_REACHED`, …) rather than a generic error.
6. Compute discount: `discountType === 'percentage' ? subtotal * (discount / 100) : discount`.

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

Keep `bakong.service.ts` isolated from `order.service.ts` — the order service should call `bakongService.generateQr()` / `bakongService.checkStatus(md5)` rather than making HTTP calls to Bakong directly, so the payment provider stays swappable later.