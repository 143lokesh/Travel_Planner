"use client";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useSearchParams } from "next/navigation";
import { StripeForm } from "./components/checkout-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

const Page = () => {
  const [clientSecret, setClientSecret] = useState("");

  const searchParams = useSearchParams();

  const client_secret = searchParams.get("client_secret");

  useEffect(() => {
    if (client_secret) {
      setClientSecret(client_secret);
    }
  }, [client_secret]);

  return (
    <div className="min-h-[80vh]">
      {clientSecret && (
        <Elements
          options={{ clientSecret, appearance: { theme: "stripe" } }}
          stripe={stripePromise}
        >
          <StripeForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
};

export default Page;