// Testimonials are deliberately placed before the final CTA,
// as requested.

import { Quote, Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { testimonials } from "./data";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-12 lg:px-8">
      <SectionHeading
        title="What Our Students Say"
        description="Real stories. Real results."
        actionLabel="View All Testimonials"
        actionHref="/testimonials"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <article
            key={item.name}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Initial-based avatar keeps the component simple and avoids extra image dependencies. */}
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f2dfd1] text-sm font-black text-[#833b0c]">
                {item.name.charAt(0)}
              </div>

              <div className="min-w-0">
                <Quote className="size-5 text-[#c99772]" />
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  “{item.quote}”
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                <p className="mt-1 text-[10px] text-slate-500">{item.role}</p>
              </div>

              <div className="flex gap-0.5" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={`${index}-${starIndex}`}
                    className="size-3.5 fill-[#f28b24] text-[#f28b24]"
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
