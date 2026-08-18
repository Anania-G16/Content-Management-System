"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/verify-email/error");
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.post("/api/auth/verify-email", {
          token,
        });

        router.replace("/verify-email/success");
      } catch (error) {
        console.error("Email verification failed:", error);
        router.replace("/verify-email/error");
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return null;
}
