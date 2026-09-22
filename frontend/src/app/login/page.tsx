"use client";

import React from "react";
import { CreateAccountScreen } from "@/components/auth/CreateAccountScreen";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { setShowWelcome, setAuthStep } = useApp();

  return (
    <CreateAccountScreen
      initialSignInMode={true}
      onSuccess={() => {
        setShowWelcome(false);
        router.push("/");
      }}
      onBackToWelcome={() => {
        setAuthStep("welcome");
        router.push("/");
      }}
    />
  );
}
