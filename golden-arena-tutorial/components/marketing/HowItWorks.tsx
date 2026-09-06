// Five-step process section.
// Change the steps in data.ts if your actual GAT journey is different.

import { learningSteps } from "./data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1440px] px-5 pb-12 lg:px-8">
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          How GAT Works
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Simple steps to help you achieve your academic goals.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {learningSteps.map(({ number, title, description, icon: Icon }) => (
          <article
            key={number}
            className="relative rounded-xl border border-stone-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-[#833b0c] text-[10px] font-black text-white">
                {number}
              </span>

              <div className="grid size-9 place-items-center rounded-lg bg-[#faf0e8] text-[#833b0c]">
                <Icon className="size-4" />
              </div>
            </div>

            <h3 className="mt-5 text-sm font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
