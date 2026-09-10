import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  HelpCircle,
  BookOpen,
  CreditCard,
  Plus,
  Upload,
  Sparkles,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch system metrics in parallel
  const [
    { count: totalUsers },
    { count: totalQuestions },
    { count: totalQuizzes },
    { count: activeSubscriptions },
    { data: attempts },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("questions").select("*", { count: "exact", head: true }),
    supabase.from("quizzes").select("*", { count: "exact", head: true }),
    supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("quiz_attempts")
      .select(`
        id,
        user_id,
        quiz_id,
        score,
        total_questions,
        time_taken_sec,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // 2. Resolve candidate profiles and quiz titles separately to prevent PostgREST join failures
  const userIds = Array.from(new Set((attempts || []).map((a) => a.user_id).filter(Boolean)));
  const quizIds = Array.from(new Set((attempts || []).map((a) => a.quiz_id).filter(Boolean)));

  let profilesMap = new Map<string, { name?: string; display_name?: string; email?: string }>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, display_name, email")
      .in("id", userIds);

    if (profiles) {
      profiles.forEach((p) => profilesMap.set(p.id, p));
    }
  }

  let quizzesMap = new Map<string, string>();
  if (quizIds.length > 0) {
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("id, title")
      .in("id", quizIds);

    if (quizzes) {
      quizzes.forEach((q) => quizzesMap.set(q.id, q.title));
    }
  }

  const recentSubmissions = (attempts || []).map((attempt) => {
    const candidate = profilesMap.get(attempt.user_id);
    return {
      ...attempt,
      candidateName: candidate?.name || candidate?.display_name || "Candidate",
      candidateEmail: candidate?.email || attempt.user_id,
      quizTitle: quizzesMap.get(attempt.quiz_id) || "Standard Quiz Assessment",
    };
  });

  const formatDuration = (sec: number) => {
    if (!sec) return "N/A";
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}m ${remainingSec}s`;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            System Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time candidate activity, question bank size, and subscription performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/questions/csv-upload"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 transition"
          >
            <Upload className="size-3.5 text-[#833b0c]" />
            <span>Upload CSV</span>
          </Link>

          <Link
            href="/admin/quizzes/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition"
          >
            <Plus className="size-3.5" />
            <span>New Quiz</span>
          </Link>
        </div>
      </div>

      {/* System Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Candidates Metric */}
        <Link
          href="/admin/users"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-[#833b0c]/40 transition"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Candidates</span>
            <Users className="size-4 text-[#833b0c] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalUsers ?? 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Registered student accounts</p>
        </Link>

        {/* Question Bank Metric */}
        <Link
          href="/admin/questions"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-[#833b0c]/40 transition"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Question Bank</span>
            <HelpCircle className="size-4 text-[#833b0c] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalQuestions ?? 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Available practice questions</p>
        </Link>

        {/* Active Quizzes Metric */}
        <Link
          href="/admin/quizzes"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-[#833b0c]/40 transition"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Quizzes</span>
            <BookOpen className="size-4 text-[#833b0c] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalQuizzes ?? 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Live practice tests & mocks</p>
        </Link>

        {/* Pro Candidates Metric */}
        <Link
          href="/admin/subscriptions"
          className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-2 hover:border-emerald-300 transition"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pro Candidates</span>
            <div className="flex items-center gap-1">
              <CreditCard className="size-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <Sparkles className="size-3.5 fill-emerald-600 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{activeSubscriptions ?? 0}</p>
          <p className="text-[10px] text-emerald-700 font-medium">Active paid subscriptions</p>
        </Link>
      </div>

      {/* Live Recent Candidate Submissions Log */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#833b0c]" />
            <h2 className="text-sm font-bold text-slate-900">Recent Candidate Submissions</h2>
          </div>
          <Link
            href="/admin/quizzes"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#833b0c] hover:underline"
          >
            <span>View All Quizzes</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentSubmissions.length === 0 ? (
            <p className="py-6 text-center text-xs font-medium text-slate-400">
              No recent exam submissions recorded in the database yet.
            </p>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="p-3 pl-4">Candidate</th>
                  <th className="p-3">Assessment Title</th>
                  <th className="p-3">Score & Accuracy</th>
                  <th className="p-3">Time Spent</th>
                  <th className="p-3 pr-4 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentSubmissions.map((sub) => {
                  const total = sub.total_questions || 1;
                  const accuracy = Math.round((sub.score / total) * 100);
                  const isPassed = accuracy >= 50;

                  return (
                    <tr key={sub.id} className="hover:bg-stone-50/80 transition">
                      {/* Candidate Name & Link */}
                      <td className="p-3 pl-4">
                        <Link
                          href={`/admin/users/${sub.user_id}`}
                          className="group inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-[#833b0c] transition"
                        >
                          <div>
                            <span className="block font-black group-hover:underline">
                              {sub.candidateName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {sub.candidateEmail}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Quiz Title */}
                      <td className="p-3 font-semibold text-slate-800">
                        {sub.quizTitle}
                      </td>

                      {/* Score / Accuracy */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {isPassed ? (
                            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="size-3.5 text-rose-500 shrink-0" />
                          )}
                          <div>
                            <span className="font-black text-slate-900">
                              {sub.score} / {sub.total_questions}
                            </span>
                            <span
                              className={`ml-1.5 inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                isPassed
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {accuracy}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="p-3 font-medium text-slate-600">
                        {formatDuration(sub.time_taken_sec)}
                      </td>

                      {/* Submission Time */}
                      <td className="p-3 pr-4 text-right text-slate-400 font-medium">
                        {new Date(sub.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}