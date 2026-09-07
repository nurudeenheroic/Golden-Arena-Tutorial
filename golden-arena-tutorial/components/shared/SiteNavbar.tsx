    // components/shared/SiteNavbar.tsx
    //
    // Shared navigation bar used by both the marketing layout (logged-out
    // visitors) and the candidate layout (logged-in students). Pass a `user`
    // prop from whichever layout renders this — omit it for logged-out.
   "use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  GraduationCap,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { navLinks } from "@/components/marketing/data";
import ProtectedLink from "./ProtectedLink";

type SiteNavbarProps = {
  user?: {
    name: string;
    isPaid?: boolean;
  } | null;
};

export function SiteNavbar({ user = null }: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<string[]>([]);
  
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle sub-menus inside hamburger drawer
  const toggleMobileCategory = (label: string) => {
    setExpandedMobileCategories((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
        
        {/* Brand Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => {
            setMobileMenuOpen(false);
            setActiveDropdown(null);
          }}
        >
          <div className="grid size-10 place-items-center rounded-xl bg-[#833b0c] text-white shadow-sm">
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

        {/* Desktop Navigation (> 1100px) */}
        <nav className="hidden min-[1101px]:flex items-center justify-center gap-6">
        {navLinks.map((item) => {
            // 1. HOME LINK: Direct routing without ProtectedLink modal wrapper
            if (item.label === "Home" || item.href === "/") {
            return (
                <Link
                key={item.label}
                href={user ? "/dashboard" : "/"}
                className={`py-6 text-xs font-medium transition hover:text-[#833b0c] ${
                    pathname === "/" || pathname === "/dashboard"
                    ? "border-b-2 border-[#833b0c] font-bold text-[#833b0c]"
                    : "text-slate-700"
                }`}
                >
                {item.label}
                </Link>
            );
            }

            const hasSubLinks = Array.isArray(item.dropdown) && item.dropdown.length > 0;

            // 2. DROPDOWN HEADERS (e.g., UTME, Post-UTME, Resources)
            if (hasSubLinks) {
            return (
                <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
                >
                <button
                    type="button"
                    className="flex items-center gap-1 py-6 text-xs font-medium text-slate-700 transition hover:text-[#833b0c]"
                >
                    <span>{item.label}</span>
                    <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${
                        activeDropdown === item.label ? "rotate-180 text-[#833b0c]" : ""
                    }`}
                    />
                </button>

                {activeDropdown === item.label && (
                    <div className="absolute top-[calc(100%-8px)] left-0 min-w-[200px] rounded-xl border border-stone-100 bg-white p-2 shadow-lg animate-in fade-in slide-in-from-top-1">
                    {item.dropdown.map((subItem) => (
                        <ProtectedLink
                        key={subItem.label}
                        href={subItem.href}
                        user={user}
                        requiresPaid={subItem.requiresPaid}
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-[#f9eee7] hover:text-[#833b0c]"
                        >
                        {subItem.label}
                        </ProtectedLink>
                    ))}
                    </div>
                )}
                </div>
            );
            }

            // 3. PROTECTED STANDALONE LINKS (e.g., Quizzes, Pricing, Ask Question)
            return (
            <ProtectedLink
                key={item.label}
                href={item.href}
                user={user}
                requiresPaid={item.requiresPaid}
                onClick={() => setActiveDropdown(null)}
                className="py-6 text-xs font-medium text-slate-700 transition hover:text-[#833b0c]"
            >
                {item.label}
            </ProtectedLink>
            );
        })}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                aria-label="Notifications"
                className="relative grid size-9 place-items-center rounded-full text-slate-600 transition hover:bg-stone-100"
              >
                <Bell className="size-4" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-orange-600 ring-2 ring-white" />
              </button>

              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="grid size-9 place-items-center rounded-full bg-[#f9eee7] text-xs font-bold text-[#833b0c] transition hover:ring-2 hover:ring-[#833b0c]/20"
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>
            </div>
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
                className="hidden rounded-lg bg-[#833b0c] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#6f300a] sm:block"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger Toggle (<= 1100px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="grid size-9 place-items-center rounded-lg border border-stone-200 text-slate-700 transition hover:bg-stone-50 min-[1101px]:hidden"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Accordion Dropdown Drawer (<= 1100px) */}
      {mobileMenuOpen && (
        <div className="absolute top-[calc(100%+8px)] right-5 z-50 min-w-[240px] max-w-[320px] rounded-2xl border border-stone-100 bg-white p-3 shadow-xl max-[1100px]:block min-[1101px]:hidden animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const hasSubLinks = Array.isArray(item.dropdown) && item.dropdown.length > 0;
              const isExpanded = expandedMobileCategories.includes(item.label);

              return (
                <div key={item.label} className="py-0.5">
                  {hasSubLinks ? (
                    <>
                      {/* Accordion Trigger Button */}
                      <button
                        onClick={() => toggleMobileCategory(item.label)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-[#f9eee7] hover:text-[#833b0c]"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`size-3.5 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-[#833b0c]" : ""
                          }`}
                        />
                      </button>

                      {/* Collapsible Accordion Sub-links */}
                      {isExpanded && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#f9eee7] pl-2 animate-in fade-in slide-in-from-top-1">
                          {item.dropdown.map((subItem) => (
                            <ProtectedLink
                              key={subItem.label}
                              href={subItem.href}
                              user={user}
                              requiresPaid={subItem.requiresPaid}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block rounded-lg py-1.5 px-2 text-[11px] font-medium text-slate-600 transition hover:text-[#833b0c]"
                            >
                              {subItem.label}
                            </ProtectedLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Standard Direct Link */
                    <ProtectedLink
                      href={item.href}
                      user={user}
                      requiresPaid={item.requiresPaid}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-[#f9eee7] hover:text-[#833b0c]"
                    >
                      <span>{item.label}</span>
                    </ProtectedLink>
                  )}
                </div>
              );
            })}
          </nav>

          {!user && (
            <div className="mt-3 space-y-2 border-t border-stone-100 pt-3 sm:hidden">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-xl border border-stone-300 py-2 text-center text-xs font-semibold text-slate-800"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-xl bg-[#833b0c] py-2 text-center text-xs font-bold text-white shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-3 border-t border-stone-100 pt-3">
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </header>
  );
}