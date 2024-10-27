import express from  "express";
import Stripe from "stripe";
const stripe = new Stripe('sk_test_51Q7ZXEHGruhKGLixAHqdBosTSK8gHx0rmztkydpKeSnKRGQLPPmH9JYb2EUxSh67UxEurGrzQobRVfq5tEWXUZpL00PP3K9auc');
const router = express()


router.post('/create-checkout-session', async (req, res) => {

    const productAmountInINR = req.body.amount;

    // Ensure the amount is at least ₹42
    if (productAmountInINR < 42) {
        return res.status(400).send({
            message: "Amount must be at least ₹42."
        });
    }

        const product = await stripe.products.create({
            name : req.body.product,
        })

        if(product){
            var price = await stripe.prices.create({
                // product: `${product?.id}`,
                product: product.id,
                unit_amount: req.body.amount * 100,
                currency: "inr"
            });
        }
        if(price.id){
                const session = await stripe.checkout.sessions.create({
                ui_mode: 'embedded',
                line_items: [
                    {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: price.id,
                    quantity: 1,
                    },
                ],
                // customer_email:"pushpendrapal0809@gmail.com",
                customer_email: req.body.email,
                mode: 'payment',
                return_url: `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
                });
                //   console.log(session)
                  return res.send({clientSecret: session.client_secret});
            }
         });


        router.get('/session-status', async (req, res) => {
            try {
                const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
                return res.send({
                    status: session.status,
                    customer_email: session.customer_details.email || null,
                });
            } catch (error) {
                console.error("Error fetching session status:", error.message);
                return res.status(500).send({ message: 'Failed to retrieve session.' });
            }
        });
        


  export default router














