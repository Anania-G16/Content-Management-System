"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== "ADMIN") {
      router.replace("/docs");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
