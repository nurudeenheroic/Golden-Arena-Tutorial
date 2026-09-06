// components/shared/SiteNavbar.tsx
//
// Shared navigation bar used by both the marketing layout (logged-out
// visitors) and the candidate layout (logged-in students). Pass a `user`
// prop from whichever layout renders this — omit it for logged-out.
"use client";

import { ChevronDown, GraduationCap, Search, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/components/marketing/data";

type SiteNavbarProps = {
  user?: {
    name: string;
  } | null;
};

export function SiteNavbar({ user = null }: SiteNavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-7 px-5 lg:px-8">
        {/* GAT logo — links home for visitors, to the dashboard for students */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="grid size-10 place-items-center rounded-xl bg-[#833b0c] text-white">
            <GraduationCap className="size-5" />
          </div>
          <div className="leading-none">
            <span className="block text-xl font-black tracking-tight text-[#833b0c]">
              GAT
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              Golden Arena Tutorial
            </span>
          </div>
        </Link>

        {/* Desktop navigation — same links regardless of auth state */}
        <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 py-6 text-[12px] font-medium transition hover:text-[#833b0c] ${
                  isActive
                    ? "border-b-2 border-[#833b0c] text-[#833b0c]"
                    : "text-slate-700"
                }`}
              >
                {item.label}
                {item.dropdown && <ChevronDown className="size-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Right side — differs based on auth state */}
        <div className="ml-auto flex items-center gap-2.5">
          <button
            aria-label="Search"
            className="hidden size-9 place-items-center rounded-full text-slate-600 hover:bg-stone-50 sm:grid"
          >
            <Search className="size-4" />
          </button>

          {user ? (
            <>
              <button
                aria-label="Notifications"
                className="grid size-9 place-items-center rounded-full text-slate-600 hover:bg-stone-50"
              >
                <Bell className="size-4" />
              </button>
              <div className="grid size-9 place-items-center rounded-full bg-[#f9eee7] text-xs font-bold text-[#833b0c]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg border border-stone-300 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-[#833b0c] hover:text-[#833b0c] sm:block"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#833b0c] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#6f300a]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}