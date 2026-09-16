"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useRouter } from "next/navigation";
import { login, registerUser } from "../store/slice/authSlice";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  onSwitchMode?: () => void;
}

export default function AuthForm({ mode, onSwitchMode }: AuthFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isLogin = mode === "login";

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError("");

    if (!email.trim() || !password.trim()) {
      setFieldError("Email and password are required.");
      return;
    }

    if (!isLogin && !name.trim()) {
      setFieldError("Name is required.");
      return;
    }
    if (mode === "register") {
      const result = await dispatch(
        registerUser({
          name,
          email,
          password,
        }),
      );

      if (registerUser.fulfilled.match(result)) {
        onSwitchMode?.();
      }
      return;
    }

    const result = await dispatch(
      login({
        email,
        password,
      }),
    );

    if (login.fulfilled.match(result)) {
      router.push("/dashboard");
    }
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

      {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}

      <button
        type="submit"
        disabled={loading}
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
