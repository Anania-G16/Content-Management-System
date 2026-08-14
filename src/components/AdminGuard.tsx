"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  console.log("AdminGuard user:", user);

  return <>{children}</>;
}