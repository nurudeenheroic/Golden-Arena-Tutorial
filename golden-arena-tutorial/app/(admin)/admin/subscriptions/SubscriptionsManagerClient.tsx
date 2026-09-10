"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Search,
  UserPlus,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SubItem {
  id: string;
  userId: string;
  candidateName: string;
  candidateEmail: string;
  planType: string;
  amount: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
  currentPlanStatus: string;
  requestType: string;
}

interface CandidateProfile {
  id: string;
  name?: string;
  display_name?: string;
  email?: string;
}

export default function SubscriptionsManagerClient({
  initialRequests,
  candidates,
}: {
  initialRequests: SubItem[];
  candidates: CandidateProfile[];
}) {
  const [items, setItems] = useState<SubItem[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [durationMonths, setDurationMonths] = useState(12);
  const [granting, setGranting] = useState(false);

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch =
      item.candidateName.toLowerCase().includes(query) ||
      item.candidateEmail.toLowerCase().includes(query) ||
      item.planType.toLowerCase().includes(query);

    let matchesStatus = true;
    if (statusFilter === "active_pro") {
      matchesStatus = item.currentPlanStatus === "pro";
    } else if (statusFilter === "free") {
      matchesStatus = item.currentPlanStatus === "free";
    } else if (statusFilter === "pending") {
      matchesStatus = item.status === "pending";
    } else if (statusFilter !== "all") {
      matchesStatus = item.status.toLowerCase() === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  // Approve Payment Request & Insert into Subscriptions Table
  const handleApprove = async (item: SubItem) => {
    setLoadingId(item.id);
    const supabase = createClient();
    const startIso = new Date().toISOString();
    
    const endDateObj = new Date();
    endDateObj.setFullYear(endDateObj.getFullYear() + 1); // +1 Year Pro Access
    const endIso = endDateObj.toISOString();

    // 1. Update subscription_request status
    await supabase
      .from("subscription_requests")
      .update({ status: "approved", confirmed_at: startIso })
      .eq("id", item.id);

    // 2. Insert active row into subscriptions table
    const { error: subErr } = await supabase.from("subscriptions").insert({
      user_id: item.userId,
      status: "active",
      plan: item.planType || "pro_annual",
      start_date: startIso,
      end_date: endIso,
    });

    if (subErr) {
      alert(`Error activating subscription: ${subErr.message}`);
    } else {
      alert("Subscription approved and activated successfully!");
      window.location.reload();
    }
    setLoadingId(null);
  };

  // Reject Request
  const handleReject = async (itemId: string) => {
    if (!confirm("Reject this subscription request?")) return;
    setLoadingId(itemId);
    const supabase = createClient();

    const { error } = await supabase
      .from("subscription_requests")
      .update({ status: "rejected" })
      .eq("id", itemId);

    if (error) alert(`Error: ${error.message}`);
    else {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: "rejected" } : i))
      );
    }
    setLoadingId(null);
  };

  // Manual Grant: Inserts active row directly into subscriptions table
  const handleManualGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setGranting(true);
    const supabase = createClient();
    const startIso = new Date().toISOString();

    const endDateObj = new Date();
    endDateObj.setMonth(endDateObj.getMonth() + Number(durationMonths));
    const endIso = endDateObj.toISOString();

    const { error } = await supabase.from("subscriptions").insert({
      user_id: selectedUserId,
      status: "active",
      plan: "manual_pro_grant",
      start_date: startIso,
      end_date: endIso,
    });

    if (error) {
      alert(`Grant error: ${error.message}`);
    } else {
      alert("Pro access granted successfully!");
      window.location.reload();
    }
    setGranting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="size-5 text-[#833b0c]" />
            <span>Subscription & Plan Management</span>
          </h1>
          <p className="text-xs text-slate-500">
            Monitor active Pro members, audit payment requests, or grant manual extensions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGrantModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition cursor-pointer"
        >
          <UserPlus className="size-4" />
          <span>Grant Manual Pro Access</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate or email..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-3 py-1.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: "all", label: "All" },
              { id: "active_pro", label: "Active Pro" },
              { id: "free", label: "Free Tier" },
              { id: "pending", label: "Pending Requests" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
                  statusFilter === st.id
                    ? "bg-[#833b0c] text-white"
                    : "bg-stone-50 text-slate-600 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-100 bg-stone-50/50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Plan / Type</th>
                <th className="px-6 py-4">Current Plan</th>
                <th className="px-6 py-4">Expires On</th>
                <th className="px-6 py-4">Request Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-slate-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${item.userId}`}
                        className="group/cand inline-flex items-center gap-1 font-bold text-slate-900 hover:text-[#833b0c] transition"
                      >
                        <div>
                          <span className="block font-black group-hover/cand:underline">
                            {item.candidateName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {item.candidateEmail}
                          </span>
                        </div>
                        <ExternalLink className="size-3 text-slate-300 group-hover/cand:text-[#833b0c] transition ml-1" />
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase">
                        {item.planType.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {item.currentPlanStatus === "pro" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
                          <Sparkles className="size-3 text-amber-600" /> Active Pro
                        </span>
                      ) : (
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                          Free Tier
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                          item.status === "approved" || item.status === "active"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : item.status === "pending"
                            ? "bg-amber-50 text-amber-900 border-amber-200"
                            : "bg-stone-100 text-slate-600 border-stone-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {item.status === "pending" ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(item)}
                            disabled={loadingId === item.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50 cursor-pointer"
                          >
                            {loadingId === item.id ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(item.id)}
                            disabled={loadingId === item.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                          >
                            <XCircle className="size-3 text-rose-600" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.currentPlanStatus === "pro" ? "Active Subscription" : "Free Member"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    <AlertCircle className="mx-auto size-8 text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No candidates found under this filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRANT MANUAL PRO MODAL */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleManualGrant}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Grant Pro Access Manually
              </h3>
              <button
                type="button"
                onClick={() => setShowGrantModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Candidate *</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
                >
                  <option value="">Select student account...</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.display_name || c.name || "Candidate"} ({c.email || "No email"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Duration *</label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
                >
                  <option value={1}>1 Month Extension</option>
                  <option value={3}>3 Months Extension</option>
                  <option value={6}>6 Months Extension</option>
                  <option value={12}>1 Year Full Access</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={granting}
              className="w-full rounded-2xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {granting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              <span>{granting ? "Processing..." : "Activate Pro Subscription"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}