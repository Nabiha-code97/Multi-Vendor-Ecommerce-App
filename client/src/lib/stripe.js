import { loadStripe } from "@stripe/stripe-js";

// loadStripe() fetches Stripe.js once and caches the promise, so this module
// must only ever be imported for a single shared instance, never re-created per render.
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
