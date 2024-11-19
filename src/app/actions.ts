'use server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 
});

// Test card numbers for Stripe
// Success: 4242 4242 4242 4242
// Decline: 4000 0000 0000 0002
// Requires Authentication: 4000 0025 0000 3155
// Insufficient Funds: 4000 0000 0000 9995

// Test card expiration: Any future date
// Test CVC: Any 3 digits
// Test postal code: Any 5 digits

export async function handleDeposit(amount: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Depósito',
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/deposit/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/deposit`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Error al crear la sesión de pago');
  }
} 