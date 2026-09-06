// app/(marketing)/login/page.tsx
import { loginAction } from "./actions";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto p-6 space-y-5">
      <h1 className="text-lg font-bold text-orange-900">Ready to start your Success Journey?</h1>
      <h2 className="text-lg font-semibold text-gray-600">Log in to your account</h2>

      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form action={loginAction} className="space-y-3">
        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-gray-200 rounded-lg p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border border-gray-200 rounded-lg p-2 text-sm mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-800 text-white py-3 rounded-xl text-sm font-medium"
        >
          Log In
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-orange-700 font-medium">
          Sign up
        </a>
      </p>
    </div>
  );
}
