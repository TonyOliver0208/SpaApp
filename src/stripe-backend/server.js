const express = require('express');
const stripe = require('stripe')(
  'sk_test_51PGJ8i00QwZABgmviuDO4k1VEE1tvkfNqZ20oHWwOSWX737MVQY0HQKdGs7MGJonbA9yuxoK1NFAkwmqvJhwvKb400UaNqVtdj',
);
const app = express();

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const {amount} = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({clientSecret: paymentIntent.client_secret});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
