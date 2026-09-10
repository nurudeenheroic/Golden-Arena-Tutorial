"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Shield,
  User,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  isPaid: boolean;
  createdAt: string;
};

export default function UserListClient({ users }: { users: UserItem[] }) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState(users);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Manual Pro Tier Toggle
  const toggleProAccess = async (user: UserItem) => {
    setLoadingId(user.id);
    const supabase = createClient();

    if (user.isPaid) {
      // Revoke Pro Access
      await supabase.from("subscriptions").delete().eq("user_id", user.id);
    } else {
      // Grant 1-Year Pro Access
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          plan: "pro",
          status: "active",
          end_date: nextYear.toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    setUserList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isPaid: !u.isPaid } : u))
    );
    setLoadingId(null);
  };

  // Re-sync server state
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const filtered = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Candidate Accounts</h1>
          <p className="text-xs text-slate-500">
            Manage student access levels and toggle manual Pro tier subscriptions.
          </p>
        </div>

        {/* Action Controls: Refresh + Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`size-3.5 text-[#833b0c] ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-100 bg-stone-50/50 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Subscription Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No candidate accounts match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50 transition">
                    {/* Candidate Name Hyperlink */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="group inline-block cursor-pointer"
                      >
                        <p className="font-bold text-slate-900 group-hover:text-[#833b0c] group-hover:underline inline-flex items-center gap-1">
                          {u.name}
                          <ExternalLink className="size-3 text-slate-400 group-hover:text-[#833b0c] opacity-0 group-hover:opacity-100 transition" />
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      </Link>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900">
                          <Shield className="size-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                          <User className="size-3" /> Student
                        </span>
                      )}
                    </td>

                    {/* Subscription Status */}
                    <td className="px-6 py-4">
                      {u.isPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                          <Sparkles className="size-3 fill-emerald-600 text-emerald-600" /> Pro Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
                          Free Tier
                        </span>
                      )}
                    </td>

                    {/* Pro Toggle Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        disabled={loadingId === u.id || u.role === "admin"}
                        onClick={() => toggleProAccess(u)}
                        className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-[#833b0c] hover:text-[#833b0c] transition disabled:opacity-40 cursor-pointer"
                      >
                        {loadingId === u.id ? (
                          <Loader2 className="size-3.5 animate-spin mx-auto" />
                        ) : u.isPaid ? (
                          "Revoke Pro"
                        ) : (
                          "Grant Pro"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}