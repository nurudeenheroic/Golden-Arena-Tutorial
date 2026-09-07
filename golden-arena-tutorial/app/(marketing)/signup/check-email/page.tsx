// app/(marketing)/signup/check-email/page.tsx
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="max-w-sm mx-auto p-6 space-y-5 text-center">
      {/* Featured Mail Icon */}
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#f9eee7] ring-8 ring-[#f9eee7]/50">
        <MailCheck className="size-10 stroke-[#833b0c] stroke-[1.75]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-slate-900">Check your email</h1>
        <p className="text-xs leading-relaxed text-slate-600">
          We&apos;ve sent a confirmation link to your email address. Click it to
          activate your account, then come back and log in.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/login"
          className="inline-block rounded-xl border border-stone-200 px-5 py-2.5 text-xs font-semibold text-[#833b0c] transition hover:border-[#833b0c] hover:bg-[#f9eee7]/30"
        >
          Back to Log In
        </Link>
      </div>
    </div>
  );
}