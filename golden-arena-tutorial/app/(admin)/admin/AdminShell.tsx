"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookMarked,
  HelpCircle,
  BookOpen,
  BarChart3,
  PieChart,
  CreditCard,
  Settings,
  Menu,
  X,
  GraduationCap,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Trophy,
  Trash2,
  AlertCircle,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AdminShellProps = {
  adminUser: {
    id: string;
    name: string;
    email: string;
  };
  children: React.ReactNode;
};

const NAV_GROUPS = [
  {
    label: "Platform",
    links: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Users & Accounts", href: "/admin/users", icon: Users },
      { label: "Subjects & Tracks", href: "/admin/subjects", icon: BookMarked },
      { label: "Question Bank", href: "/admin/questions", icon: HelpCircle },
      { label: "Quizzes & Exams", href: "/admin/quizzes", icon: BookOpen },
      { label: "Study Notes & Mnemonics", href: "/admin/notes", icon: BookOpen },
      { label: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
    ],
  },
  {
    label: "System",
    links: [
      { label: "Exam Results", href: "/admin/results", icon: BarChart3 },
      { label: "Analytics", href: "/admin/analytics", icon: PieChart },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { label: "System Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const ADMIN_NAV_LINKS = NAV_GROUPS.flatMap((g) => g.links);

function getPageTitle(pathname: string): string {
  const match = ADMIN_NAV_LINKS.find((l) =>
    l.href === "/admin/dashboard"
      ? pathname === "/admin/dashboard"
      : pathname.startsWith(l.href)
  );
  return match?.label ?? "Admin Console";
}

export default function AdminShell({ adminUser, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([
    {
      id: "1",
      title: "New Pro Subscription",
      desc: "Candidate upgraded to Pro UTME plan.",
      time: "10m ago",
      read: false,
    },
    {
      id: "2",
      title: "Quiz Completion",
      desc: "50+ candidates completed Physics Drill #2.",
      time: "1h ago",
      read: false,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.replace("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "WARNING: Are you sure you want to delete your administrator account? This action is permanent and cannot be undone."
    );

    if (!confirmed) return;

    const supabase = createClient();
    
    // Delete profile record and sign out
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", adminUser.id);

    if (error) {
      alert(`Failed to delete account: ${error.message}`);
    } else {
      await supabase.auth.signOut();
      window.location.replace("/login");
    }
  };

  const markAllNotificationsRead = () => {
    setUnreadNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const activeNotifCount = unreadNotifications.filter((n) => !n.read).length;

  const isLinkActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === "/admin/dashboard"
      : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-stone-50/60 text-slate-900 flex flex-col md:flex-row">
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-stone-200 bg-white shrink-0 h-screen sticky top-0">
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-2 py-1">
            <div className="grid size-9 place-items-center rounded-xl bg-[#833b0c] text-white shadow-sm shrink-0">
              <GraduationCap className="size-5" />
            </div>
            <div className="leading-none">
              <span className="block text-sm font-bold tracking-tight text-slate-900">
                GAT Admin
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide">
                Control Panel
              </span>
            </div>
          </Link>

          <nav className="space-y-5">
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label}>
                {gi > 0 && <hr className="mb-4 border-stone-100" />}
                <p className="mb-1 px-3.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const active = isLinkActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs transition-colors duration-150 ${
                          active
                            ? "bg-[#f9eee7] text-[#833b0c] font-semibold"
                            : "text-slate-500 font-medium hover:bg-stone-50 hover:text-slate-800"
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 inset-y-2 w-0.5 rounded-full bg-[#833b0c]" />
                        )}
                        <Icon className="size-4 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Admin identity strip */}
        <div className="p-4 border-t border-stone-100 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-stone-50 transition-colors duration-150">
            <div className="grid size-8 place-items-center rounded-full bg-[#f9eee7] text-xs font-black text-[#833b0c] border border-[#833b0c]/20 shrink-0">
              {adminUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{adminUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{adminUser.email}</p>
            </div>
            <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100">
              Admin
            </span>
          </div>
        </div>
      </aside>

      {/* 2. TABLET COLLAPSED ICON RAIL */}
      <aside className="hidden md:flex lg:hidden w-14 flex-col items-center border-r border-stone-200 bg-white shrink-0 h-screen sticky top-0 py-4">
        <Link
          href="/admin/dashboard"
          title="GAT Admin — Dashboard"
          className="mb-5 grid size-9 place-items-center rounded-xl bg-[#833b0c] text-white shadow-sm shrink-0"
        >
          <GraduationCap className="size-4" />
        </Link>

        <nav className="flex-1 flex flex-col items-center gap-0.5 w-full px-2 overflow-y-auto">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`relative grid w-full place-items-center rounded-xl py-2.5 transition-colors duration-150 ${
                  active
                    ? "bg-[#f9eee7] text-[#833b0c]"
                    : "text-slate-400 hover:bg-stone-50 hover:text-slate-700"
                }`}
              >
                {active && (
                  <span className="absolute left-0 inset-y-2 w-0.5 rounded-full bg-[#833b0c]" />
                )}
                <Icon className="size-4" />
              </Link>
            );
          })}
        </nav>

        <div
          title={adminUser.name}
          className="mt-3 grid size-8 place-items-center rounded-full bg-[#f9eee7] text-xs font-black text-[#833b0c] border border-[#833b0c]/20 shrink-0"
        >
          {adminUser.name.charAt(0).toUpperCase()}
        </div>
      </aside>

      {/* 3. MOBILE SLIDE-OVER DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
          />

          <aside className="fixed inset-y-0 left-0 w-[270px] bg-white flex flex-col justify-between z-50 shadow-2xl animate-in slide-in-from-left duration-150">
            <div className="p-5 space-y-5 overflow-y-auto flex-1">
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="grid size-8 place-items-center rounded-xl bg-[#833b0c] text-white shrink-0">
                    <GraduationCap className="size-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">GAT Admin</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="grid size-8 place-items-center rounded-lg border border-stone-200 text-slate-500 hover:bg-stone-50 transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav className="space-y-4">
                {NAV_GROUPS.map((group, gi) => (
                  <div key={group.label}>
                    {gi > 0 && <hr className="mb-3 border-stone-100" />}
                    <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.links.map((link) => {
                        const Icon = link.icon;
                        const active = isLinkActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileDrawerOpen(false)}
                            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors duration-150 ${
                              active
                                ? "bg-[#f9eee7] text-[#833b0c] font-semibold"
                                : "text-slate-500 font-medium hover:bg-stone-50 hover:text-slate-800"
                            }`}
                          >
                            {active && (
                              <span className="absolute left-0 inset-y-2 w-0.5 rounded-full bg-[#833b0c]" />
                            )}
                            <Icon className="size-4 shrink-0" />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-stone-100 shrink-0">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-stone-200 transition cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 4. MAIN CONTENT STAGE & TOP NAVIGATION BAR */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-stone-200 bg-white/95 backdrop-blur-sm px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-stone-200 text-slate-700 hover:bg-stone-50 transition md:hidden cursor-pointer"
            >
              <Menu className="size-4" />
            </button>

            {/* Dynamic page title */}
            <span className="text-sm font-semibold text-slate-800">
              {getPageTitle(pathname)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* NOTIFICATION BELL */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative grid size-9 place-items-center rounded-xl border border-stone-200 text-slate-600 hover:bg-stone-50 transition-colors duration-150 cursor-pointer"
              >
                <Bell className="size-4" />
                {activeNotifCount > 0 && (
                  <span className="absolute top-2 right-2 size-1.5 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl z-50 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <span className="text-xs font-semibold text-slate-900">
                      Alerts
                      {activeNotifCount > 0 && (
                        <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          {activeNotifCount}
                        </span>
                      )}
                    </span>
                    {activeNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-semibold text-[#833b0c] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {unreadNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`relative pl-3.5 pr-2.5 py-2.5 rounded-xl text-xs space-y-0.5 ${
                          n.read
                            ? "bg-stone-50 text-slate-500"
                            : "bg-[#f9eee7]/40 text-slate-900"
                        }`}
                      >
                        {!n.read && (
                          <span className="absolute left-0 inset-y-2 w-0.5 rounded-full bg-[#833b0c]" />
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-semibold truncate ${n.read ? "text-slate-500" : "text-slate-900"}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-stone-200 p-1.5 pl-2 hover:bg-stone-50 transition-colors duration-150 cursor-pointer"
              >
                <div className="grid size-7 place-items-center rounded-full bg-[#f9eee7] text-[10px] font-black text-[#833b0c] border border-[#833b0c]/20 shrink-0">
                  {adminUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block leading-none pr-0.5">
                  <span className="block text-xs font-semibold text-slate-900">
                    {adminUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400">Admin</span>
                </div>
                <ChevronDown className="size-3 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-0.5">
                  {/* Header with avatar */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-stone-100 mb-1">
                    <div className="grid size-8 place-items-center rounded-full bg-[#f9eee7] text-xs font-black text-[#833b0c] border border-[#833b0c]/20 shrink-0">
                      {adminUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{adminUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{adminUser.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#f9eee7] hover:text-[#833b0c] transition-colors duration-150"
                  >
                    <User className="size-3.5" />
                    <span>Admin Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-stone-100 transition-colors duration-150 cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>

                  <div className="pt-1 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}