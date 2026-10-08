import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Building2, Sparkles, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function PostUtmeHubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_paid")
    .eq("id", user?.id ?? "")
    .single();

  const isPaid = Boolean(profile?.is_paid);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">Post-UTME Screening & Classes</h1>
        <p className="text-xs text-slate-500">Access university-specific screening guides, past questions, and intensive masterclasses.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* UNILORIN Card (Active & Available) */}
        <div className="rounded-3xl border border-[#833b0c]/30 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#833b0c] text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Active Hub
          </div>

          <div className="space-y-3 pt-2">
            <div className="size-12 rounded-2xl bg-[#f9eee7] text-[#833b0c] flex items-center justify-center font-black">
              <Building2 className="size-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">University of Ilorin (UNILORIN)</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Post-UTME CBT screening prep, departmental cut-off guides, and live WhatsApp classes.</p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isPaid ? 'Unlocked (PRO)' : 'Free Preview Mode'}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/post-utme/unilorin"
            className="w-full rounded-xl bg-[#833b0c] py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition flex items-center justify-center gap-1.5"
          >
            <span>Access UNILORIN Portal</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Coming Soon Card 1: UNILAG */}
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 shadow-2xs flex flex-col justify-between space-y-4 opacity-75">
          <div className="absolute top-0 right-0 bg-stone-200 text-stone-600 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Coming Soon
          </div>
          <div className="space-y-3 pt-2">
            <div className="size-12 rounded-2xl bg-stone-200 text-stone-500 flex items-center justify-center font-black">
              <Building2 className="size-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">University of Lagos (UNILAG)</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Comprehensive POST-UTME screening prep and departmental subject combinations.</p>
            </div>
          </div>
          <button disabled className="w-full rounded-xl bg-stone-200 py-2.5 text-center text-xs font-bold text-stone-500 cursor-not-allowed">
            Opening Soon
          </button>
        </div>

        {/* Coming Soon Card 2: UI */}
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 shadow-2xs flex flex-col justify-between space-y-4 opacity-75">
          <div className="absolute top-0 right-0 bg-stone-200 text-stone-600 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Coming Soon
          </div>
          <div className="space-y-3 pt-2">
            <div className="size-12 rounded-2xl bg-stone-200 text-stone-500 flex items-center justify-center font-black">
              <Building2 className="size-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">University of Ibadan (UI)</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">UI Post-UTME CBT practice tests and faculty screening overviews.</p>
            </div>
          </div>
          <button disabled className="w-full rounded-xl bg-stone-200 py-2.5 text-center text-xs font-bold text-stone-500 cursor-not-allowed">
            Opening Soon
          </button>
        </div>
      </div>
    </div>
  );
}