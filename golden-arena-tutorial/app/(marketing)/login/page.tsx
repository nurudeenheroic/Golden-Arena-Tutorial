// app/(marketing)/login/page.tsx
'use client'

import { useActionState } from "react";
import { loginAction } from "./actions";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  const isEmailError = state?.errorType === "email" || state?.errorType === "both";
  const isPasswordError = state?.errorType === "password" || state?.errorType === "both";

  return (
    <div className="max-w-sm mx-auto p-6 space-y-5">
      <h1 className="text-lg font-semibold text-gray-900">Log in</h1>

      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Global Error Banner */}
      {state?.message && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-3">
        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input
            name="email"
            type="email"
            required
            className={`w-full border rounded-lg p-2 text-sm mt-1 outline-none transition-colors ${
              isEmailError
                ? "border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20"
                : "border-gray-200 focus:border-orange-800"
            }`}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Password</label>
          <input
            name="password"
            type="password"
            required
            className={`w-full border rounded-lg p-2 text-sm mt-1 outline-none transition-colors ${
              isPasswordError
                ? "border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20"
                : "border-gray-200 focus:border-orange-800"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#833b0c] text-white py-3 rounded-xl text-sm font-medium hover:bg-orange-900 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Signing in..." : "Log In"}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-[#833b0c] font-semibold hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
