"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError, login } from "../../lib/api";
import { saveAuth } from "../../lib/storage";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: LoginForm) => {
    setFormError(null);
    try {
      const result = await login(values);
      saveAuth(result.token, result.user);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError("Unable to login right now. Please try again.");
      }
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your credentials to access your dashboard.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Need an account?{" "}
        <Link href="/signup" className="font-medium text-gray-900 underline">
          Sign up
        </Link>
      </p>
    </section>
  );
}

