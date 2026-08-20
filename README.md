# Mini E-commerce MERN Stack

A mini e-commerce application built with the **MERN Stack**:

- **MongoDB** — Database
- **Express.js** — Backend API
- **React.js** — Frontend
- **Node.js** — Runtime

The backend provides APIs for users, products, categories, orders, authentication, reviews, image uploads, payments, and admin statistics.

---

# 1. Project Features

## Customer Features

- User registration
- User login/logout
- View and update profile
- Browse products
- View product details
- Filter products
- View top products
- View newest products
- Add product reviews
- Create orders
- View personal orders
- View order details
- Pay for an order

## Admin Features

- Manage users
- Manage categories
- Create products
- Update products
- Delete products
- View all orders
- Mark orders as delivered
- View total orders
- View total sales
- View sales by date
- Upload product images

---

# 2. Backend Structure

```text
backend/
│
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   ├── categoryController.js
│   └── orderController.js
│
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   ├── categoryModel.js
│   └── orderModel.js
│
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   └── uploadRoutes.js
│
├── middlewares/
│   ├── authMiddleware.js
│   └── checkId.js
│
├── uploads/
│
├── config/
│
└── server.js
```

---

# 3. Database Models

## User

```text
User
├── username
├── email
├── password
├── isAdmin
├── createdAt
└── updatedAt
```

## Product

```text
Product
├── name
├── image
├── brand
├── quantity
├── category
├── reviews[]
├── rating
├── numReviews
├── price
├── countInStock
├── createdAt
└── updatedAt
```

## Category

```text
Category
├── name
├── createdAt
└── updatedAt
```

## Order

```text
Order
├── user
├── orderItems[]
│   ├── name
│   ├── qty
│   ├── image
│   ├── price
│   └── product
│
├── shippingAddress
│   ├── address
│   ├── city
│   ├── postalCode
│   └── country
│
├── paymentMethod
├── paymentResult
├── itemsPrice
├── taxPrice
├── shippingPrice
├── totalPrice
├── isPaid
├── paidAt
├── isDelivered
├── deliveredAt
├── createdAt
└── updatedAt
```

---

# 4. Order Creation Flow

When a customer creates an order:

```text
Client
  │
  │ POST /api/orders
  ▼
authenticate
  │
  ▼
createOrder
  │
  ├── Validate orderItems
  │
  ├── Find products from MongoDB
  │
  ├── Verify products exist
  │
  ├── Get current prices from database
  │
  ├── Calculate prices
  │
  ├── Attach authenticated user
  │
  └── Save Order
  │
  ▼
Created Order
```

The server **does not trust the product price sent by the client**.

Instead:

```js
const itemsFromDB = await Product.find({
  _id: { $in: orderItems.map((x) => x._id) },
});
```

Then the price comes from MongoDB:

```js
price: matchingItemFromDB.price
```

This is important because a customer should not be able to modify the price from the frontend.

---

# 5. Order Price Calculation

The backend uses the following calculation:

```text
itemsPrice = Σ(product price × quantity)

shippingPrice:
    itemsPrice > 100 → 0
    otherwise        → 10

taxRate = 15%

taxPrice = itemsPrice × 0.15

totalPrice =
    itemsPrice
    + shippingPrice
    + taxPrice
```

Example:

```text
Product price:       $50
Quantity:             2
────────────────────────────
Items price:        $100
Shipping:            $10
Tax (15%):           $15
────────────────────────────
Total:              $125
```

---

# 6. Order API

Base URL:

```text
/api/orders
```

## Create Order

```http
POST /api/orders
```

Authentication:

```text
authenticate
```

Request:

```json
{
  "orderItems": [
    {
      "_id": "productId",
      "name": "Laptop",
      "qty": 1,
      "image": "/uploads/laptop.jpg"
    }
  ],
  "shippingAddress": {
    "address": "123 Street",
    "city": "Phnom Penh",
    "postalCode": "12000",
    "country": "Cambodia"
  },
  "paymentMethod": "PayPal"
}
```

The backend retrieves the product price from MongoDB before creating the order.

---

## Get All Orders

```http
GET /api/orders
```

Authentication:

```text
authenticate
authorizeAdmin
```

Returns all orders and populates basic user information:

```text
user:
    id
    username
```

---

## Get Current User Orders

```http
GET /api/orders/mine
```

Authentication:

```text
authenticate
```

Only returns orders belonging to the authenticated user.

---

## Count Total Orders

```http
GET /api/orders/total-orders
```

Returns:

```json
{
  "totalOrders": 25
}
```

This endpoint should be protected with:

```text
authenticate
authorizeAdmin
```

because it contains admin/business statistics.

---

## Calculate Total Sales

```http
GET /api/orders/total-sales
```

Returns the total value of all orders.

Example:

```json
{
  "totalSales": 1250.5
}
```

Recommended middleware:

```text
authenticate
authorizeAdmin
```

---

## Calculate Sales By Date

```http
GET /api/orders/total-sales-by-date
```

Only paid orders are included.

The backend uses MongoDB aggregation:

```text
Order
 │
 ├── Match isPaid = true
 │
 ├── Group by paidAt date
 │
 └── Sum totalPrice
```

Example response:

```json
[
  {
    "_id": "2026-08-18",
    "totalSales": 250
  },
  {
    "_id": "2026-08-19",
    "totalSales": 450
  }
]
```

Recommended middleware:

```text
authenticate
authorizeAdmin
```

---

## Get Order By ID

```http
GET /api/orders/:id
```

Authentication:

```text
authenticate
```

The user information is populated:

```text
username
email
```

---

