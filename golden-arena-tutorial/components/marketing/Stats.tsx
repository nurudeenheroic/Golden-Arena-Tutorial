// Compact statistics row shown directly under the hero.

import { stats } from "./data";

export function Stats() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 lg:px-8">
      <div className="grid grid-cols-2 divide-x divide-stone-200 rounded-2xl border border-stone-200 bg-white py-2 shadow-sm sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-3 px-4 py-4"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f9eee7] text-[#833b0c]">
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900">{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
