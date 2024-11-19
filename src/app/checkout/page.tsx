"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
 
  const [status, setStatus] = useState("loading");
  const [clientSecret, setClientSecret] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {     
    const clientSecret = searchParams.get("clientSecret");
    setClientSecret(clientSecret || "");
  }, [searchParams]);

 
  useEffect(() => {
    if (!clientSecret) return;

    const handlePayment = async () => {
      console.log("clientSecret", clientSecret);
      const stripe = await stripePromise;
      if (!stripePromise) {
        throw new Error('Missing value for Stripe(): apiKey should be a valid publishable key');
      }
      console.log("stripe", stripe);

      if (!stripe) {
        setStatus("error");
        return;
      }

      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: "http://localhost:3000",
        },

      });

      if (error) {
        setStatus("error");
        console.error("Error:", error);
      } else {
        setStatus("success");
      }
    };

    handlePayment();
  }, [clientSecret]);


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        {status === "loading" && <p>Procesando pago...</p>}
        {status === "success" && <p>¡Pago completado con éxito!</p>}
        {status === "error" && <p>Error al procesar el pago</p>}
      </div>
    </Suspense>
  );
}
