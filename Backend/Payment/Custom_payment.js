import express from "express";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51Q7ZXEHGruhKGLixAHqdBosTSK8gHx0rmztkydpKeSnKRGQLPPmH9JYb2EUxSh67UxEurGrzQobRVfq5tEWXUZpL00PP3K9auc');
const router = express.Router();

const calculateOrderAmount = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};


router.post("/create-payment-intent", async (req, res) => {
  const { product, amount } = req.body;
  const items = [{ amount }];

  if (amount < 42) {
    return res.status(400).send({
      message: "Amount must be at least ₹42.",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items) * 100,
      currency: "inr",
      automatic_payment_methods: { enabled: true },
      description: `Payment for ${product}`,
      metadata: { productName: product },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});




// Example endpoint to check payment intent status
router.get('/session-status', async (req, res) => {
  const clientSecret = req.query.client_secret;

  if (!clientSecret) {
    return res.status(400).json({ error: "Client secret is required" });
  }

  // Extract the PaymentIntent ID from the client secret (it's the part before the underscore)
  const paymentIntentId = clientSecret.split('_secret')[0];

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json({ status: paymentIntent.status, intentId: paymentIntent.id , result: paymentIntent, amount: paymentIntent.amount });
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    res.status(500).json({ error: "Failed to retrieve payment status" });
  }
});



export default router;
