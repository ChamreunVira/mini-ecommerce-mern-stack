# Architecture Specification — Mini E-commerce

## 1. Architecture Overview

The application uses a modular monolithic architecture.

```text
Client
  |
  v
Express API
  |
  +-- Routes
  |
  +-- Controllers
  |
  +-- Models
  |
  v
MongoDB
```

The backend is responsible for authentication, business logic, data validation, and database access.

---

## 2. Technology Stack

### Backend

* Node.js
* Express.js
* TypeScript
* Mongoose
* MongoDB
* JWT
* bcrypt
* Zod

### Infrastructure

* Docker
* Docker Compose
* MongoDB
* Mongo Express

---

## 3. Backend Structure

```text
src/
├── config/
│   ├── db.ts
│   └── env.ts
│
├── controllers/
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   └── order.controller.ts
│
├── services/
│   ├── auth.service.ts
│   ├── product.service.ts
│   └── order.service.ts
│
├── models/
│   ├── user.model.ts
│   ├── product.model.ts
│   └── order.model.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   └── order.routes.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
│
├── utils/
│   ├── asyncHandler.ts
│   └── ApiError.ts
│
├── validators/
│   ├── auth.validator.ts
│   ├── product.validator.ts
│   └── order.validator.ts
│
├── app.ts
└── server.ts
```

---

## 4. Responsibility Rules

### Routes

Routes only define HTTP endpoints and middleware.

Routes must NOT contain business logic.

Example:

```text
POST /api/auth/login
POST /api/products
GET  /api/products
POST /api/orders
```

### Controllers

Controllers handle HTTP-level concerns:

* Read request
* Call service
* Return response

Controllers should NOT contain complex business logic.

### Services

Services contain business logic.

Examples:

* Calculate order total
* Check product stock
* Create order
* Hash password
* Generate tokens

### Models

Models define MongoDB schemas and database-level behavior.

---

## 5. Request Flow

```text
HTTP Request
    |
    v
Route
    |
    v
Middleware
    |
    v
Controller
    |
    v
Mongoose Model
    |
    v
MongoDB
    |
    v
Controller
    |
    v
HTTP Response
```

---

## 6. Authentication

Use JWT-based authentication.

### Access Token

The access token is used to authenticate API requests.

### Refresh Token

The refresh token is stored in an HttpOnly Secure Cookie.

The client should not store the refresh token in localStorage.

Authentication flow:

```text
Login
  |
  v
Validate credentials
  |
  v
Generate access token
  |
  v
Generate refresh token
  |
  +----> Access token
  |
  +----> HttpOnly Cookie
```

---

## 7. Authorization

Use role-based authorization.

Roles:

```text
customer
admin
```

Example:

```text
GET /api/orders
```

A customer can only access their own orders.

An admin can access all orders.

---

## 8. Database Design

### User

```text
User
├── _id
├── name
├── email
├── password
├── role
├── createdAt
└── updatedAt
```

### Product

```text
Product
├── _id
├── name
├── description
├── price
├── image
├── category
├── stock
├── createdAt
└── updatedAt
```

### Order

```text
Order
├── _id
├── user
├── orderItems[]
├── shippingAddress
├── itemsPrice
├── shippingPrice
├── taxPrice
├── totalPrice
├── status
├── createdAt
└── updatedAt
```

---

## 9. Error Handling

All unexpected errors should be handled by a centralized error middleware.

Expected API error format:

```json
{
  "success": false,
  "message": "Product not found"
}
```

Do not duplicate try/catch logic in every controller when `asyncHandler` is used.

---

## 10. API Response Convention

Successful response:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "..."
  }
}
```

However, avoid unnecessary nested structures.

Do not create structures such as:

```json
{
  "data": {
    "data": {}
  }
}
```

---

## 11. Security Rules

* Passwords must be hashed using bcrypt.
* Never return password hashes in API responses.
* Validate request input.
* Protect private routes with authentication middleware.
* Protect admin routes with role middleware.
* Use HttpOnly Secure Cookies for refresh tokens.
* Store secrets in environment variables.
* Never commit `.env` files.

---

## 12. Environment Variables

Example:

```env
PORT=5000
MONGO_URI=mongodb://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
NODE_ENV=development
```

---

## 13. Docker

Development infrastructure:

```text
Docker Compose
├── mongo
└── mongo-express
```

MongoDB data must use a persistent Docker volume.

The application should be able to start the database infrastructure using:

```bash
docker compose up -d
```

---

## 14. Architecture Constraints

The implementation must follow these rules:

1. Use TypeScript.
2. Use modular monolithic architecture.
3. Keep controllers thin.
4. Put business logic inside services.
5. Keep database access inside models/services.
6. Validate external input.
7. Use centralized error handling.
8. Use asyncHandler for asynchronous controllers.
9. Do not introduce unnecessary abstractions.
10. Do not introduce microservices for the MVP.
11. Do not add features that are not defined in `mvp.md` unless explicitly requested.Authentication