## Mark Order As Paid

```http
PUT /api/orders/:id/pay
```

Authentication:

```text
authenticate
```

The backend updates:

```text
isPaid = true
paidAt = current date
paymentResult = payment information
```

Example:

```json
{
  "id": "PAYMENT_ID",
  "status": "COMPLETED",
  "update_time": "2026-08-19T10:00:00Z",
  "payer": {
    "email_address": "customer@example.com"
  }
}
```

---

## Mark Order As Delivered

```http
PUT /api/orders/:id/deliver
```

Authentication:

```text
authenticate
authorizeAdmin
```

Updates:

```text
isDelivered = true
deliveredAt = current date
```

---

# 7. Product API

Base URL:

```text
/api/products
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/` | Public | Get products |
| POST | `/` | Admin | Create product |
| GET | `/allproducts` | Public | Get all products |
| GET | `/top` | Public | Get top products |
| GET | `/new` | Public | Get newest products |
| POST | `/filtered-products` | Public | Filter products |
| GET | `/:id` | Public | Get product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |
| POST | `/:id/reviews` | Authenticated | Add review |

---

# 8. Category API

Base URL:

```text
/api/categories
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/` | Public | List categories |
| POST | `/` | Admin | Create category |
| GET | `/:id` | Public | Get category |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |

---

# 9. User API

Base URL:

```text
/api/users
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/` | Public | Register |
| GET | `/` | Admin | Get all users |
| POST | `/auth` | Public | Login |
| POST | `/logout` | Authenticated | Logout |
| GET | `/profile` | Authenticated | Get profile |
| PUT | `/profile` | Authenticated | Update profile |
| GET | `/:id` | Admin | Get user |
| PUT | `/:id` | Admin | Update user |
| DELETE | `/:id` | Admin | Delete user |

---

# 10. Image Upload API

Base URL:

```text
/api/upload
```

Endpoint:

```http
POST /api/upload
```

Content type:

```text
multipart/form-data
```

Field:

```text
image
```

Supported formats:

```text
.jpg
.jpeg
.png
.webp
```

Uploaded files are stored in:

```text
uploads/
```

Example response:

```json
{
  "message": "Image uploaded successfully",
  "image": "/uploads/image-1724081234567.jpg"
}
```

Express must expose the upload directory:

```js
app.use("/uploads", express.static("uploads"));
```

---

# 11. Authentication Flow

```text
Login
  │
  ▼
POST /api/users/auth
  │
  ▼
Validate email/password
  │
  ▼
Generate authentication token
  │
  ▼
Client stores authentication state
  │
  ▼
Protected request
  │
  ▼
authenticate middleware
  │
  ▼
req.user
```

Admin endpoints additionally use:

```text
authenticate
      │
      ▼
authorizeAdmin
```

---

# 12. Order Lifecycle

```text
             Create Order
                  │
                  ▼
             ┌─────────┐
             │ Pending │
             └────┬────┘
                  │
                  │ Payment
                  ▼
             ┌─────────┐
             │  Paid   │
             └────┬────┘
                  │
                  │ Admin delivers
                  ▼
             ┌───────────┐
             │ Delivered │
             └───────────┘
```

Order state is represented by:

```text
isPaid
paidAt

isDelivered
deliveredAt
```

---

# 13. Admin Dashboard Data

The backend currently provides statistics for an admin dashboard:

```text
Total Orders
      │
      ├── GET /api/orders/total-orders
      │
      ▼
Total Sales
      │
      ├── GET /api/orders/total-sales
      │
      ▼
Sales By Date
      │
      └── GET /api/orders/total-sales-by-date
```

These APIs can be used by Chart.js or another frontend charting library to build the admin dashboard.

---

# 14. Important Backend Improvements

The current implementation works as a basic MVP, but the following improvements should be considered:

### 1. Protect admin statistics

These should require admin authorization:

```text
GET /total-orders
GET /total-sales
GET /total-sales-by-date
```

### 2. Fix naming

```text
calcualteTotalSalesByDate
```

should become:

```text
calculateTotalSalesByDate
```

### 3. Use consistent naming

Prefer:

```text
itemsPrice
shippingPrice
taxPrice
totalPrice
```

throughout the Order model, controller, and API.

### 4. Validate ObjectIds

Use your `checkId` middleware for routes such as:

```text
/orders/:id
/products/:id
```

to prevent invalid MongoDB ObjectId errors.

### 5. Check product stock

Before creating an order, the backend should verify:

```text
requested quantity <= countInStock
```

and decrease inventory after a successful order/payment according to the chosen business flow.

### 6. Avoid floating-point money calculations

For a production application, consider storing monetary values as integer cents:

```text
$10.50 → 1050
$25.99 → 2599
```

This avoids JavaScript floating-point precision problems.

### 7. Improve error handling

Instead of every controller doing:

```js
try {
   ...
} catch (error) {
   res.status(500).json(...)
}
```

use a centralized Express error-handling middleware together with an `asyncHandler`.

---

# 15. Current Backend API Overview

```text
                         MERN E-COMMERCE API
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
        Users                 Products                 Orders
          │                       │                       │
    ┌─────┼─────┐           ┌─────┼─────┐          ┌─────┼─────┐
    │     │     │           │     │     │          │     │     │
  Auth  Profile Admin      CRUD  Reviews Search    Create Admin Payment
```

The backend currently covers the core MVP workflow:

```text
User
 ↓
Login
 ↓
Browse Products
 ↓
Add Products To Cart
 ↓
Create Order
 ↓
Payment
 ↓
Admin Reviews Order
 ↓
Admin Marks Order Delivered
```