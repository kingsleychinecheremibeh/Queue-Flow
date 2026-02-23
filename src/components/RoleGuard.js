'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ children, allowedRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // Wrong role
    if (user.role !== allowedRole) {
      if (user.role === "business") {
        router.replace("/business/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  }, [user, loading, router, allowedRole]);

  if (loading || !user || user.role !== allowedRole) {
    return null;
  }

  return children;
}
