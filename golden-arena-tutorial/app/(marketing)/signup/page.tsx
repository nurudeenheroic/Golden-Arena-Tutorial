// app/(marketing)/signup/page.tsx
'use client'

import { useActionState, use } from "react";
import { signupAction } from "./actions";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="max-w-sm mx-auto p-6 space-y-5">
      <div>
        <h1 className="text-lg font-bold text-[#833b0c]">Ready to start your Success Journey?</h1>
        <h2 className="text-sm font-semibold text-gray-600 mt-1">Create your account</h2>
      </div>

      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-3">
        {/* Preserves the callback URL for post-signup redirection */}
        <input
          type="hidden"
          name="callbackUrl"
          value={resolvedParams?.callbackUrl || ""}
        />

        <div>
          <label className="text-xs text-gray-500">Full Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border border-gray-200 rounded-lg p-2 text-sm mt-1 outline-none focus:border-[#833b0c]"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-gray-200 rounded-lg p-2 text-sm mt-1 outline-none focus:border-[#833b0c]"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm mt-1 outline-none focus:border-[#833b0c]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#833b0c] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#6f300a] disabled:opacity-50 transition-colors"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-[#833b0c] font-semibold hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}