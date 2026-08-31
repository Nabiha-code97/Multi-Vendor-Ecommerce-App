# E-shop — Frontend (Client)

Web client for E-shop, a multi-vendor e-commerce marketplace. Built with React 19, Vite, Redux Toolkit, and Tailwind CSS v4.

## Features

- **Storefront** — home page with categories, featured products, and flash-sale events; product listing and detail pages; cart and wishlist (persisted in `localStorage`)
- **Checkout & Payment** — shipping form → Stripe PaymentIntent → payment confirmation → order success page
- **Buyer account** — signup with email activation, login, profile info/avatar, address book, order history, password change
- **Seller dashboard** — shop signup/login, overview, product & event management (with image upload), order management, coupon codes, withdrawal requests, shop settings
- **Admin dashboard** — manage users, sellers, products, orders, events, and withdrawal approvals
- **Real-time chat** — buyer↔seller messaging over Socket.io

## Tech Stack

- React 19 + Vite
- Redux Toolkit
- React Router v7
- Tailwind CSS v4
- Axios
- Stripe (`@stripe/react-stripe-js`)
- Socket.io client

## Project Structure

```
client/
├── src/
│   ├── App.jsx / AppRoutes.jsx   # App shell and route definitions
│   ├── components/                # UI components, grouped by feature area
│   ├── pages/                      # Route-level page components
│   ├── redux/                       # Store, actions, reducers
│   ├── context/                      # React context (e.g. chat socket)
│   ├── lib/                           # Third-party client setup (Stripe, etc.)
│   └── static/                         # Static display data
├── public/
└── index.html
```

## Getting Started

### Prerequisites

- Node.js
- The `server` API and `socket` service running (see their READMEs)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:4000
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### Run

```bash
npm run dev        # start dev server with HMR
npm run build       # production build
npm run preview      # preview the production build locally
npm run lint           # run ESLint
```
