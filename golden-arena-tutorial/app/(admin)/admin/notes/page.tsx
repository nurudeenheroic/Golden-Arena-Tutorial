import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Image as ImageIcon, Plus, ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 0;

export default async function NotesHubPage() {
  const supabase = await createClient();

  // Fetch counts and records for notes vs mnemonics
  const [{ count: textNotesCount }, { count: mnemonicsCount }, { data: subjects }] = await Promise.all([
    supabase.from("study_notes").select("*", { count: "exact", head: true }).eq("is_mnemonic", false),
    supabase.from("study_notes").select("*", { count: "exact", head: true }).eq("is_mnemonic", true),
    supabase.from("subjects").select("id, name").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">Study Resources & Visual Mnemonics Hub</h1>
        <p className="text-xs text-slate-500">
          Manage text guides and sectioned visual memory assets for candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TEXT NOTES CARD */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 space-y-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                <FileText className="size-3.5" /> Text Study Notes
              </span>
              <span className="text-2xl font-black text-slate-900">{textNotesCount ?? 0}</span>
            </div>
            <p className="text-xs text-slate-500">
              Comprehensive subject breakdowns, revision summaries, and document guides.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            {textNotesCount && textNotesCount > 0 ? (
              <Link
                href="/admin/notes/text-notes"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <span>View All Notes ({textNotesCount})</span>
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <Link
                href="/admin/notes/text-notes/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2 text-xs font-bold text-white hover:bg-[#6f300a] transition"
              >
                <Plus className="size-3.5" />
                <span>Add First Study Note</span>
              </Link>
            )}

            <Link
              href="/admin/notes/text-notes/new"
              className="text-xs font-bold text-[#833b0c] hover:underline inline-flex items-center gap-1"
            >
              <Plus className="size-3" /> Add New
            </Link>
          </div>
        </div>

        {/* MNEMONICS CARD */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 space-y-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200">
                <ImageIcon className="size-3.5 text-amber-700" /> Visual Mnemonics
              </span>
              <span className="text-2xl font-black text-slate-900">{mnemonicsCount ?? 0}</span>
            </div>
            <p className="text-xs text-slate-500">
              Sectioned charts, diagrams, infographics, and memory shortcut images.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            {mnemonicsCount && mnemonicsCount > 0 ? (
              <Link
                href="/admin/notes/mnemonics"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <span>View All Mnemonics ({mnemonicsCount})</span>
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <Link
                href="/admin/notes/mnemonics/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2 text-xs font-bold text-white hover:bg-[#6f300a] transition"
              >
                <Plus className="size-3.5" />
                <span>Add First Mnemonic</span>
              </Link>
            )}

            <Link
              href="/admin/notes/mnemonics/new"
              className="text-xs font-bold text-[#833b0c] hover:underline inline-flex items-center gap-1"
            >
              <Plus className="size-3" /> Add New
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}