# MVP Specification — Mini E-commerce

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

# 2. User Roles

## Customer

A customer can:

* Register an account
* Login
* Logout
* View products
* Search products
* Filter products
* Filter by price range
* View product details
* Add products to cart
* Update cart quantity
* Remove products from cart
* Checkout
* Create an order
* View their orders
* View order details
* Manage profile
* Add and manage shipping addresses
* Change password
* Manage account security

## Admin

An admin can:

* Login
* Logout
* View dashboard
* Manage categories
* Create products
* Update products
* Delete products
* View all orders
* Update order status
* Manage coupons
* Manage users
* Manage banners
* Update application settings

---

# 3. Core Features

## 3.1 Authentication

### Features

* User registration
* User login
* User logout
* JWT access token
* Refresh token
* Refresh token stored in `HttpOnly` and `Secure` cookie
* Role-based authorization
* Protected routes
* Password hashing
* Change password

### Roles

```text
customer
admin
```

---

# 3.2 Categories

### Features

* Create category
* List categories
* Get category by ID
* Update category
* Soft delete category
* Activate category
* Deactivate category

### Category Fields

```text
name
description
image
status
createdAt
updatedAt
```

### Status

```text
active
inactive
```

Category deletion is a **soft delete**.

The category document remains in MongoDB and its status is changed to:

```text
inactive
```

---

# 3.3 Products

### Features

* Create product
* List products
* Get product by ID
* Update product
* Delete product
* Search products
* Filter products
* Filter by category
* Filter by price range

### Product Fields

```text
name
description
price
quantity
discount
images[]
variants[]
categoryId
createdAt
updatedAt
```

### Category Reference

`categoryId` is a MongoDB `ObjectId` reference to the `Category` collection.

```text
Product
   │
   └── categoryId → Category._id
```

### Product Variants

Products can optionally have multiple variants.

Example:

```text
Black / S
Black / M
Black / L
White / M
White / L
```

Each variant contains:

```text
sku
color
size
price
quantity
images[]
```

Example:

```json
{
  "sku": "TS-BLK-M",
  "color": "Black",
  "size": "M",
  "price": 15,
  "quantity": 20,
  "images": [
    "/uploads/products/tshirt-black-m.jpg"
  ]
}
```

If a product does not have variants:

```text
variants: []
```

For a product with variants, the variant-level `price` and `quantity` are used for that specific variant.

---

# 3.4 Product Images

Images are uploaded separately from product creation.

### Image Upload

```http
POST /api/uploads/images
Content-Type: multipart/form-data
```

The server generates a unique filename and stores the file under:

```text
/uploads/products/
```

Example response:

```json
{
  "path": "/uploads/products/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

The returned path is stored in the Product document.

### Product Creation

Product creation uses JSON:

```http
POST /api/products
Content-Type: application/json
```

Example:

```json
{
  "name": "Oversized T-Shirt",
  "description": "Premium cotton T-shirt",
  "price": 15,
  "quantity": 50,
  "discount": 10,
  "images": [
    "/uploads/products/tshirt-1.jpg",
    "/uploads/products/tshirt-2.jpg"
  ],
  "variants": [
    {
      "sku": "TS-BLK-M",
      "color": "Black",
      "size": "M",
      "price": 15,
      "quantity": 20
    }
  ],
  "categoryId": "66c123456789"
}
```

---

# 3.5 Cart

### Features

* Add product to cart
* Update product quantity
* Remove product
* View cart
* Calculate subtotal
* Calculate shipping
* Calculate tax
* Calculate total

### Cart Calculation

```text
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

The server must calculate final prices rather than trusting totals sent by the client.

---

# 3.6 Orders

## Customer

A customer can:

* Create an order
* View their orders
* View order details
* View order status

## Admin

An admin can:

* View all orders
* View order details
* Update order status

### Order Status

```text
pending
confirmed
shipped
delivered
cancelled
```

---

# 3.7 Shipping Address

Customers can:

* Add shipping address
* Update shipping address
* Delete shipping address
* Select an address during checkout

### Address Fields

```text
fullName
phone
address
city
province
postalCode
country
```

---

# 3.8 QR Payment

The MVP does not integrate an online payment gateway.

Instead, checkout can support **manual QR payment**.

Customer flow:

```text
Checkout
   ↓
Create Order
   ↓
Show QR Payment Information
   ↓
Customer Makes Payment
   ↓
Order remains pending/awaiting confirmation
   ↓
Admin verifies payment
   ↓
Admin confirms order
```

No Stripe or other third-party payment gateway is required for the MVP.

---

# 3.9 Coupons

Admin can:

* Create coupon
* Update coupon
* Activate/deactivate coupon
* Delete coupon
* View coupons

