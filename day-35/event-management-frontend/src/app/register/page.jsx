// app/register/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    router.push("/login"); // no auto-login, so send them to log in after registering
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto py-12 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <p className="text-rose-600 text-sm">{error}</p>}
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded px-4 py-2"
      >
        Register
      </button>
    </form>
  );
}
