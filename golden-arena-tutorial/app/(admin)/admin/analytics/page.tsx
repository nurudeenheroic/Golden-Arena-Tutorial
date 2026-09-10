import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  FileText,
  Lightbulb,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  // 1. Fetch comprehensive metrics in parallel
  const [
    { data: attempts },
    { count: totalCandidates },
    { count: totalQuestions },
    { count: proSubscriptions },
    { count: totalNotes },
    { data: notesTopics },
  ] = await Promise.all([
    supabase.from("quiz_attempts").select("score, total_questions"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("questions").select("*", { count: "exact", head: true }),
    supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("study_notes").select("*", { count: "exact", head: true }),
    supabase.from("study_notes").select("topic"),
  ]);

  const totalAttempts = attempts?.length ?? 0;
  let totalScoreSum = 0;
  let totalQuestionsAttempted = 0;
  let passedAttempts = 0;

  attempts?.forEach((att) => {
    totalScoreSum += att.score || 0;
    totalQuestionsAttempted += att.total_questions || 0;
    if (att.total_questions > 0 && att.score / att.total_questions >= 0.5) {
      passedAttempts++;
    }
  });

  const avgPercentage =
    totalQuestionsAttempted > 0
      ? Math.round((totalScoreSum / totalQuestionsAttempted) * 100)
      : 0;

  const passRate =
    totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  const proRatio =
    totalCandidates && totalCandidates > 0
      ? Math.round(((proSubscriptions ?? 0) / totalCandidates) * 100)
      : 0;

  const uniqueNoteTopics = new Set(
    (notesTopics || [])
      .map((n) => n.topic)
      .filter((t): t is string => Boolean(t && t.trim() !== ""))
  ).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Platform Analytics</h1>
        <p className="text-xs text-slate-500">
          Global performance benchmarks, candidate score distributions, and system metrics.
        </p>
      </div>

      {/* Primary Analytics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Drills Taken */}
        <Link
          href="/admin/analytics/drills-taken"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-[#833b0c]/50 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Drills Taken</span>
            <BookOpen className="size-4 text-[#833b0c] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalAttempts}</p>
          <p className="text-[10px] text-[#833b0c] font-bold flex items-center gap-1 group-hover:underline">
            <span>View drill breakdown</span>
            <ArrowRight className="size-3" />
          </p>
        </Link>

        {/* Average Score */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Score</span>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{avgPercentage}%</p>
          <p className="text-[10px] text-slate-400 font-medium">Across all completed attempts</p>
        </div>

        {/* Overall Pass Rate */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Overall Pass Rate</span>
            <Award className="size-4 text-[#833b0c]" />
          </div>
          <p className="text-2xl font-black text-slate-900">{passRate}%</p>
          <p className="text-[10px] text-slate-400 font-medium">Score &ge; 50% threshold</p>
        </div>

        {/* Question Bank Coverage */}
        <Link
          href="/admin/questions"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-blue-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bank Coverage</span>
            <HelpCircle className="size-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalQuestions ?? 0}</p>
          <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1 group-hover:underline">
            <span>Explore question bank</span>
            <ArrowRight className="size-3" />
          </p>
        </Link>
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Candidates */}
        <Link
          href="/admin/users"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-stone-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Candidates</span>
            <Users className="size-4 text-slate-700 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalCandidates ?? 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Registered student accounts</p>
        </Link>

        {/* Pro Subscription Conversion */}
        <Link
          href="/admin/subscriptions"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pro Candidates</span>
            <Sparkles className="size-4 text-emerald-600 fill-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{proSubscriptions ?? 0}</p>
          <p className="text-[10px] text-emerald-700 font-medium">{proRatio}% conversion rate</p>
        </Link>

        {/* Answered Questions Volume */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Answers Scored</span>
            <Layers className="size-4 text-amber-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalQuestionsAttempted}</p>
          <p className="text-[10px] text-slate-400 font-medium">Responses processed</p>
        </div>

        {/* Updated Study Notes & Mnemonics Card (Stone / Brand Theme) */}
        <Link
          href="/admin/notes"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-[#833b0c]/40 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">Study Notes & Mnemonics</span>
            <div className="flex items-center gap-1.5 text-[#833b0c]">
              <FileText className="size-4 group-hover:scale-110 transition-transform" />
              <Lightbulb className="size-3.5 fill-[#833b0c]" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalNotes ?? 0}</p>
          <p className="text-[10px] text-[#833b0c] font-bold flex items-center gap-1 group-hover:underline">
            <span>{uniqueNoteTopics} topics with study guides</span>
            <ArrowRight className="size-3" />
          </p>
        </Link>
      </div>

      {/* UTME Preparedness Summary */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">UTME Candidate Preparedness Summary</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Candidates have completed a combined total of <strong>{totalAttempts}</strong> exam sessions with a general average score of <strong>{avgPercentage}%</strong> across <strong>{totalQuestionsAttempted}</strong> answered question items. Continue uploading detailed step-by-step explanations and mnemonics to push overall candidate accuracy beyond the 70% threshold.
        </p>
      </div>
    </div>
  );
}