"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in to view this page.</p>;

  return (
    <p>
      Welcome, {user.name} ({user.role})
    </p>
  );
}
