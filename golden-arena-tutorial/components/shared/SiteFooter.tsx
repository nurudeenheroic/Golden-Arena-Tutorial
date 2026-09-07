"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

type SiteFooterProps = {
  user?: {
    name: string;
    isPaid?: boolean;
  } | null;
};

export function SiteFooter({ user = null }: SiteFooterProps) {
  return (
    <footer className="border-t border-stone-200 bg-white py-12 text-slate-600">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center gap-2.5"
            >
              <div className="grid size-9 place-items-center rounded-xl bg-[#833b0c] text-white">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-lg font-black text-[#833b0c]">GAT</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering candidates for UTME excellence with real-time practice and analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href={user ? "/dashboard" : "/"}
                  className="hover:text-[#833b0c] transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={user ? "/dashboard#pricing" : "/#pricing"}
                  className="hover:text-[#833b0c] transition"
                >
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link
                  href={user ? "/dashboard/practice" : "/login"}
                  className="hover:text-[#833b0c] transition"
                >
                  Practice CBT
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              {user ? (
                <>
                  <li>
                    <Link
                      href="/dashboard/profile"
                      className="hover:text-[#833b0c] transition"
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:text-[#833b0c] transition"
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="hover:text-[#833b0c] transition">
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-[#833b0c] transition">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal / Copyright */}
          <div className="text-xs text-slate-400 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 mb-3">
              Golden Arena
            </h4>
            <p>© {new Date().getFullYear()} GAT. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}