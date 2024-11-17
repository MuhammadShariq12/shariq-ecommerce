"use client"
import { useState, useEffect } from "react";
import useCart from "@/lib/hooks/useCart";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import User from "@/lib/models/User";

const generateSessionKey = (clerkID: string) => {
  const sessionKey = btoa(`${clerkID}-${Date.now()}`);
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  localStorage.setItem("sessionKey", sessionKey);
  localStorage.setItem("sessionExpiry", expiryDate.toISOString());

  return sessionKey;
};

const SuccessfulPayment = () => {
  const cart = useCart();
  const { isLoaded, user } = useUser();
  const [sessionKey, setSessionKey] = useState<string | null>(null); // Define sessionKey type as string | null

  useEffect(() => {
    if (isLoaded && user) {
      cart.clearCart();
      const newSessionKey = generateSessionKey(user.id); 
      setSessionKey(newSessionKey); // This will now accept a string type for sessionKey

      fetch("/api/save-session-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkID: user.id, sessionKey: newSessionKey }),
      })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          console.error("Failed to save session key:", data.error);
        }
      });
    }
  }, [isLoaded, user]);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      <p className="text-heading4-bold text-red-1">Successful Payment</p>
      <p>Thank you for your purchase</p>
      {sessionKey && (
        <div className="text-base text-gray-700">
          <p>Your session key is valid for 30-days:</p>
          <p className="font-mono">{sessionKey}</p>
        </div>
      )}
      <Link
        href="/"
        className="p-4 border text-base-bold hover:bg-black hover:text-white"
      >
        CONTINUE TO SHOPPING
      </Link>
    </div>
  );
};

export default SuccessfulPayment;
















