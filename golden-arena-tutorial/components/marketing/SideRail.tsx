// Optional desktop-only right rail inspired by the reference image.
// It stays hidden below large screens so mobile/tablet layouts remain simple.

import { Flame, PlayCircle, Trophy } from "lucide-react";
import { popularPostUtme, recentQuizzes } from "./data";

export function SideRail() {
  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">Popular Post-UTME</h3>
          <a href="/post-utme" className="text-[9px] font-semibold text-[#833b0c]">
            View All →
          </a>
        </div>

        <div className="mt-3 divide-y divide-stone-100">
          {popularPostUtme.map((school) => (
            <a
              key={school.name}
              href="#"
              className="block py-3 first:pt-0 last:pb-0"
            >
              <p className="text-[10px] font-semibold text-slate-800">{school.name}</p>
              <p className="mt-1 text-[9px] text-slate-400">{school.questions}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">Recent Quizzes</h3>
          <a href="/quizzes" className="text-[9px] font-semibold text-[#833b0c]">
            View All →
          </a>
        </div>

        <div className="mt-3 space-y-3">
          {recentQuizzes.map((quiz) => (
            <div key={quiz.name}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <PlayCircle className="size-4 shrink-0 text-[#833b0c]" />
                  <span className="truncate text-[10px] font-medium text-slate-700">
                    {quiz.name}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#833b0c]">{quiz.progress}%</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-[#833b0c]"
                  style={{ width: `${quiz.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-[#fff6ef] p-4">
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-[#833b0c]" />
          <div>
            <p className="text-xs font-bold text-slate-900">Keep Your Streak! 🔥</p>
            <p className="text-[9px] text-slate-500">You&apos;re doing great. Don&apos;t break it!</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white p-3 text-center">
            <p className="text-lg font-black text-[#833b0c]">12</p>
            <p className="text-[9px] text-slate-500">Day Streak</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-center">
            <p className="text-lg font-black text-[#833b0c]">45</p>
            <p className="text-[9px] text-slate-500">Best Streak</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
        <Trophy className="mx-auto size-7 text-[#833b0c]" />
        <p className="mt-3 text-xs font-semibold text-slate-800">
          “The expert in anything was once a beginner.”
        </p>
        <p className="mt-2 text-[9px] text-slate-400">
          Keep learning, keep growing.
        </p>
      </section>
    </aside>
  );
}
