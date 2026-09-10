"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Save,
  RefreshCw,
  Loader2,
  Check,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = use(params);

  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Data states
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [leaderboardRank, setLeaderboardRank] = useState("N/A");
  const [overallAccuracy, setOverallAccuracy] = useState(0);

  // Form states for in-line edits
  const [editName, setEditName] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("candidate");

  const loadAllUserData = async () => {
    setLoading(true);
    const supabase = createClient();

    // 1. Fetch Profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (prof) {
      setProfile(prof);
      setEditName(prof.name || "");
      setEditDisplayName(prof.display_name || "");
      setEditEmail(prof.email || "");
      setEditRole(prof.role || "candidate");
    }

    // 2. Fetch Subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    setSubscription(sub);

    // 3. Fetch Quiz Attempts (including quiz_id for linking)
    const { data: atts } = await supabase
      .from("quiz_attempts")
      .select(`
        id,
        quiz_id,
        score,
        total_questions,
        time_taken_sec,
        created_at,
        quizzes ( title )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setAttempts(atts || []);

    // 4. Compute Leaderboard Position across all users
    const { data: allAtts } = await supabase
      .from("quiz_attempts")
      .select("user_id, score, total_questions");

    if (allAtts && allAtts.length > 0) {
      const userScores: Record<string, { score: number; total: number }> = {};
      allAtts.forEach((a) => {
        if (!userScores[a.user_id]) userScores[a.user_id] = { score: 0, total: 0 };
        userScores[a.user_id].score += a.score || 0;
        userScores[a.user_id].total += a.total_questions || 1;
      });

      const ranked = Object.entries(userScores)
        .map(([uid, stats]) => ({
          uid,
          accuracy: Math.round((stats.score / stats.total) * 100),
        }))
        .sort((a, b) => b.accuracy - a.accuracy);

      const pos = ranked.findIndex((r) => r.uid === userId);
      if (pos !== -1) {
        setLeaderboardRank(`#${pos + 1} of ${ranked.length}`);
        setOverallAccuracy(ranked[pos].accuracy);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAllUserData();
  }, [userId]);

  // Save specific in-line profile field
  const handleSaveProfileField = async (fieldName: string, payload: object) => {
    setSavingField(fieldName);
    const supabase = createClient();

    const { error } = await supabase.from("profiles").update(payload).eq("id", userId);

    if (error) {
      alert(`Failed to save ${fieldName}: ${error.message}`);
    } else {
      setSavedSuccess(fieldName);
      setTimeout(() => setSavedSuccess(null), 2000);
      loadAllUserData();
    }
    setSavingField(null);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin text-[#833b0c]" />
        <span>Loading candidate account metrics...</span>
      </div>
    );
  }

  const isExpired = subscription?.end_date && new Date(subscription.end_date) < new Date();
  const isActive = subscription?.status === "active" && !isExpired;
  const candidateName = profile?.name || profile?.display_name || "Candidate";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Accounts</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAllUserData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <RefreshCw className="size-3.5 text-[#833b0c]" />
            <span>Refresh Data</span>
          </button>

          <Link
            href={`/admin/subscriptions/${userId}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#6e310a] transition cursor-pointer"
          >
            <CreditCard className="size-3.5" />
            <span>Manage Subscription Plan</span>
          </Link>
        </div>
      </div>

      {/* Overview Card */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#f9eee7] text-xl font-black text-[#833b0c] border border-[#833b0c]/20">
              {candidateName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">{candidateName}</h1>
              <p className="text-xs text-slate-400 font-mono">{profile?.email}</p>
            </div>
          </div>

          <div>
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="size-4" /> Active Access / Pro Plan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                <ShieldAlert className="size-4" /> Inactive / Free Tier Plan
              </span>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold uppercase">
              <Trophy className="size-3.5 text-amber-600" />
              <span>Leaderboard Rank</span>
            </div>
            <p className="text-xl font-black text-amber-950">{leaderboardRank}</p>
            <p className="text-[10px] text-amber-700 font-medium">Overall Accuracy: {overallAccuracy}%</p>
          </div>

          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-1">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Status</span>
            <p className="text-sm font-black text-slate-900 capitalize">{subscription?.status || "inactive"}</p>
          </div>

          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-1">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Plan</span>
            <p className="text-sm font-black text-slate-900 uppercase">{subscription?.plan || "free"}</p>
          </div>

          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
              <Calendar className="size-3 text-slate-400" />
              <span>Expiration Date</span>
            </div>
            <p className="text-sm font-black text-slate-900">
              {subscription?.end_date
                ? new Date(subscription.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No Expiration"}
            </p>
          </div>
        </div>
      </div>

      {/* Editable Account Profile Section */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          In-Line Editable Profile Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Full Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#833b0c]"
              />
              <button
                type="button"
                onClick={() => handleSaveProfileField("name", { name: editName })}
                disabled={savingField === "name"}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                {savingField === "name" ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : savedSuccess === "name" ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Save className="size-3" />
                )}
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Display Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#833b0c]"
              />
              <button
                type="button"
                onClick={() => handleSaveProfileField("display_name", { display_name: editDisplayName })}
                disabled={savingField === "display_name"}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                {savingField === "display_name" ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : savedSuccess === "display_name" ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Save className="size-3" />
                )}
              </button>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Email Address</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#833b0c]"
              />
              <button
                type="button"
                onClick={() => handleSaveProfileField("email", { email: editEmail })}
                disabled={savingField === "email"}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                {savingField === "email" ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : savedSuccess === "email" ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Save className="size-3" />
                )}
              </button>
            </div>
          </div>

          {/* Account Role */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Account Role</label>
            <div className="flex gap-2">
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#833b0c]"
              >
                <option value="candidate">Candidate</option>
                <option value="admin">Administrator</option>
              </select>
              <button
                type="button"
                onClick={() => handleSaveProfileField("role", { role: editRole })}
                disabled={savingField === "role"}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                {savingField === "role" ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : savedSuccess === "role" ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Save className="size-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Attempt History */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-slate-900">Quiz & Mock Exam Attempts</h2>
        <div className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50 text-[10px] font-black uppercase text-slate-400">
                <th className="p-4 pl-6">Quiz Title</th>
                <th className="p-4">Score</th>
                <th className="p-4">Accuracy</th>
                <th className="p-4 pr-6 text-right">Date Attempted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400 font-medium">
                    No quiz attempts recorded for this candidate yet.
                  </td>
                </tr>
              ) : (
                attempts.map((att: any) => {
                  const pct = Math.round((att.score / (att.total_questions || 1)) * 100);
                  const quizTitle = att.quizzes?.title || "Standard Quiz";

                  return (
                    <tr key={att.id} className="hover:bg-stone-50 transition">
                      <td className="p-4 pl-6">
                        {att.quiz_id ? (
                          <Link
                            href={`/admin/quizzes/${att.quiz_id}`}
                            className="group inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-[#833b0c] transition"
                          >
                            <span className="group-hover:underline">{quizTitle}</span>
                            <ExternalLink className="size-3 text-slate-400 group-hover:text-[#833b0c] transition" />
                          </Link>
                        ) : (
                          <span className="font-bold text-slate-900">{quizTitle}</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {att.score} / {att.total_questions}
                      </td>
                      <td className="p-4 font-black text-emerald-700">{pct}%</td>
                      <td className="p-4 pr-6 text-right text-slate-400">
                        {att.created_at ? new Date(att.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}