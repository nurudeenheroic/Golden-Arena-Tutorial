import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  User,
  Mail,
  Flame,
  Award,
  BookOpen,
  Zap,
  Sparkles,
} from "lucide-react";
import { ProfileNameEditor } from "./ProfileNameEditor";
import { SignOutButton } from "@/components/shared/SignOutButton";

// Disable all server-side page caching for fresh DB reads
export const revalidate = 0;

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch both display_name and name explicitly
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, name, phone, target_exam, is_paid, streak, best_streak, progress_percent, leaderboard_rank, created_at")
    .eq("id", user.id)
    .single();

  const { count: completedQuizzesCount } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Read official Google Full Name from OAuth metadata
  const googleFullName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    profile?.name ??
    "Student";

  // Strict Hierarchy: display_name -> name -> googleFullName
  const activeDisplayName =
    profile?.display_name && profile.display_name.trim() !== ""
      ? profile.display_name
      : profile?.name && profile.name.trim() !== ""
      ? profile.name
      : googleFullName;

  const candidate = {
    id: user.id,
    googleFullName,
    displayName: activeDisplayName,
    email: user.email ?? "",
    phone: profile?.phone ?? "Not provided",
    targetExam: profile?.target_exam ?? "UTME 2027",
    isPaid: Boolean(profile?.is_paid),
    streak: profile?.streak ?? 0,
    bestStreak: profile?.best_streak ?? 0,
    progressPercent: profile?.progress_percent ?? 0,
    leaderboardRank: profile?.leaderboard_rank ?? "Unranked",
    completedQuizzes: completedQuizzesCount ?? 0,
    joinedDate: profile?.created_at
      ? new Date(profile.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "Recently",
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8 space-y-8">
      {/* Profile Header */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 h-32 w-32 bg-[#f9eee7] rounded-bl-full -z-0 opacity-50" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="grid size-16 sm:size-20 place-items-center rounded-2xl bg-[#f9eee7] text-2xl sm:text-3xl font-black text-[#833b0c] border border-[#833b0c]/20 shadow-2xs">
              {candidate.displayName.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {candidate.displayName}
                </h1>
                
                {candidate.isPaid ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    <Sparkles className="size-3 fill-emerald-600" />
                    All-Access Pro
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 border border-stone-200">
                    Free Tier Candidate
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" />
                {candidate.email}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <SignOutButton />
          </div>
        </div>
      </section>

      {/* Profile Credentials Editor */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="size-4 text-[#833b0c]" />
            <span>Profile Credentials & Identity</span>
          </h2>
        </div>

        <ProfileNameEditor
          userId={candidate.id}
          googleFullName={candidate.googleFullName}
          initialDisplayName={candidate.displayName}
        />
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[#833b0c]">
            <Flame className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Streak</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{candidate.streak} Days</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[#833b0c]">
            <Zap className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Readiness</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{candidate.progressPercent}%</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[#833b0c]">
            <BookOpen className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quizzes</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{candidate.completedQuizzes}</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[#833b0c]">
            <Award className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rank</span>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {typeof candidate.leaderboardRank === "number" ? `#${candidate.leaderboardRank}` : candidate.leaderboardRank}
          </p>
        </div>
      </section>
    </div>
  );
}