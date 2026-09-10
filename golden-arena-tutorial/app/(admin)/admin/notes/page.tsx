import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Plus, Image as ImageIcon, BookOpen, Download } from "lucide-react";

export const revalidate = 0;

export default async function AdminNotesPage() {
  const supabase = await createClient();

  const { data: notes } = await supabase
    .from("study_notes")
    .select(`
      id,
      title,
      content,
      file_url,
      is_mnemonic,
      topic_name,
      created_at,
      subjects ( name )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Study Notes & Mnemonics</h1>
          <p className="text-xs text-slate-500">
            Upload visual memory charts, topic summaries, and abbreviations for candidates.
          </p>
        </div>

        <Link
          href="/notes/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition"
        >
          <Plus className="size-4" />
          <span>Upload Note / Mnemonic</span>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes && notes.length > 0 ? (
          notes.map((note) => {
            const subjectName = (note.subjects as unknown as { name?: string })?.name ?? "General";

            return (
              <div
                key={note.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {subjectName}
                    </span>

                    {note.is_mnemonic ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
                        <ImageIcon className="size-3 text-amber-700" /> Mnemonic
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                        <FileText className="size-3" /> Note Guide
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{note.title}</h3>
                    {note.topic_name && (
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Topic: {note.topic_name}</p>
                    )}
                  </div>

                  {note.content && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{note.content}</p>
                  )}
                </div>

                {note.file_url && (
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <a
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#833b0c] hover:underline"
                    >
                      <Download className="size-3.5" />
                      <span>View Uploaded Asset</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-2">
            <BookOpen className="mx-auto size-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-700">No study notes or mnemonics uploaded yet.</p>
            <p className="text-[11px] text-slate-400">
              Click &quot;Upload Note / Mnemonic&quot; above to create memory revision aids.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}