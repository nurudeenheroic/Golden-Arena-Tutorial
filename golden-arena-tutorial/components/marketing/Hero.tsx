// Hero section: the first thing visitors see.
// Edit the main headline, paragraph, and CTA labels here.

import { ArrowRight, Check, PlayCircle, Target } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="border-b border-stone-100 bg-[#fffdfa]">
      <div className="mx-auto grid max-w-[1440px] gap-5 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1.45fr)_280px] lg:px-8 lg:py-5">
        {/* Left hero copy */}
        <div className="flex flex-col justify-center py-6 lg:pr-4">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#e7cdbb] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#833b0c]">
            <span className="grid size-4 place-items-center rounded-full bg-[#f9eee7]">
              ★
            </span>
            Your Success, Our Priority
          </div>

          {/* Main headline — edit the three lines to change the hero message. */}
          <h1 className="text-4xl font-black leading-[1.04] tracking-[-0.035em] text-slate-950 xl:text-5xl">
            Prepare Smarter.
            <br />
            Score Higher.
            <br />
            <span className="text-[#833b0c]">Get Admitted.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600">
            GAT (Golden Arena Tutorial) is your all-in-one platform for UTME
            and Post-UTME preparation. Access past questions, take realistic
            quizzes, study notes, and track your progress — all in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Primary CTA */}
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-[#833b0c] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#6f300a]"
            >
              Start Learning
              <ArrowRight className="size-4" />
            </a>

            {/* Secondary CTA */}
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-[#cda990] bg-white px-5 py-3 text-xs font-bold text-[#833b0c] transition hover:bg-[#fff6f0]"
            >
              <PlayCircle className="size-4" />
              Watch Demo
            </a>
          </div>

          {/* Quick benefits under the CTA */}
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">
            {["Real Past Questions", "Mock Exams", "Study Notes", "Progress Tracking"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-[#833b0c]" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Center hero image */}
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm lg:min-h-[430px]">
          <Image
            src="/images/gat-hero-student.png"
            alt="Student preparing for an exam with GAT"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />

          {/* Progress card — easy to edit */}
          <div className="absolute left-5 top-5 rounded-xl border border-white/60 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-[10px] font-bold text-slate-800">Your Progress</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full border-[5px] border-[#833b0c] border-r-stone-200 text-xs font-black text-slate-900">
                76%
              </div>
              <p className="text-[10px] leading-4 text-slate-500">
                Keep going!
                <br />
                You&apos;re doing great!
              </p>
            </div>
          </div>

          {/* "Next Up" card */}
          <div className="absolute right-5 top-5 hidden w-40 rounded-xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur sm:block">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-[#f9eee7] text-[#833b0c]">
                <Target className="size-4" />
              </div>
              <div>
                <p className="text-[9px] text-slate-500">Next Up</p>
                <p className="text-xs font-bold text-slate-900">Mathematics</p>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500">Algebra · 10 questions</p>
          </div>

          {/* Bottom image overlay */}
          <div className="absolute bottom-4 right-4 w-44 rounded-xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-[#f9eee7] text-[#833b0c]">
                <Target className="size-4" />
              </div>
              <div>
                <p className="text-[9px] text-slate-500">Today&apos;s Goal</p>
                <p className="text-xs font-bold text-slate-900">Complete 3 quizzes</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-stone-200">
              <div className="h-full w-2/3 rounded-full bg-[#833b0c]" />
            </div>
            <p className="mt-1 text-right text-[9px] text-slate-500">2 / 3</p>
          </div>
        </div>

        {/* Desktop quick dashboard rail */}
        <aside className="hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-sm lg:block">
          <p className="text-sm font-bold text-slate-900">Welcome Back! 👋</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Keep pushing towards your goals.
          </p>

          <div className="mt-5 rounded-xl bg-[#faf7f4] p-3">
            <p className="text-[10px] font-semibold text-slate-500">Continue Learning</p>
            <p className="mt-2 text-xs font-bold text-slate-900">Mathematics</p>
            <p className="text-[10px] text-slate-500">Quadratic Equations</p>
            <div className="mt-3 h-1.5 rounded-full bg-stone-200">
              <div className="h-full w-3/4 rounded-full bg-[#833b0c]" />
            </div>
            <p className="mt-1 text-right text-[9px] font-semibold text-slate-500">75%</p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["Quizzes", "Take Quiz"],
              ["Past Questions", "Practice"],
              ["Study Notes", "Read Notes"],
              ["Live Classes", "Join Now"],
            ].map(([title, sub]) => (
              <a
                key={title}
                href="#"
                className="rounded-lg border border-stone-200 p-3 transition hover:border-[#d5ae94] hover:bg-[#fffaf7]"
              >
                <p className="text-[10px] font-bold text-slate-800">{title}</p>
                <p className="mt-1 text-[9px] text-slate-500">{sub}</p>
              </a>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-[#f7e7db] p-3">
            <p className="text-xs font-bold text-[#833b0c]">2027 UTME Ready?</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-600">
              Get access to our complete preparation package.
            </p>
            <a
              href="/pricing"
              className="mt-3 inline-flex rounded-md bg-[#833b0c] px-3 py-2 text-[9px] font-bold text-white"
            >
              Get UTME Access
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
