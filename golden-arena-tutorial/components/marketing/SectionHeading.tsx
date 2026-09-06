// Reusable heading used by the major landing-page sections.

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref = "#",
}: SectionHeadingProps) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#833b0c]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <a
          href={actionHref}
          className="hidden shrink-0 text-sm font-semibold text-[#833b0c] transition hover:underline sm:block"
        >
          {actionLabel} →
        </a>
      )}
    </div>
  );
}
