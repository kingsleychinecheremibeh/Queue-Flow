'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ children, allowedRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the AuthContext is done loading the profile
    if (loading) return;

    // 1. If no user is found, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // 2. Translate the boolean 'is_business' into a role string
    // This matches the 'allowedRole' prop ("business" or "user")
    const currentRole = user.is_business ? "business" : "user";

    // 3. If the role doesn't match, redirect to their correct dashboard
    if (currentRole !== allowedRole) {
      if (currentRole === "business") {
        router.replace("/business/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  }, [user, loading, router, allowedRole]);

  // Determine if the user should see the content
  const isAuthorized = user && (user.is_business ? "business" : "user") === allowedRole;

  // Show a loading state while verifying or if unauthorized (to prevent flicker)
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500 italic">Verifying Access...</p>
        </div>
      </div>
    );
  }

  return children;
}