"use client";

import { FormEvent, useState } from "react";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit?: (data: { name?: string; email: string; password: string }) => void;
  onSwitchMode?: () => void;
}

export default function AuthForm({
  mode,
  onSubmit,
  onSwitchMode,
}: AuthFormProps) {
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!isLogin && !name.trim()) {
      setError("Name is required.");
      return;
    }

    onSubmit?.({
      ...(isLogin ? {} : { name: name.trim() }),
      email: email.trim(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isLogin && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800"
      >
        {isLogin ? "Login" : "Register"}
      </button>

      {onSwitchMode && (
        <p className="text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="font-medium text-black hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      )}
    </form>
  );
}
