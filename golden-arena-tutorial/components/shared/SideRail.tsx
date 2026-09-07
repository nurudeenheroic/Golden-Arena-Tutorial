"use client";

import Link from "next/link";
import { Flame, PlayCircle, Trophy, ArrowRight, Lock, Award, Users } from "lucide-react";
import ProtectedLink from "./ProtectedLink";

export type SideRailUser = {
  name: string;
  isPaid?: boolean;
  streak?: number;
  bestStreak?: number;
  recentQuizzes?: {
    name: string;
    progress: number;
  }[];
  leaderboardRank?: number;
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

export function SideRail({ user = null, isLoading = false }: SideRailProps) {
  // Skeleton Loader for Async DB Fetching
  if (isLoading) {
    return <SideRailSkeleton />;
  }

  return (
    <aside className="space-y-4">
      {/* 1. Popular Post-UTME */}
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

      {/* 2. Recent Quizzes (Dynamic DB vs Logged-Out Teaser) */}
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

      {/* 3. Streak Banner */}
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
      </section>

      {/* 4. Leaderboard Section */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="size-4 text-[#833b0c]" />
            <h3 className="text-xs font-bold text-slate-900">Weekly Leaderboard</h3>
          </div>
          <ProtectedLink
            href="/leaderboard"
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

      {/* 5. Motivational Quote */}
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
      <div className="h-44 rounded-2xl bg-stone-200" />
      <div className="h-40 rounded-2xl bg-stone-200" />
      <div className="h-36 rounded-2xl bg-stone-200" />
      <div className="h-36 rounded-2xl bg-stone-200" />
    </aside>
  );
}