Customer can:

* Apply coupon during checkout

Coupon validation must happen on the server.

---

# 3.10 User Management

Admin can:

* List users
* View user
* Update user
* Activate/deactivate user

Admin must not be able to access a user's password.

---

# 3.11 Banner Management

Admin can:

* Create banner
* Update banner
* Delete banner
* Activate/deactivate banner

Banner fields:

```text
title
description
image
link
status
```

---

# 3.12 Application Settings

Admin can manage basic application settings such as:

```text
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

# 4. API Endpoints

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
PATCH  /api/auth/change-password
```

## Categories

```text
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
PATCH  /api/categories/:id/status
```

## Products

```text
POST   /api/products
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

## Uploads

```text
POST   /api/uploads/images
```

## Cart

```text
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:productId
DELETE /api/cart/items/:productId
DELETE /api/cart
```

## Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
```

Admin:

```text
GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id/status
```

## Addresses

```text
GET    /api/addresses
POST   /api/addresses
PATCH  /api/addresses/:id
DELETE /api/addresses/:id
```

## Users

Admin:

```text
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id
PATCH  /api/admin/users/:id/status
```

---

# 5. MVP Customer Flow

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
Search / Filter
   ↓
Product Details
   ↓
Select Variant
   ↓
Add to Cart
   ↓
Update Cart
   ↓
Checkout
   ↓
Select Shipping Address
   ↓
Calculate Total
   ↓
Create Order
   ↓
QR Payment
   ↓
Order Pending
   ↓
Admin Confirms Payment
   ↓
Order Confirmed
   ↓
Shipped
   ↓
Delivered
```

---

# 6. MVP Admin Flow

```text
Login
   ↓
Dashboard
   ↓
Manage Categories
   ↓
Manage Products
   ↓
View Orders
   ↓
Verify Payment
   ↓
Update Order Status
   ↓
Manage Users / Coupons / Banners / Settings
```

---

# 7. Out of Scope

The following features are intentionally excluded from the MVP:

* Stripe
* Online payment gateway integration
* Product reviews
* Product ratings
* Wishlist
* Recommendation system
* Real-time notifications
* Chat
* Advanced analytics
* Microservices
* Elasticsearch
* Redis
* Kafka
* Event-driven architecture
* Complex inventory management
* Multi-vendor marketplace
* Multiple warehouses

These features may be added in future versions.

---

# 8. Technical Requirements

## Backend

```text
Node.js
Express.js
TypeScript
MongoDB
Mongoose
JWT
HttpOnly Secure Cookie
Multer
Docker
Docker Compose
```

## Architecture

Use a modular layered architecture:

```text
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

Business logic should primarily live in the service layer.

Controllers should handle:

* HTTP request
* Validation result
* Calling services
* HTTP response

Services should handle:

* Business logic
* Database operations
* Calculations
* Product/order rules

---

# 9. API Response Format

Use a consistent response structure.

### Success

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "...",
    "name": "Oversized T-Shirt"
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Product not found",
  "error": {
    "code": "PRODUCT_NOT_FOUND"
  }
}
```

Do not create unnecessary nested structures such as:

```json
{
  "data": {
    "data": {}
  }
}
```

---

# 10. Definition of Done

The MVP is considered complete when:

### Authentication

* Customer can register.
* Customer can login.
* Customer can logout.
* Access token works.
* Refresh token works using an HttpOnly Secure Cookie.
* Role-based authorization works.
* Passwords are securely hashed.

### Products

* Admin can create products.
* Admin can update products.
* Admin can delete products.
* Customer can browse products.
* Customer can search products.
* Customer can filter products.
* Customer can view product details.
* Products can have variants.
* Product images can be uploaded.

### Categories

* Admin can create categories.
* Admin can update categories.
* Admin can list categories.
* Admin can soft-delete categories.
* Category status can be changed between active and inactive.
* Products reference categories correctly.

### Cart

* Customer can add products.
* Customer can select a variant when applicable.
* Customer can update quantity.
* Customer can remove products.
* Server calculates subtotal.
* Server calculates shipping.
* Server calculates tax.
* Server calculates final total.

### Orders

* Customer can checkout.
* Customer can select a shipping address.
* Order is successfully stored in MongoDB.
* Customer can view their orders.
* Customer can view order details.
* Admin can view all orders.
* Admin can update order status.

### Payment

* Customer can view QR payment information.
* Order supports manual payment verification.
* Admin can confirm payment/order.

### Quality

* API errors are handled consistently.
* Request validation is implemented.
* Authentication middleware works.
* Authorization middleware works.
* MongoDB relationships work correctly.
* Environment variables are used for configuration.
* Application can run using Docker Compose.
* API can be tested using Postman/Insomnia.
