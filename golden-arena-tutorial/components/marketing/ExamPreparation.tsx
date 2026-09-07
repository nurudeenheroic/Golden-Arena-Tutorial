"use client";

import Image from "next/image";
import { Check, ArrowRight, BookOpen, Landmark } from "lucide-react";
import ProtectedLink from "../shared/ProtectedLink";

type ExamPrepProps = {
  user?: { name: string; isPaid?: boolean } | null;
};

const utmeFeatures = [
  "All JAMB Subjects Covered",
  "Topic Video Lessons & Summaries",
  "Timed Practice CBT Quizzes",
  "Past Questions with Explanations",
];

const postUtmeFeatures = [
  "University-Specific Screening Content",
  "Past Questions & Solutions (2010–2025)",
  "Screening Tips & Score Cut-Off Guides",
  "Full-Length Post-UTME Mock Tests",
];

export function ExamPreparation({ user = null }: ExamPrepProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-block rounded-full bg-[#f9eee7] px-3 py-1 text-xs font-bold text-[#833b0c]">
          Exam Focused Training
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          We Cover All You Need
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Everything required to excel in your entrance examinations
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        
        {/* UTME Preparation Card */}
        <div className="group rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-[#833b0c]/40 hover:shadow-md flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#f9eee7] text-[#833b0c]">
                <BookOpen className="size-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">UTME Preparation</h3>
                <p className="text-xs text-slate-500">
                  JAMB UTME preparation for Science, Commercial & Arts.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 pt-2">
              {utmeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <div className="grid size-4 place-items-center rounded-full bg-[#f9eee7] text-[#833b0c]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <ProtectedLink
              href="/utme"
              user={user}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#6f300a]"
            >
              <span>Explore UTME</span>
              <ArrowRight className="size-3.5" />
            </ProtectedLink>
          </div>
        </div>

        {/* Post-UTME Preparation Card */}
        <div className="group rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-[#833b0c]/40 hover:shadow-md flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#f9eee7] text-[#833b0c]">
                <Landmark className="size-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Post-UTME Preparation</h3>
                <p className="text-xs text-slate-500">
                  Targeted screening practice for top universities across Nigeria.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 pt-2">
              {postUtmeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <div className="grid size-4 place-items-center rounded-full bg-[#f9eee7] text-[#833b0c]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <ProtectedLink
              href="/post-utme"
              user={user}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#6f300a]"
            >
              <span>Explore Post-UTME</span>
              <ArrowRight className="size-3.5" />
            </ProtectedLink>
          </div>
        </div>

      </div>
    </section>
  );
}