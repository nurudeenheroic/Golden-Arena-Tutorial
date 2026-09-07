"use client";

import { LogOut } from "lucide-react";

type SignOutButtonProps = {
  className?: string;
  showIcon?: boolean;
};

export function SignOutButton({
  className = "inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 shadow-xs hover:bg-red-50 hover:border-red-200 transition",
  showIcon = true,
}: SignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      // 1. Call server route handler to destroy Supabase cookies
      await fetch("/auth/signout", { method: "POST" });
    } finally {
      // 2. FORCE a full window reload & redirect to /login
      // Using window.location.replace prevents adding the sign-out trigger page to history
      window.location.replace("/login");
    }
  };

  return (
    <button type="button" onClick={handleSignOut} className={className}>
      {showIcon && <LogOut className="size-3.5" />}
      <span>Sign Out</span>
    </button>
  );
}