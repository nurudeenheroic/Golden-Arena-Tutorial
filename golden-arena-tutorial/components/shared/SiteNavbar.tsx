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
  BookOpen,
  HelpCircle,
  FileText,
  Home,
  CreditCard,
  Trophy,
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

const getNavLinkIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("home")) return <Home className="size-4 shrink-0" />;
  if (l.includes("pricing")) return <CreditCard className="size-4 shrink-0" />;
  if (l.includes("faq") || l.includes("support")) return <HelpCircle className="size-4 shrink-0" />;
  if (l.includes("leaderboard")) return <Trophy className="size-4 shrink-0" />;
  if (l.includes("resource") || l.includes("syllabus") || l.includes("guide") || l.includes("group")) return <FileText className="size-4 shrink-0" />;
  return <BookOpen className="size-4 shrink-0" />;
};

export function SiteNavbar({ user = null }: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<string[]>([]);
  
  // Notification Dropdown State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Automatically close mobile menu drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setNotificationsOpen(false);
  }, [pathname]);

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

  // Close notifications and handle Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  const handlePublicClick = (labelLower: string, hrefLower: string, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setNotificationsOpen(false);

    if (labelLower === "home" || hrefLower === "/" || hrefLower === "/dashboard") {
      const isCurrentHomeRoute = user ? pathname === "/dashboard" : pathname === "/";
      if (isCurrentHomeRoute) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

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

    if (labelLower === "faq & support" || hrefLower?.includes("#faq")) {
      if (pathname === "/" || pathname === "/dashboard") {
        e.preventDefault();
        const faqSection = document.getElementById("faq");
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.hash = "faq";
        }
      }
    }
  };

  // Re-map navLinks: Remove FAQ, add Study Groups into Resources, and ensure Leaderboard is included
  const processedNavLinks = navLinks.map((item) => {
    if (item.label.toLowerCase().includes("resource") && Array.isArray(item.dropdown)) {
      const filtered = item.dropdown.filter(
        (sub) => !sub.label.toLowerCase().includes("faq") && !sub.label.toLowerCase().includes("support")
      );
      const hasStudyGroups = filtered.some((sub) => sub.label.toLowerCase().includes("study group"));
      const updatedDropdown = hasStudyGroups
        ? filtered
        : [...filtered, { label: "Study Groups", href: "/dashboard/study-groups", requiresPaid: false }];

      return {
        ...item,
        dropdown: updatedDropdown,
      };
    }
    return item;
  });

  // Ensure Leaderboard is present in navLinks
  const hasLeaderboard = processedNavLinks.some((item) => item.label.toLowerCase().includes("leaderboard"));
  const navLinksWithLeaderboard = hasLeaderboard
    ? processedNavLinks
    : [
        ...processedNavLinks.slice(0, 2),
        { label: "Leaderboard", href: "/dashboard/leaderboard", requiresPaid: false },
        ...processedNavLinks.slice(2),
      ];

  // Inject standalone FAQ & Support if not already present
  const hasFaqLink = navLinksWithLeaderboard.some((item) => item.label.toLowerCase().includes("faq"));
  const finalNavLinks = hasFaqLink
    ? navLinksWithLeaderboard
    : [...navLinksWithLeaderboard, { label: "FAQ & Support", href: "/#faq", dropdown: [] }];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
          
          {/* Brand Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex shrink-0 items-center gap-2.5 transition-all duration-500 ease-out animate-[slideFromLeft_0.5s_ease-out]"
            onClick={(e) => handlePublicClick("home", user ? "/dashboard" : "/", e)}
          >
            <div className="grid size-10 place-items-center rounded-xl bg-[#833b0c] text-white shadow-xs transition-transform duration-300 hover:scale-105">
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
          <nav className="hidden min-[1101px]:flex items-center justify-center gap-2 lg:gap-3 animate-[slideFromTop_0.5s_ease-out]">
            {finalNavLinks.map((item) => {
              const labelLower = item.label?.toLowerCase().trim();
              
              if (labelLower?.includes("leaderboard") || labelLower?.includes("faq")) {
                return null;
              }

              const hrefLower = item.href?.toLowerCase().trim();

              const isPublic =
                labelLower === "home" ||
                labelLower === "pricing" ||
                hrefLower === "/" ||
                hrefLower === "/#pricing" ||
                hrefLower?.includes("#pricing");

              const isActive = pathname === item.href;

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
                    className={`flex items-center px-2.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      isActive 
                        ? "bg-[#f9eee7] text-[#833b0c] font-bold" 
                        : "text-slate-700 hover:text-[#833b0c] hover:bg-stone-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {labelLower === "pricing" && (
                      <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.2 text-[8px] font-extrabold text-emerald-700">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              }

              const hasSubLinks = Array.isArray(item.dropdown) && item.dropdown.length > 0;
              const isExpanded = activeDropdown === item.label;

              if (hasSubLinks) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-haspopup="true"
                      onClick={() => setActiveDropdown(isExpanded ? null : item.label)}
                      className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 transition-all hover:text-[#833b0c] hover:bg-stone-50 whitespace-nowrap"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-[#833b0c]" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute top-[calc(100%-4px)] left-0 min-w-[220px] rounded-xl border border-stone-200 bg-white p-2 shadow-xl transition-all duration-300 ease-in-out transform origin-top ${
                        isExpanded
                          ? "opacity-100 scale-y-100 pointer-events-auto"
                          : "opacity-0 scale-y-95 pointer-events-none hidden"
                      }`}
                    >
                      <div className="flex flex-col space-y-1">
                        {item.dropdown.map((subItem) => {
                          const subActive = pathname === subItem.href;
                          return (
                            <ProtectedLink
                              key={subItem.label}
                              href={subItem.href}
                              user={user}
                              requiresPaid={subItem.requiresPaid}
                              onClick={() => setActiveDropdown(null)}
                              className={`block rounded-lg px-3 py-2 text-xs font-medium transition ${
                                subActive
                                  ? "bg-[#f9eee7] text-[#833b0c] font-bold"
                                  : "text-slate-700 hover:bg-[#f9eee7] hover:text-[#833b0c]"
                              }`}
                            >
                              {subItem.label}
                            </ProtectedLink>
                          );
                        })}
                      </div>
                    </div>
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
                  className={`flex items-center px-2.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#f9eee7] text-[#833b0c] font-bold"
                      : "text-slate-700 hover:text-[#833b0c] hover:bg-stone-50"
                  }`}
                >
                  <span>{item.label}</span>
                </ProtectedLink>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-3 animate-[slideFromRight_0.5s_ease-out]">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div ref={notificationRef} className="relative">
                  <button
                    type="button"
                    aria-label="Notifications"
                    aria-expanded={notificationsOpen}
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative grid size-9 place-items-center rounded-full text-slate-600 transition hover:bg-stone-100 active:scale-95"
                  >
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 size-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-sm rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl transition-all duration-300 animate-[slideFromTop_0.3s_ease-out] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96 sm:max-w-none">
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
                  className="hidden rounded-lg border border-stone-300 px-4 py-2 text-xs font-semibold text-slate-800 transition-all hover:border-[#833b0c] hover:text-[#833b0c] sm:block"
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  className="hidden rounded-lg bg-[#833b0c] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#6f300a] sm:block"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="grid size-9 place-items-center rounded-lg border border-stone-200 text-slate-700 transition hover:bg-stone-50 min-[1101px]:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Sheet Drawer & Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen min-[1101px]:hidden">
          <div 
            className="fixed inset-0 h-screen w-screen bg-black/40 backdrop-blur-xs transition-opacity animate-[fadeIn_0.3s_ease-out]" 
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative ml-auto h-screen w-full max-w-[300px] bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-[slideFromRight_0.3s_ease-out]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#833b0c]">Navigation</span>
                  {user && (
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${user.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                      {user.isPaid ? 'PRO TIER' : 'FREE TIER'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="grid size-8 place-items-center rounded-lg border border-stone-200 text-slate-700 transition hover:bg-stone-50"
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav className="mt-4 flex flex-col space-y-1">
                {finalNavLinks.map((item) => {
                  const labelLower = item.label?.toLowerCase().trim();
                  const hrefLower = item.href?.toLowerCase().trim();

                  const isPublic =
                    labelLower === "home" ||
                    labelLower === "pricing" ||
                    labelLower === "faq & support" ||
                    hrefLower === "/" ||
                    hrefLower === "/#pricing" ||
                    hrefLower?.includes("#pricing") ||
                    hrefLower?.includes("#faq");

                  const isActive = pathname === item.href;

                  if (isPublic) {
                    const targetHref =
                      labelLower === "home" || hrefLower === "/"
                        ? user ? "/dashboard" : "/"
                        : labelLower === "faq & support" || hrefLower?.includes("#faq")
                        ? pathname === "/" || pathname === "/dashboard" ? "#faq" : "/#faq"
                        : user ? "/dashboard#pricing" : "/#pricing";

                    return (
                      <Link
                        key={item.label}
                        href={targetHref}
                        onClick={(e) => handlePublicClick(labelLower, hrefLower ?? "", e)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                          isActive 
                            ? "bg-[#f9eee7] text-[#833b0c]" 
                            : "text-slate-800 hover:bg-[#f9eee7] hover:text-[#833b0c]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {getNavLinkIcon(item.label)}
                          <span>{item.label}</span>
                        </div>
                        {labelLower === "pricing" && (
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[8px] font-extrabold text-emerald-700">
                            PRO
                          </span>
                        )}
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
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => toggleMobileCategory(item.label)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-[#f9eee7] hover:text-[#833b0c]"
                          >
                            <div className="flex items-center gap-2.5">
                              {getNavLinkIcon(item.label)}
                              <span>{item.label}</span>
                            </div>
                            <ChevronDown
                              className={`size-3.5 text-slate-400 transition-transform duration-300 ${
                                isExpanded ? "rotate-180 text-[#833b0c]" : ""
                              }`}
                            />
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="ml-3 space-y-1 border-l-2 border-[#f9eee7] pl-2">
                              {item.dropdown.map((subItem) => {
                                const subActive = pathname === subItem.href;
                                return (
                                  <ProtectedLink
                                    key={subItem.label}
                                    href={subItem.href}
                                    user={user}
                                    requiresPaid={subItem.requiresPaid}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block rounded-lg py-2 px-2 text-xs font-medium transition ${
                                      subActive
                                        ? "bg-[#f9eee7] text-[#833b0c] font-bold"
                                        : "text-slate-600 hover:text-[#833b0c]"
                                    }`}
                                  >
                                    {subItem.label}
                                  </ProtectedLink>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <ProtectedLink
                          href={item.href}
                          user={user}
                          requiresPaid={item.requiresPaid}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                            isActive
                              ? "bg-[#f9eee7] text-[#833b0c]"
                              : "text-slate-800 hover:bg-[#f9eee7] hover:text-[#833b0c]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {getNavLinkIcon(item.label)}
                            <span>{item.label}</span>
                          </div>
                        </ProtectedLink>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-stone-100 space-y-2 pb-6">
              {!user && (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-xl border border-stone-300 py-2.5 text-center text-xs font-semibold text-slate-800 transition hover:border-[#833b0c] hover:text-[#833b0c]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-xl bg-[#833b0c] py-2.5 text-center text-xs font-bold text-white shadow-xs transition hover:bg-[#6f300a]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {user && (
                <div className="space-y-2">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-[#f9eee7]/50 px-3 py-2.5 text-xs font-bold text-[#833b0c] transition hover:bg-[#f9eee7]"
                  >
                    <span>My Profile</span>
                    <Sparkles className="size-3.5" />
                  </Link>

                  <SignOutButton className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromTop {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}