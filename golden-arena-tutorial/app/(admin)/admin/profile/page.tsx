"use client";

import { useState, useEffect } from "react";
import { User, Shield, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminProfilePage() {
  const [displayName, setDisplayName] = useState("System Admin");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [subscriptionPlan, setSubscriptionPlan] = useState("Free Tier");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadProfileAndSubscription = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email ?? "");

          // 1. Fetch profile data safely
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, display_name, role")
            .eq("id", user.id)
            .maybeSingle();

          if (profile) {
            setDisplayName(profile.display_name || profile.name || "System Admin");
            setRole(profile.role ?? "admin");
          }

          // 2. Fetch subscription data safely
          const { data: subscription, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          if (error) {
            console.error("Error fetching subscription:", error.message);
          }

          if (subscription) {
            console.log("Subscription found:", subscription);
            setSubscriptionPlan(subscription.plan || subscription.tier || "Pro Plan");
            setSubscriptionStatus(subscription.status || "active");
          }
        }
      } catch (err) {
        console.error("Failed to load profile/subscription:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProfileAndSubscription();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("profiles")
          .update({ display_name: displayName })
          .eq("id", user.id);

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isPro = subscriptionStatus.toLowerCase() === "active" || subscriptionStatus.toLowerCase() === "pro";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">Admin Profile</h1>
        <p className="text-xs text-slate-500">Manage administrator display details and live subscription status.</p>
      </div>

      <form onSubmit={handleUpdate} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#f9eee7] text-lg font-black text-[#833b0c] border border-[#833b0c]/20">
              {displayName ? displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{displayName}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900 mt-1">
                <Shield className="size-3" /> System Administrator
              </span>
            </div>
          </div>

          {/* Real-time Subscription Badge */}
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Plan Status</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold mt-1 ${
              isPro ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-stone-100 text-stone-700"
            }`}>
              <Sparkles className="size-3 text-[#833b0c]" />
              {isLoaded ? subscriptionPlan : "Loading..."}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Display Name</label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Email Address (Read-Only)</label>
          <input
            type="email"
            disabled
            value={email}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-medium text-slate-500 outline-none cursor-not-allowed"
          />
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : "Save Profile Changes"}
        </button>
      </form>
    </div>
  );
}