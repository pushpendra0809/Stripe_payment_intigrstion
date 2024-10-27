import express from  "express";
import Stripe from "stripe";
const stripe = new Stripe('sk_test_51Q7ZXEHGruhKGLixAHqdBosTSK8gHx0rmztkydpKeSnKRGQLPPmH9JYb2EUxSh67UxEurGrzQobRVfq5tEWXUZpL00PP3K9auc');
// const stripe = new Stripe('sk_test_51O6XqFSIvk6cMNyquywrvuvsxS65J1AoLKPMpjneia4tnrTjHc8FyMstdAcFGdln6T45xMHLvvcq7NDKmgPBA6sL00FIqUUNO0');
const router = express()


router.post('/create-checkout-session', async (req, res) => {
    const product = await stripe.products.create({
      name: req.body.product_name,
    });

    if(product){
        var price = await stripe.prices.create({
            product: `${product?.id}`,
            unit_amount: req.body.amount * 100,
            currency: 'inr',
        });
    }
    if(price.id){
        var session = await stripe.checkout.sessions.create({
           line_items: [
            {
                price: `${price.id}`,
                quantity: 1,
            },
           ],
           customer_email: "pushpendrapal0809@gmail.com",
           mode: 'payment',
           success_url: 'http://localhost:8000/hosted/success',
           cancel_url: 'http://localhost:8000/hosted/cancel',
        });
        res.redirect(303, session?.url);
    }
  
  });
  

  router.get("/success", async(req,res)=>{
    try{
        return res.redirect('http://localhost:3000/success');
    } catch (error){
        console.error(error.message)
    }
  });


  router.get('/cancel', async(req,res) =>{
    try {
        return res.redirect('http://localhost:3000/failure');
    } catch (error) {
        console.error(error.message)
    }
  })

  export default router;







