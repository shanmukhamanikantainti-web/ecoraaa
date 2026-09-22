"use client";

import React, { useEffect } from "react";
import { CreateAccountScreen } from "@/components/auth/CreateAccountScreen";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function CreateAccountPage() {
  const router = useRouter();
  const { setShowWelcome, setAuthStep, isAuthenticated, mounted } = useApp();

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, router]);

  return (
    <CreateAccountScreen
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
