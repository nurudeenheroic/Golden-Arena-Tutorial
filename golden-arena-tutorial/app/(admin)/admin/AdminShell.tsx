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
  ShieldCheck,
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

const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users & Accounts", href: "/admin/users", icon: Users },
  { label: "Subjects & Tracks", href: "/admin/subjects", icon: BookMarked },
  { label: "Question Bank", href: "/admin/questions", icon: HelpCircle },
  { label: "Quizzes & Exams", href: "/admin/quizzes", icon: BookOpen },
  { label: "Study Notes & Mnemonics", href: "/admin/notes", icon: BookOpen },
  { label: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
  { label: "Exam Results", href: "/admin/results", icon: BarChart3 },
  { label: "Analytics", href: "/admin/analytics", icon: PieChart },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "System Settings", href: "/admin/settings", icon: Settings },
];

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

  return (
    <div className="min-h-screen bg-stone-50/60 text-slate-900 flex flex-col lg:flex-row">
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-stone-200 bg-white p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-2">
            <div className="grid size-10 place-items-center rounded-xl bg-[#833b0c] text-white shadow-xs">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <span className="block text-lg font-black tracking-tight text-[#833b0c] leading-none">
                GAT Admin
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800">
                Control Panel
              </span>
            </div>
          </Link>

          <nav className="space-y-1">
            {ADMIN_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                    isActive
                      ? "bg-[#833b0c] text-white shadow-2xs"
                      : "text-slate-600 hover:bg-[#f9eee7] hover:text-[#833b0c]"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-stone-100 pt-4 px-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Secure Admin Portal</span>
          </div>
        </div>
      </aside>

      {/* 2. TABLET / MOBILE SLIDE-OVER DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          <aside className="fixed inset-y-0 left-0 w-72 bg-white p-5 shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-[#833b0c] text-white">
                    <GraduationCap className="size-5" />
                  </div>
                  <span className="text-base font-black text-[#833b0c]">GAT Admin</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="grid size-8 place-items-center rounded-lg border border-stone-200 text-slate-500 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                {ADMIN_NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === "/admin/dashboard"
                      ? pathname === "/admin/dashboard"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                        isActive
                          ? "bg-[#833b0c] text-white shadow-2xs"
                          : "text-slate-600 hover:bg-[#f9eee7] hover:text-[#833b0c]"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Sign Out Account</span>
            </button>
          </aside>
        </div>
      )}

      {/* 3. MAIN CONTENT STAGE & TOP NAVIGATION BAR */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-stone-200 bg-white/95 backdrop-blur px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-stone-200 text-slate-700 hover:bg-stone-50 lg:hidden cursor-pointer"
            >
              <Menu className="size-5" />
            </button>

            <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
              Administrator Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* NOTIFICATION BELL DROPDOWN */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="grid size-9 place-items-center rounded-full text-slate-600 hover:bg-stone-100 transition relative cursor-pointer"
              >
                <Bell className="size-4" />
                {activeNotifCount > 0 && (
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-amber-600 ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl z-50 space-y-3 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-black text-slate-900 uppercase">
                      Admin Alerts ({activeNotifCount})
                    </span>
                    {activeNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-bold text-[#833b0c] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {unreadNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                          n.read
                            ? "bg-stone-50 border-stone-200 text-slate-500"
                            : "bg-[#f9eee7]/50 border-[#833b0c]/20 text-slate-900 font-medium"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE DROPDOWN WRAPPER */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full p-1 pl-2 hover:bg-stone-100 transition cursor-pointer"
              >
                <div className="grid size-8 place-items-center rounded-full bg-[#f9eee7] text-xs font-black text-[#833b0c] border border-[#833b0c]/20">
                  {adminUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block leading-none">
                  <span className="block text-xs font-bold text-slate-900">
                    {adminUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400">Admin</span>
                </div>
                <ChevronDown className="size-3.5 text-slate-500" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 space-y-1">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {adminUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {adminUser.email}
                    </p>
                  </div>

                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#f9eee7] hover:text-[#833b0c] transition"
                  >
                    <User className="size-3.5" />
                    <span>Admin Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-100 transition cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>

                  <div className="pt-1 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
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

        <main className="p-5 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}