"use client";

import { Check, Sparkles, Zap, Clock, BookOpen, Layers, HelpCircle } from "lucide-react";
import ProtectedLink from "@/components/shared/ProtectedLink";

interface PricingProps {
  user?: any;
  isMockReleased?: boolean;
  isQuizReleased?: boolean;
}

export function Pricing({ user = null, isMockReleased = true, isQuizReleased = true }: PricingProps) {
  return (
    <section id="pricing" className="scroll-mt-24 py-16 bg-stone-50/50">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f9eee7] px-3.5 py-1 text-xs font-bold text-[#833b0c]">
            <Zap className="size-3.5 fill-[#833b0c]" />
            <span>Flexible Learning Plans</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Choose full access for unlimited practice or pay per mock exam and quiz as you need.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          
          {/* CARD 1: Single Quiz Pass */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#833b0c]/40 hover:shadow-2xl hover:shadow-[#833b0c]/10">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#833b0c] transition-colors">
                  Per Quiz
                </span>
                {!isQuizReleased && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                    <Clock className="size-3" />
                    Upcoming
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900">Single Quiz Pass</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                One-time unlock for a targeted topic quiz or speed test.
              </p>

              <div className="my-5 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 group-hover:text-[#833b0c] transition-colors">₦300</span>
                <span className="text-xs text-slate-500 font-medium">/ test</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:bg-[#f9eee7] group-hover:text-[#833b0c]">
                  <BookOpen className="size-3 text-[#833b0c]" /> 1 Subject
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:bg-[#f9eee7] group-hover:text-[#833b0c]">
                  <HelpCircle className="size-3 text-[#833b0c]" /> 15–20 Questions
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:bg-[#f9eee7] group-hover:text-[#833b0c]">
                  <Clock className="size-3 text-[#833b0c]" /> 15 Mins
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-stone-100 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Access to 1 specific topic quiz</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Instant score breakdown & corrections</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Standard timer mode</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-auto">
              {isQuizReleased ? (
                <ProtectedLink
                  href="/quizzes"
                  user={user}
                  className="w-full inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white py-2.5 text-xs font-bold text-slate-800 transition-all duration-200 group-hover:border-[#833b0c] group-hover:bg-[#833b0c] group-hover:text-white group-hover:shadow-md"
                >
                  Get Single Quiz
                </ProtectedLink>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-400"
                >
                  Available Soon
                </button>
              )}
            </div>
          </div>

          {/* CARD 2: ALL-ACCESS PASS */}
          <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-[#833b0c] bg-white p-6 shadow-xl transition-all duration-300 md:-translate-y-2 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#833b0c]/25">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#833b0c] px-3.5 py-1 text-[10px] font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="size-3 fill-white animate-pulse" />
              <span>MOST POPULAR</span>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#833b0c]">
                  Unlimited
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">All-Access Pass</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Complete unrestricted access to all UTME & Post-UTME preparation materials.
              </p>

              <div className="my-5 flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#833b0c] transition-transform duration-200 group-hover:scale-105">₦10,000</span>
                <span className="text-xs text-slate-500 font-medium">/ full session</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#f9eee7] px-2 py-1 text-[11px] font-bold text-[#833b0c] transition-colors group-hover:bg-[#833b0c] group-hover:text-white">
                  <Layers className="size-3" /> All Subjects
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#f9eee7] px-2 py-1 text-[11px] font-bold text-[#833b0c] transition-colors group-hover:bg-[#833b0c] group-hover:text-white">
                  <HelpCircle className="size-3" /> 15,000+ Questions
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#f9eee7] px-2 py-1 text-[11px] font-bold text-[#833b0c] transition-colors group-hover:bg-[#833b0c] group-hover:text-white">
                  <Clock className="size-3" /> Unlimited Access
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 border-t border-stone-100 pt-4 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Unlimited UTME & Post-UTME Past Questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>All Mock Exams & Timed Quizzes included</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Detailed step-by-step solution explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Performance analytics & weak subject tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Priority WhatsApp Study Group access</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-auto">
              <ProtectedLink
                href="/signup"
                user={user}
                requiresPaid={true}
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-md transition-all duration-200 group-hover:bg-[#6f300a] group-hover:shadow-lg group-hover:shadow-[#833b0c]/30 group-hover:scale-[1.02]"
              >
                Unlock Full Access
              </ProtectedLink>
            </div>
          </div>

          {/* CARD 3: Single Mock Pass */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#833b0c]/40 hover:shadow-2xl hover:shadow-[#833b0c]/10">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#833b0c] transition-colors">
                  Per Mock Exam
                </span>
                {!isMockReleased && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                    <Clock className="size-3" />
                    Upcoming
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900">Single Mock Pass</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                One-time access to take a full-length CBT Mock Exam simulation.
              </p>

              <div className="my-5 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 group-hover:text-[#833b0c] transition-colors">₦500</span>
                <span className="text-xs text-slate-500 font-medium">/ mock</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:bg-[#f9eee7] group-hover:text-[#833b0c]">
                  <BookOpen className="size-3 text-[#833b0c]" /> 4 UTME Subjects
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:bg-[#f9eee7] group-hover:text-[#833b0c]">
                  <HelpCircle className="size-3 text-[#833b0c]" /> 180 Questions
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:bg-[#f9eee7] group-hover:text-[#833b0c]">
                  <Clock className="size-3 text-[#833b0c]" /> 120 Mins
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-stone-100 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>1 Full-length official CBT Mock attempt</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Real JAMB/Post-UTME exam timer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-[#833b0c] mt-0.5 transition-transform group-hover:scale-125" />
                  <span>Subject performance report</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-auto">
              {isMockReleased ? (
                <ProtectedLink
                  href="/quizzes"
                  user={user}
                  className="w-full inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white py-2.5 text-xs font-bold text-slate-800 transition-all duration-200 group-hover:border-[#833b0c] group-hover:bg-[#833b0c] group-hover:text-white group-hover:shadow-md"
                >
                  Get Single Mock
                </ProtectedLink>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-400"
                >
                  Available Soon
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}