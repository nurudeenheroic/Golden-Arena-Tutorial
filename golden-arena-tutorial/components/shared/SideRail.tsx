"use client";

import Link from "next/link";
import { Flame, PlayCircle, Trophy, ArrowRight, Lock, Award, Users, Calendar, CheckCircle2, Sparkles } from "lucide-react";
import ProtectedLink from "./ProtectedLink";

export type SideRailUser = {
  name: string;
  email?: string;
  isPaid?: boolean;
  streak?: number;
  bestStreak?: number;
  recentQuizzes?: {
    name: string;
    progress: number;
  }[];
  leaderboardRank?: number;
  activeStudyGroups?: {
    name: string;
    membersCount: number;
  }[];
} | null;

type SideRailProps = {
  user?: SideRailUser;
  isLoading?: boolean;
};

// Fallback data for anonymous marketing visitors
const staticPopularPostUtme = [
  { name: "UNILAG Post-UTME", questions: "1,200+ Practice Questions" },
  { name: "OAU Post-UTME", questions: "950+ Practice Questions" },
  { name: "UI Post-UTME", questions: "1,100+ Practice Questions" },
  { name: "UNILORIN Post-UTME", questions: "800+ Practice Questions" },
];

const staticLeaderboard = [
  { rank: 1, name: "Chinedu O.", score: "2,840 pts" },
  { rank: 2, name: "Amina Y.", score: "2,710 pts" },
  { rank: 3, name: "Tunde B.", score: "2,650 pts" },
];

// Calculate days remaining until UTME (typically around late April / May)
function getUtmeCountdown() {
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, 3, 25); // Month 3 is April
  if (now > targetDate) {
    targetDate = new Date(targetYear + 1, 3, 25);
  }
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function SideRail({ user = null, isLoading = false }: SideRailProps) {
  // Skeleton Loader for Async DB Fetching
  if (isLoading) {
    return <SideRailSkeleton />;
  }

  const utmeDaysLeft = getUtmeCountdown();
  const displayName = user ? user.name : "Guest Candidate";
  const initials = user ? user.name.charAt(0).toUpperCase() : "G";

  return (
    <aside className="space-y-4">
      {/* 1. Student Profile Card (Placed at the very top) */}
      <section className="rounded-2xl border border-[#833b0c]/20 bg-gradient-to-br from-[#f9eee7] to-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#833b0c] text-white font-black text-base shadow-xs">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-black text-slate-900 tracking-tight">
                {displayName}
              </span>
              {user && (
                <span className={`rounded-full px-1.5 py-0.2 text-[8px] font-extrabold ${user.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'}`}>
                  {user.isPaid ? 'PRO' : 'FREE'}
                </span>
              )}
            </div>
            <p className="truncate text-[10px] text-slate-500">
              {user ? user.email || "GAT Candidate Portal" : "Explore GAT Practice Tools"}
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

      {/* 2. Weekly Leaderboard (Promoted near the top for engagement) */}
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
          {staticLeaderboard.map((student) => (
            <div
              key={student.rank}
              className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-[#f9eee7] text-[10px] font-black text-[#833b0c]">
                  #{student.rank}
                </span>
                <span className="text-[10px] font-semibold text-slate-800">{student.name}</span>
              </div>
              <span className="text-[9px] font-bold text-[#833b0c]">{student.score}</span>
            </div>
          ))}

          {/* Current Candidate's Rank Badge */}
          {user && (
            <div className="mt-2.5 rounded-xl border border-[#833b0c]/20 bg-[#f9eee7] px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-800">Your Rank</span>
              <span className="text-[10px] font-black text-[#833b0c]">
                #{user.leaderboardRank ?? "Unranked"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 3. Streak Banner & Interactive Check-In Trigger */}
      <section className="rounded-2xl border border-stone-200 bg-[#fff6ef] p-4">
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-[#833b0c]" />
          <div>
            <p className="text-xs font-bold text-slate-900">
              {user ? `Keep It Up, ${user.name.split(" ")[0]}! 🔥` : "Keep Your Streak! 🔥"}
            </p>
            <p className="text-[9px] text-slate-500">
              {user ? "Daily study streak active." : "Sign in to earn daily streaks!"}
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
          href="/dashboard"
          user={user}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#833b0c] py-2 text-[10px] font-bold text-white shadow-xs transition hover:bg-[#6f300a]"
        >
          <CheckCircle2 className="size-3.5" />
          <span>Complete Daily Check-In</span>
        </ProtectedLink>
      </section>

      {/* 4. UTME Countdown Widget */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f9eee7] text-[#833b0c]">
            <Calendar className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-900">UTME Countdown</p>
            <p className="text-[9px] text-slate-500">Target Exam Window</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-[#833b0c]">{utmeDaysLeft}</p>
          <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Days Left</p>
        </div>
      </section>

      {/* 5. Recent Quizzes (Dynamic DB vs Logged-Out Teaser) */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">Recent Quizzes</h3>
          <ProtectedLink
            href="/quizzes"
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
                <ProtectedLink key={quiz.name} href="/quizzes" user={user} className="block group">
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
              <p className="text-[10px] text-slate-500 py-2 text-center">No quizzes attempted yet.</p>
            )}
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-stone-50 p-3 text-center border border-dashed border-stone-200">
            <Lock className="mx-auto size-4 text-slate-400" />
            <p className="mt-1.5 text-[10px] font-semibold text-slate-700">Practice History Locked</p>
            <p className="mt-0.5 text-[9px] text-slate-500">Sign in to track real-time progress</p>
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
            href="/post-utme"
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
              href="/post-utme"
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

      {/* 7. Study Groups Preview Widget */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="size-4 text-[#833b0c]" />
            <h3 className="text-xs font-bold text-slate-900">Active Study Groups</h3>
          </div>
          <ProtectedLink
            href="/dashboard/study-groups"
            user={user}
            className="text-[9px] font-semibold text-[#833b0c] hover:underline"
          >
            Explore →
          </ProtectedLink>
        </div>

        <div className="mt-3 space-y-2">
          {user && user.activeStudyGroups && user.activeStudyGroups.length > 0 ? (
            user.activeStudyGroups.map((group) => (
              <ProtectedLink
                key={group.name}
                href="/dashboard/study-groups"
                user={user}
                className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-xs transition hover:bg-[#f9eee7]/50"
              >
                <span className="text-[10px] font-semibold text-slate-800">{group.name}</span>
                <span className="text-[9px] font-bold text-[#833b0c]">{group.membersCount} members</span>
              </ProtectedLink>
            ))
          ) : (
            <div className="rounded-xl bg-stone-50 p-2.5 text-center">
              <p className="text-[10px] font-semibold text-slate-700">Join a peer study circle</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Collaborate on difficult UTME subjects.</p>
              <ProtectedLink
                href="/dashboard/study-groups"
                user={user}
                className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-[#833b0c] hover:underline"
              >
                Browse groups <ArrowRight className="size-2.5" />
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

{/* Skeleton Loader Component */}
function SideRailSkeleton() {
  return (
    <aside className="space-y-4 animate-pulse">
      <div className="h-28 rounded-2xl bg-stone-200" />
      <div className="h-40 rounded-2xl bg-stone-200" />
      <div className="h-40 rounded-2xl bg-stone-200" />
      <div className="h-20 rounded-2xl bg-stone-200" />
      <div className="h-36 rounded-2xl bg-stone-200" />
    </aside>
  );
}