import Stripe from "stripe";

let stripe;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook signature verification failed: ${error.message}`);
  }

  console.log("Received Stripe event:", event.type);

  res.json({ received: true });
};
