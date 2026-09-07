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
  Check,
  CheckCheck,
  Inbox,
  Sparkles,
} from "lucide-react";
import { navLinks } from "@/components/marketing/data";
import ProtectedLink from "./ProtectedLink";
import { SignOutButton } from "@/components/shared/SignOutButton";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
};

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
  
  // Notification Dropdown State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const navRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Initialize Welcome Notification when candidate logs in
  useEffect(() => {
    if (user) {
      const firstName = user.name.split(" ")[0];
      setNotifications([
        {
          id: "welcome-1",
          title: `Welcome to GAT, ${firstName}! 🎉`,
          message: "Your portal is ready. Start practicing UTME past questions or complete your daily streak!",
          timestamp: "Just now",
          isRead: false,
        },
        {
          id: "utme-tip-2",
          title: "Syllabus Tip 📚",
          message: "Check out the practice-by-subject section to target your weakest topics first.",
          timestamp: "2h ago",
          isRead: false,
        },
      ]);
    }
  }, [user]);

  // Close menus & notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notification Actions
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleMobileCategory = (label: string) => {
    setExpandedMobileCategories((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  // Fixed click handler for Home and Pricing
  const handlePublicClick = (labelLower: string, hrefLower: string, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setNotificationsOpen(false);

    // 1. Home link smooth scroll logic
    if (labelLower === "home" || hrefLower === "/" || hrefLower === "/dashboard") {
      const isCurrentHomeRoute = user ? pathname === "/dashboard" : pathname === "/";
      if (isCurrentHomeRoute) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    // 2. Visitor clicking Pricing anchor on public homepage
    if (!user && (labelLower === "pricing" || hrefLower?.includes("#pricing"))) {
      if (pathname === "/") {
        e.preventDefault();
        const pricingSection = document.getElementById("pricing");
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.hash = "pricing";
        }
      }
    }
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
        
        {/* Brand Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex shrink-0 items-center gap-2.5"
          onClick={(e) => handlePublicClick("home", user ? "/dashboard" : "/", e)}
        >
          <div className="grid size-10 place-items-center rounded-xl bg-[#833b0c] text-white shadow-xs">
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

        {/* Desktop Navigation */}
        <nav className="hidden min-[1101px]:flex items-center justify-center gap-6">
          {navLinks.map((item) => {
            const labelLower = item.label?.toLowerCase().trim();
            const hrefLower = item.href?.toLowerCase().trim();

            const isPublic =
              labelLower === "home" ||
              labelLower === "pricing" ||
              hrefLower === "/" ||
              hrefLower === "/#pricing" ||
              hrefLower?.includes("#pricing");

            if (isPublic) {
              const targetHref =
                labelLower === "home" || hrefLower === "/"
                  ? user ? "/dashboard" : "/"
                  : user ? "/dashboard#pricing" : "/#pricing";

              return (
                <Link
                  key={item.label}
                  href={targetHref}
                  onClick={(e) => handlePublicClick(labelLower, hrefLower ?? "", e)}
                  className="py-6 text-xs font-medium text-slate-700 transition hover:text-[#833b0c]"
                >
                  {item.label}
                </Link>
              );
            }

            const hasSubLinks = Array.isArray(item.dropdown) && item.dropdown.length > 0;

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
              
              {/* Notification Bell Dropdown */}
              <div ref={notificationRef} className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative grid size-9 place-items-center rounded-full text-slate-600 transition hover:bg-stone-100 active:scale-95"
                >
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 size-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-[#f9eee7] px-2 py-0.5 text-[9px] font-extrabold text-[#833b0c]">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#833b0c] hover:underline"
                        >
                          <CheckCheck className="size-3" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                      {notifications.length > 0 ? (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`group relative rounded-xl border p-3 transition-colors ${
                              item.isRead
                                ? "border-stone-100 bg-stone-50/50"
                                : "border-[#833b0c]/20 bg-[#f9eee7]/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 pr-4">
                                <p className="text-xs font-bold text-slate-900 leading-tight">
                                  {item.title}
                                </p>
                                <p className="text-[11px] leading-relaxed text-slate-600">
                                  {item.message}
                                </p>
                                <p className="text-[9px] text-slate-400 font-medium pt-1">
                                  {item.timestamp}
                                </p>
                              </div>

                              {!item.isRead && (
                                <button
                                  type="button"
                                  onClick={() => markAsRead(item.id)}
                                  title="Mark as read"
                                  className="grid size-6 shrink-0 place-items-center rounded-lg bg-white border border-stone-200 text-slate-500 hover:border-[#833b0c] hover:text-[#833b0c] transition"
                                >
                                  <Check className="size-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center space-y-2">
                          <Inbox className="mx-auto size-8 text-slate-300" />
                          <p className="text-xs font-semibold text-slate-500">No notifications yet</p>
                          <p className="text-[10px] text-slate-400">Updates about quizzes and streak alerts will appear here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Candidate Avatar -> /dashboard/profile */}
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                title="View Account Profile"
                className="grid size-9 place-items-center rounded-full bg-[#f9eee7] text-xs font-black text-[#833b0c] border border-[#833b0c]/20 shadow-2xs transition hover:scale-105 hover:ring-2 hover:ring-[#833b0c]/30 active:scale-95"
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
                className="hidden rounded-lg bg-[#833b0c] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#6f300a] sm:block"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="grid size-9 place-items-center rounded-lg border border-stone-200 text-slate-700 transition hover:bg-stone-50 min-[1101px]:hidden"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-[calc(100%+8px)] right-5 z-50 min-w-[240px] max-w-[320px] rounded-2xl border border-stone-100 bg-white p-3 shadow-xl max-[1100px]:block min-[1101px]:hidden animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const labelLower = item.label?.toLowerCase().trim();
              const hrefLower = item.href?.toLowerCase().trim();

              const isPublic =
                labelLower === "home" ||
                labelLower === "pricing" ||
                hrefLower === "/" ||
                hrefLower === "/#pricing" ||
                hrefLower?.includes("#pricing");

              if (isPublic) {
                const targetHref =
                  labelLower === "home" || hrefLower === "/"
                    ? user ? "/dashboard" : "/"
                    : user ? "/dashboard#pricing" : "/#pricing";

                return (
                  <Link
                    key={item.label}
                    href={targetHref}
                    onClick={(e) => handlePublicClick(labelLower, hrefLower ?? "", e)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-[#f9eee7] hover:text-[#833b0c]"
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              }

              const hasSubLinks = Array.isArray(item.dropdown) && item.dropdown.length > 0;
              const isExpanded = expandedMobileCategories.includes(item.label);

              return (
                <div key={item.label} className="py-0.5">
                  {hasSubLinks ? (
                    <>
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
                className="block w-full rounded-xl bg-[#833b0c] py-2 text-center text-xs font-bold text-white shadow-xs"
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-3 border-t border-stone-100 pt-3 space-y-2">
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl bg-[#f9eee7]/50 px-3 py-2 text-xs font-bold text-[#833b0c]"
              >
                <span>My Profile</span>
                <Sparkles className="size-3.5" />
              </Link>

              <SignOutButton className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition" />
            </div>
          )}
        </div>
      )}
    </header>
  );
}