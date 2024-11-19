"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");
  const [status, setStatus] = useState("loading");

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
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {status === "loading" && <p>Procesando pago...</p>}
      {status === "success" && <p>¡Pago completado con éxito!</p>}
      {status === "error" && <p>Error al procesar el pago</p>}
    </div>
  );
}
