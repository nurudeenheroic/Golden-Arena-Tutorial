"use client";

import Link from "next/link";
import { Flame, PlayCircle, Trophy, ArrowRight, Lock, Award, Users, Calendar, CheckCircle2, Sparkles, User as UserIcon } from "lucide-react";
import ProtectedLink from "./ProtectedLink";

export type LeaderboardUser = {
  rank: number;
  name: string;
  score: string;
  isCurrentUser?: boolean;
};

export type SideRailUser = {
  name: string;
  email?: string;
  role?: string;
  plan?: string;
  isPaid?: boolean;
  streak?: number;
  bestStreak?: number;
  recentQuizzes?: {
    name: string;
    progress: number;
    attemptId?: string; // Added to route directly to the result page
  }[];
  leaderboardRank?: number | string;
  activeStudyGroups?: {
    name: string;
    membersCount: number;
  }[];
} | null;

type SideRailProps = {
  user?: SideRailUser;
  leaderboard?: LeaderboardUser[];
  isLoading?: boolean;
};

// Target 2027 UTME commencement date: March 25, 2027
function getUtmeCountdown() {
  const now = new Date();
  const targetDate = new Date("2027-03-25T00:00:00");
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

const staticPopularPostUtme = [
  { name: "UNILORIN Post-UTME", questions: "800+ Practice Questions", path: "/dashboard/post-utme/unilorin" },
  { name: "UNILAG Post-UTME", questions: "1,200+ Practice Questions", path: "/dashboard/post-utme" },
  { name: "OAU Post-UTME", questions: "950+ Practice Questions", path: "/dashboard/post-utme" },
  { name: "UI Post-UTME", questions: "1,100+ Practice Questions", path: "/dashboard/post-utme" },
];

const staticLeaderboardFallback = [
  { rank: 1, name: "Chinedu O.", score: "2,840 pts" },
  { rank: 2, name: "Amina Y.", score: "2,710 pts" },
  { rank: 3, name: "Tunde B.", score: "2,650 pts" },
];

export function SideRail({ user = null, leaderboard = [], isLoading = false }: SideRailProps) {
  if (isLoading) {
    return <SideRailSkeleton />;
  }

  const utmeDaysLeft = getUtmeCountdown();
  const displayName = user ? user.name : "Guest Candidate";
  const userRole = user?.role ? user.role.toUpperCase() : "CANDIDATE";
  
  // Strictly reflect whatever plan value is stored in the database (e.g. "ANNUAL"), falling back to "FREE" if missing
  const userPlan = user?.plan ? user.plan.toUpperCase() : "FREE";
  const hasActivePlan = user?.isPaid || (user?.plan && user.plan.toLowerCase() !== "free");

  const activeLeaderboard = leaderboard.length > 0 ? leaderboard : staticLeaderboardFallback;
  const whatsappStudyGroupLink = "https://chat.whatsapp.com/your-general-study-group-invite";

  return (
    <aside className="space-y-4">
      {/* 1. Dynamic Student Profile Card */}
      <section className="rounded-2xl border border-[#833b0c]/20 bg-gradient-to-br from-[#f9eee7] to-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#833b0c] text-white shadow-xs">
            <UserIcon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="truncate text-xs font-black text-slate-900 tracking-tight">
                {displayName}
              </span>
              <span className="rounded-full bg-[#833b0c]/10 px-1.5 py-0.2 text-[8px] font-extrabold text-[#833b0c]">
                {userRole}
              </span>
              <span className={`rounded-full px-1.5 py-0.2 text-[8px] font-extrabold ${hasActivePlan ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'}`}>
                {userPlan}
              </span>
            </div>
            <p className="truncate text-[10px] text-slate-500 mt-0.5">
              {user ? user.email || "Golden Arena Candidate Portal" : "Explore GAT Practice Tools"}
            </p>
          </div>
        </div>

        {user ? (
          <div className="mt-3.5 flex items-center justify-between border-t border-[#833b0c]/10 pt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#833b0c]">
              <Sparkles className="size-3.5" />
              <span>Portal Active</span>
            </div>
            <Link
              href="/dashboard/profile"
              className="text-[10px] font-bold text-[#833b0c] hover:underline"
            >
              Manage Profile →
            </Link>
          </div>
        ) : (
          <div className="mt-3.5 flex items-center justify-between border-t border-[#833b0c]/10 pt-3">
            <span className="text-[10px] text-slate-500">New to Golden Arena?</span>
            <Link
              href="/signup"
              className="text-[10px] font-bold text-[#833b0c] hover:underline"
            >
              Create Account →
            </Link>
          </div>
        )}
      </section>

      {/* 2. Dynamically Fetched Weekly Leaderboard */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="size-4 text-[#833b0c]" />
            <h3 className="text-xs font-bold text-slate-900">Weekly Leaderboard</h3>
          </div>
          <ProtectedLink
            href="/dashboard/leaderboard"
            user={user}
            className="text-[9px] font-semibold text-[#833b0c] hover:underline"
          >
            View All →
          </ProtectedLink>
        </div>

        <div className="mt-3 space-y-2">
          {activeLeaderboard.slice(0, 3).map((student) => (
            <div
              key={student.rank}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                student.isCurrentUser ? 'bg-[#f9eee7] border border-[#833b0c]/30 font-bold' : 'bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#f9eee7] text-[10px] font-black text-[#833b0c]">
                  #{student.rank}
                </span>
                <span className="truncate text-[10px] font-semibold text-slate-800 flex items-center gap-1.5">
                  {student.name}
                  {student.isCurrentUser && (
                    <span className="rounded bg-[#833b0c] px-1 py-0.2 text-[8px] font-extrabold text-white">
                      You
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[9px] font-bold text-[#833b0c] shrink-0">{student.score}</span>
            </div>
          ))}

          {user && (
            <div className="mt-2.5 rounded-xl border border-[#833b0c]/20 bg-[#f9eee7] px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-800">Your Standing</span>
              <span className="text-[10px] font-black text-[#833b0c]">
                {user.leaderboardRank ? `#${user.leaderboardRank}` : "Unranked"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 3. Streak Banner & Interactive Check-In */}
      <section className="rounded-2xl border border-stone-200 bg-[#fff6ef] p-4">
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-[#833b0c]" />
          <div>
            <p className="text-xs font-bold text-slate-900">
              {user ? `Keep It Up, ${user.name.split(" ")[0]}! 🔥` : "Keep Your Streak! 🔥"}
            </p>
            <p className="text-[9px] text-slate-500">
              {user ? "Practice daily to grow your streak." : "Sign in to earn daily streaks!"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white p-3 text-center shadow-2xs">
            <p className="text-lg font-black text-[#833b0c]">{user ? user.streak ?? 0 : 0}</p>
            <p className="text-[9px] text-slate-500">Day Streak</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-2xs">
            <p className="text-lg font-black text-[#833b0c]">{user ? user.bestStreak ?? 0 : 0}</p>
            <p className="text-[9px] text-slate-500">Best Streak</p>
          </div>
        </div>

        <ProtectedLink
          href="/dashboard/quizzes"
          user={user}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#833b0c] py-2 text-[10px] font-bold text-white shadow-xs transition hover:bg-[#6f300a]"
        >
          <CheckCircle2 className="size-3.5" />
          <span>Take Quiz to Maintain Streak</span>
        </ProtectedLink>
      </section>

      {/* 4. UTME 2027 Countdown Widget */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f9eee7] text-[#833b0c]">
            <Calendar className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-900">2027 UTME Countdown</p>
            <p className="text-[9px] text-slate-500">March 25, 2027 Window</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-[#833b0c]">{utmeDaysLeft}</p>
          <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Days Left</p>
        </div>
      </section>

      {/* 5. Recent Quizzes History Card */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">Recent Quizzes</h3>
          <ProtectedLink
            href="/dashboard/quizzes/history" // Updated to point to full history page
            user={user}
            className="text-[9px] font-semibold text-[#833b0c] hover:underline"
          >
            View All →
          </ProtectedLink>
        </div>

        {user ? (
          <div className="mt-3 space-y-3">
            {user.recentQuizzes && user.recentQuizzes.length > 0 ? (
              user.recentQuizzes.map((quiz) => (
                <ProtectedLink 
                  key={quiz.name} 
                  href={quiz.attemptId ? `/dashboard/quizzes/results/${quiz.attemptId}` : "/dashboard/quizzes"} 
                  user={user} 
                  className="block group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <PlayCircle className="size-4 shrink-0 text-[#833b0c]" />
                      <span className="truncate text-[10px] font-medium text-slate-700 group-hover:text-[#833b0c]">
                        {quiz.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-[#833b0c]">{quiz.progress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#833b0c] transition-all duration-300"
                      style={{ width: `${quiz.progress}%` }}
                    />
                  </div>
                </ProtectedLink>
              ))
            ) : (
              <p className="text-[10px] text-slate-500 py-2 text-center">No recent quiz attempts found.</p>
            )}
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-stone-50 p-3 text-center border border-dashed border-stone-200">
            <Lock className="mx-auto size-4 text-slate-400" />
            <p className="mt-1.5 text-[10px] font-semibold text-slate-700">Practice History Locked</p>
            <p className="mt-0.5 text-[9px] text-slate-500">Sign in to track real-time quiz results</p>
            <Link
              href="/login"
              className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold text-[#833b0c] hover:underline"
            >
              Log in to unlock <ArrowRight className="size-2.5" />
            </Link>
          </div>
        )}
      </section>

      {/* 6. Popular Post-UTME */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">Popular Post-UTME</h3>
          <ProtectedLink
            href="/dashboard/post-utme"
            user={user}
            className="text-[9px] font-semibold text-[#833b0c] hover:underline"
          >
            View All →
          </ProtectedLink>
        </div>

        <div className="mt-3 divide-y divide-stone-100">
          {staticPopularPostUtme.map((school) => (
            <ProtectedLink
              key={school.name}
              href={school.path}
              user={user}
              className="block py-2.5 first:pt-0 last:pb-0 group"
            >
              <p className="text-[10px] font-semibold text-slate-800 transition group-hover:text-[#833b0c]">
                {school.name}
              </p>
              <p className="mt-0.5 text-[9px] text-slate-400">{school.questions}</p>
            </ProtectedLink>
          ))}
        </div>
      </section>

      {/* 7. Active Study Groups (Linked directly to WhatsApp) */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="size-4 text-[#833b0c]" />
            <h3 className="text-xs font-bold text-slate-900">Active Study Groups</h3>
          </div>
          <a
            href={whatsappStudyGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-semibold text-[#833b0c] hover:underline"
          >
            Explore →
          </a>
        </div>

        <div className="mt-3 space-y-2">
          {hasActivePlan ? (
            <div className="rounded-xl bg-stone-50 p-3 text-center border border-stone-200">
              <p className="text-[10px] font-semibold text-slate-800">The GAT Whatsapp Study Lounge</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Join our community of learners!</p>
              <a
                href={whatsappStudyGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline"
              >
                Join WhatsApp Group <ArrowRight className="size-2.5" />
              </a>
            </div>
          ) : (
            <div className="rounded-xl bg-stone-50 p-3 text-center border border-dashed border-stone-200">
              <Lock className="mx-auto size-4 text-amber-600" />
              <p className="mt-1.5 text-[10px] font-semibold text-slate-800">PRO Plan Required</p>
              <p className="mt-0.5 text-[9px] text-slate-500">Study groups are exclusively unlocked for paid candidates.</p>
              <ProtectedLink
                href="/pricing"
                user={user}
                className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold text-[#833b0c] hover:underline"
              >
                Upgrade Plan <ArrowRight className="size-2.5" />
              </ProtectedLink>
            </div>
          )}
        </div>
      </section>

      {/* 8. Motivational Quote */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm">
        <Trophy className="mx-auto size-7 text-[#833b0c]" />
        <p className="mt-3 text-xs font-semibold text-slate-800">
          “The expert in anything was once a beginner.”
        </p>
        <p className="mt-2 text-[9px] text-slate-400">Keep learning, keep growing.</p>
      </section>
    </aside>
  );
}

function SideRailSkeleton() {
  return (
    <aside className="space-y-4 animate-pulse">
      <div className="h-28 rounded-2xl bg-stone-200" />
      <div className="h-40 rounded-2xl bg-stone-200" />
      <div className="h-40 rounded-2xl bg-stone-200" />
      <div className="h-20 rounded-2xl bg-stone-200" />
    </aside>
  );
}