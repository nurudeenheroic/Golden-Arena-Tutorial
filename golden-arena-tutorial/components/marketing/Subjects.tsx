// Subject practice cards.
// Edit subject names, question counts and icons from data.ts.

import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { subjects } from "./data";

export function Subjects() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8">
      <SectionHeading
        title="Practice By Subjects (UTME)"
        description="All subjects for Science, Commercial & Arts students."
        actionLabel="View All Subjects"
        actionHref="/utme/subjects"
      />

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {subjects.map(({ name, questions, icon: Icon }) => (
          <a
            key={name}
            href={`/utme/${name.toLowerCase().replaceAll(" ", "-")}`}
            className="group rounded-xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#d8b49c] hover:shadow-md"
          >
            <div className="grid size-12 place-items-center rounded-full bg-[#faf0e8] text-[#833b0c]">
              <Icon className="size-5" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-900">{name}</p>
            <p className="mt-2 text-[10px] text-slate-500">
              {questions} Questions
            </p>

            <div className="mt-4 flex items-center justify-end text-[#833b0c]">
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
