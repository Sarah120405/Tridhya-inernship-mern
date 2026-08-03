// components/AuthForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode, onSuccess }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [formData, setFormData] = useState(
    isRegister
      ? { name: "", email: "", password: "" }
      : { email: "", password: "" },
  );
  const [error, setError] = useState(null);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    console.log("Handle Submit called");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    const res = await fetch(`http://localhost:5000${endpoint}`, {
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

    if (onSuccess) {
      console.log("Authentication successful");
      onSuccess();
    } else {
      console.log("Redirecting to", isRegister ? "/login" : "/dashboard");
      router.push(isRegister ? "/login" : "/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-rose-600 text-sm">{error}</p>}

      {isRegister && (
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
      )}
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
        className="px-5 py-3 rounded-full text-white font-medium bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
      >
        {isRegister ? "Register" : "Log In"}
      </button>
    </form>
  );
}
