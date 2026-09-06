// Final conversion banner placed after testimonials.
// Change the headline or button target here if your pricing/signup flow changes.

import { ArrowRight } from "lucide-react";

export function SuccessCTA() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-10 lg:px-8">
      <div className="rounded-2xl bg-[#fff4ea] px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#833b0c]">
              Start Today
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
              Ready to Start Your Success Story?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Join students preparing smarter for UTME and Post-UTME with GAT.
            </p>
          </div>

          <a
            href="/signup"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#833b0c] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#6f300a]"
          >
            Get Started
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
