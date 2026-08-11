"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const hasAccess = user?.role === "admin" || user?.role === "organizer";

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.push("/dashboard");
    }
  }, [loading, hasAccess, router]);

  if (loading) return <p>Loading...</p>;
  if (!hasAccess) return null;

  return <>{children}</>;
}
