"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, Target, Users, Sparkles } from "lucide-react";

export function AboutTeaser() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#833b0c] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        
        {/* Background Educational Doodle Pattern with High Visibility Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-bg.jpeg"
            alt="Educational Doodle Pattern"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
          {/* Lighter Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/60 to-[#833b0c]/50" />
        </div>

        {/* Decorative Radial Glow */}
        <div className="absolute -right-12 -top-12 size-64 rounded-full bg-[#f28b24]/20 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#f9eee7] backdrop-blur-md border border-white/10">
              <Sparkles className="size-3.5 text-[#f28b24]" />
              <span>Get To Know About Us</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight drop-shadow-sm">
              Driven by Excellence. <br />
              <span className="text-[#f28b24]">Built for Nigerian Candidates.</span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed max-w-xl drop-shadow-sm">
              Golden Arena Tutorial (GAT) is not just another practice platform. We are a dedicated academic movement designed to bridge the gap between hard work and actual university admission.
            </p>

            {/* Teaser Feature Cards (Glassmorphism Effect) */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl bg-stone-950/60 p-4 border border-white/15 backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5">
                <Target className="size-5 text-[#f28b24] mb-2" />
                <h3 className="text-xs font-bold text-white">What We Teach</h3>
                <p className="mt-1 text-[11px] text-stone-200 leading-normal">
                  Targeted, syllabus-compliant UTME & Post-UTME modules.
                </p>
              </div>

              <div className="rounded-xl bg-stone-950/60 p-4 border border-white/15 backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5">
                <GraduationCap className="size-5 text-[#f28b24] mb-2" />
                <h3 className="text-xs font-bold text-white">How We Teach</h3>
                <p className="mt-1 text-[11px] text-stone-200 leading-normal">
                  Interactive CBT drills, video breakdowns & detailed solutions.
                </p>
              </div>

              <div className="rounded-xl bg-stone-950/60 p-4 border border-white/15 backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5">
                <Users className="size-5 text-[#f28b24] mb-2" />
                <h3 className="text-xs font-bold text-white">Who Teaches</h3>
                <p className="mt-1 text-[11px] text-stone-200 leading-normal">
                  Experienced subject tutors & top-performing scholars.
                </p>
              </div>
            </div>

            {/* CTA Link to Full About Page */}
            <div className="pt-4 flex items-center gap-4 flex-wrap">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-[#833b0c] shadow-lg transition-all duration-200 hover:bg-[#f9eee7] hover:gap-3"
              >
                <span>Want to know more? Learn everything about GAT</span>
                <ArrowRight className="size-4 text-[#833b0c]" />
              </Link>
            </div>
          </div>

          {/* Side Highlight Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/20 bg-stone-950/60 p-6 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#833b0c] text-white border border-white/10">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">The GAT Methodology</p>
                  <p className="text-[10px] text-stone-300">Proven admissions strategy</p>
                </div>
              </div>

              <blockquote className="text-xs italic text-stone-200 leading-relaxed border-l-2 border-[#f28b24] pl-3">
                “We simplify daunting exam syllabi into daily bite-sized victories, turning exam anxiety into quiet confidence.”
              </blockquote>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-200 border-t border-white/10">
                <span>Success Rate: <strong className="text-white font-bold">98%</strong></span>
                <span>Students Trained: <strong className="text-white font-bold">15,000+</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}