import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, BookOpen, MessageCircle, ShieldCheck, HelpCircle, Award, ExternalLink } from "lucide-react";

export default async function UnilorinPortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_paid")
    .eq("id", user?.id ?? "")
    .single();

  const isPaid = Boolean(profile?.is_paid);

  // Replace with your actual WhatsApp Group link & Admin support number link
  const whatsappGroupLink = "https://chat.whatsapp.com/your-unilorin-class-group-invite";
  const adminWhatsAppLink = "https://wa.me/2348000000000?text=Hello%20Admin,%20I%20need%20help%20with%20UNILORIN%20Post-UTME%20classes.";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard/post-utme" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c]">
        <ArrowLeft className="size-4" />
        <span>Back to Post-UTME Hub</span>
      </Link>

      {/* Header Banner */}
      <div className="rounded-3xl border border-[#833b0c]/20 bg-gradient-to-br from-[#f9eee7] to-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg bg-[#833b0c] px-3 py-1 text-[10px] font-black uppercase text-white">
            University of Ilorin (UNILORIN)
          </span>
          <span className={`rounded-full px-3 py-1 text-[10px] font-black ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {isPaid ? 'Status: PRO Candidate (Full Access)' : 'Status: Free Visitor'}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          UNILORIN Post-UTME Screening & Masterclass Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Prepare effectively for the University of Ilorin's Computer-Based Screening Test (CBT) with curated insights, historical background, and live expert tutoring.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <MessageCircle className="size-4" />
            <span>Join WhatsApp Class Group</span>
            <ExternalLink className="size-3 opacity-75" />
          </a>

          <a
            href={adminWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-xs hover:bg-stone-50 transition"
          >
            <MessageCircle className="size-4 text-emerald-600" />
            <span>Contact Admin on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Overview & History */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="size-4 text-[#833b0c]" />
          <span>Brief History & Institutional Overview</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Established by the Federal Government of Nigeria in 1975, the <strong>University of Ilorin (UNILORIN)</strong> is located in Ilorin, Kwara State. It has grown into one of Nigeria's most sought-after federal universities, renowned for its academic stability, serene campus culture, and massive applicant volume across Arts, Sciences, and Social/Management Sciences.
        </p>
      </div>

      {/* Admission & Screening Structure */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-black text-[#833b0c]">
            <ShieldCheck className="size-4" />
            <span>How Admission Works</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Admission into UNILORIN is strictly merit-based and competitive. It combines your **JAMB UTME Score (50%)** and your **Post-UTME Screening CBT Score (50%)**, alongside your O'Level prerequisite credits.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-black text-[#833b0c]">
            <Award className="size-4" />
            <span>Post-UTME CBT Format</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The screening test typically covers English Language, Mathematics, and your chosen subject combination (e.g., CRS, Government, Literature, or Economics). Speed and accuracy are vital as questions are timed under strict CBT conditions.
          </p>
        </div>
      </div>
    </div>
  );
}