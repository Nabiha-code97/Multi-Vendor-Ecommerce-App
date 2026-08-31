# E-shop — Backend (Server)

REST API for E-shop, a multi-vendor e-commerce marketplace. Built with Express 5, Mongoose 9, and ESM.

## Features

- **Auth** — separate JWT-cookie sessions for buyers, sellers (shops), and admins, with email activation links (Brevo) before an account goes live
- **Products & Events** — sellers create products and time-boxed flash-sale events with image uploads (Multer → Cloudinary)
- **Cart & Checkout** — Stripe PaymentIntents, re-priced server-side from the database (never trusts a client-supplied amount), with a signature-verified webhook to fulfill or fail orders
- **Orders** — one order per shop per checkout, with a guarded status pipeline (`Pending Payment → Processing → Shipped → Delivered`) and automatic seller payout on delivery
- **Coupons** — per-shop discount codes
- **Withdrawals** — sellers request payouts from their available balance; admin approves or rejects, with automatic escrow/refund handling
- **Real-time chat** — buyer↔seller messaging, persisted here and delivered live by the sibling `socket` service
- **Admin dashboard API** — manage users, sellers, products, orders, events, and withdrawal requests

## Tech Stack

- Express 5
- MongoDB + Mongoose 9
- JWT (`jsonwebtoken`) + `bcrypt` for auth
- Multer + Cloudinary for image uploads
- Stripe for payments
- Brevo (`@getbrevo/brevo`) for transactional email

## Project Structure

```
server/
├── app.js              # Express app, middleware, route mounting
├── index.js             # Server entry point
├── config/               # Third-party service config (Cloudinary, etc.)
├── controllers/          # Route handlers, grouped by resource
├── db/                   # MongoDB connection
├── middleware/            # Auth guards, error handling
├── models/                # Mongoose schemas
├── routes/                # Express routers, grouped by resource
├── utils/                 # Helpers (mail, JWT/token cookies)
└── seed.mjs               # Idempotent dev seed script
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB instance (local or Atlas)
- Stripe, Cloudinary, and Brevo accounts for full functionality

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=7
ACTIVATION_SECRET=your_activation_token_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

BREVO_API_KEY=your_brevo_api_key
```

### Run

```bash
npm run dev     # nodemon, auto-restarts on change
npm start        # plain node
```

### Seed Sample Data

Populates two shops, products, events, coupons, sample orders, and buyer/admin accounts:

```bash
node seed.mjs
```

All seeded accounts use the password `password123`.

## API Overview

Routes are grouped by resource under `/api`: `users`, `shops`, `products`, `events`, `coupons`, `orders`, `withdraws`, `messages`, and `payment`. Mutating routes are protected by `isAuthenticated`/`isSeller`/`isAdmin` middleware and enforce ownership checks (a seller can only edit their own shop's resources).
