"use client";

import { useState, useTransition, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function AdminSubscriptionEditPage({ params }: PageProps) {
  const { userId } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; display_name?: string; email?: string } | null>(null);

  // Form State
  const [accessStatus, setAccessStatus] = useState<"active" | "inactive">("active");
  const [planType, setPlanType] = useState<"1_month" | "2_months" | "annual" | "lifetime">("1_month");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch initial user & subscription state from Supabase
  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: prof } = await supabase
      .from("profiles")
      .select("id, name, display_name, email")
      .eq("id", userId)
      .single();

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (prof) setProfile(prof);

    if (sub) {
      setAccessStatus(sub.status === "active" ? "active" : "inactive");
      setPlanType((sub.plan as any) || "1_month");
      if (sub.end_date) {
        setEndDate(new Date(sub.end_date).toISOString().split("T")[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  // Auto-calculate expiration date based on selected Plan Type
  useEffect(() => {
    if (accessStatus === "inactive") {
      setEndDate("");
      return;
    }

    const now = new Date();
    if (planType === "1_month") {
      now.setMonth(now.getMonth() + 1);
      setEndDate(now.toISOString().split("T")[0]);
    } else if (planType === "2_months") {
      now.setMonth(now.getMonth() + 2);
      setEndDate(now.toISOString().split("T")[0]);
    } else if (planType === "annual") {
      now.setFullYear(now.getFullYear() + 1);
      setEndDate(now.toISOString().split("T")[0]);
    } else if (planType === "lifetime") {
      setEndDate("");
    }
  }, [accessStatus, planType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const supabase = createClient();

      const computedStatus = accessStatus;
      const computedPlan = accessStatus === "inactive" ? "free" : planType;
      const computedEndDate =
        accessStatus === "inactive" || planType === "lifetime" || !endDate
          ? null
          : new Date(endDate).toISOString();

      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          status: computedStatus,
          plan: computedPlan,
          end_date: computedEndDate,
        },
        { onConflict: "user_id" }
      );

      if (error) {
        alert(`Failed to save subscription: ${error.message}`);
        return;
      }

      router.refresh();
      router.push("/admin/subscriptions");
    });
  };

  const displayName = profile?.name || profile?.display_name || "User";

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin text-[#833b0c]" />
        <span>Loading subscription records...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/subscriptions"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="size-4" />
          <span>Return to Subscriptions</span>
        </Link>

        <button
          type="button"
          onClick={fetchData}
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100 transition cursor-pointer"
        >
          <RefreshCw className="size-3 text-[#833b0c]" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-stone-100 pb-4">
          <h1 className="text-xl font-black text-slate-900">
            Edit Subscription Plan ({displayName})
          </h1>
          <p className="text-xs text-slate-400 font-mono">{profile?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* 1. ACCESS STATUS */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Access Status</label>
            <select
              value={accessStatus}
              onChange={(e) => setAccessStatus(e.target.value as "active" | "inactive")}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#833b0c]"
            >
              <option value="active">Active Access / Pro Plan</option>
              <option value="inactive">Inactive / Free Tier Plan</option>
            </select>
          </div>

          {/* 2. PLAN TYPE */}
          <div className="space-y-1.5">
            <label
              className={`block font-bold ${
                accessStatus === "inactive" ? "text-slate-400" : "text-slate-700"
              }`}
            >
              Plan Type
            </label>
            <select
              disabled={accessStatus === "inactive"}
              value={planType}
              onChange={(e) => setPlanType(e.target.value as any)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#833b0c] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="1_month">1 Month Access (+1 Month)</option>
              <option value="2_months">2 Months Access (+2 Months)</option>
              <option value="annual">Annual Plan (+1 Year)</option>
              <option value="lifetime">Full Lifetime Access (Forever)</option>
            </select>
          </div>

          {/* 3. EXPIRATION DATE */}
          <div className="space-y-1.5">
            <label
              className={`block font-bold ${
                accessStatus === "inactive" || planType === "lifetime"
                  ? "text-slate-400"
                  : "text-slate-700"
              }`}
            >
              Expiration Date
            </label>
            <input
              type="date"
              disabled={accessStatus === "inactive" || planType === "lifetime"}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#833b0c] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400">
              {accessStatus === "inactive"
                ? "Selecting Inactive / Free Tier Plan disables expiration controls."
                : planType === "lifetime"
                ? "Full Lifetime Access never expires."
                : "Automatically updated based on your Plan Type selection."}
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white hover:bg-[#6e310a] transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>{isPending ? "Syncing..." : "Save & Synchronize Subscription"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}