"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SubjectOption = { id: string; name: string };

export default function NewNotePage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicName, setTopicName] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isMnemonic, setIsMnemonic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("subjects").select("id, name").order("name");
      if (data) setSubjects(data);
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subjectId) {
      setStatusMsg({ type: "error", text: "Please provide a title and select a subject." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("study_notes").insert({
        title,
        subject_id: subjectId,
        topic_name: topicName || null,
        content: content || null,
        file_url: fileUrl || null,
        is_mnemonic: isMnemonic,
      });

      if (error) throw error;

      setStatusMsg({ type: "success", text: "Note published successfully to candidate portal!" });
      setTimeout(() => router.push("/notes"), 1200);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save study note." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/notes" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c]">
        <ArrowLeft className="size-4" />
        <span>Back to Notes List</span>
      </Link>

      <div>
        <h1 className="text-xl font-black text-slate-900">Upload Study Note or Mnemonic</h1>
        <p className="text-xs text-slate-500">Provide candidate revision guides and memory aid shortcuts.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Periodic Table Elements Mnemonic Chart"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Subject</label>
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            >
              <option value="">Select Subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Topic Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Atomic Structure & Chemical Bonding"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer rounded-2xl bg-amber-50/60 border border-amber-200 p-3.5">
          <input
            type="checkbox"
            checked={isMnemonic}
            onChange={(e) => setIsMnemonic(e.target.checked)}
            className="size-4 accent-[#833b0c]"
          />
          <div>
            <span className="block text-xs font-bold text-amber-950 flex items-center gap-1">
              <ImageIcon className="size-3.5 text-amber-700" /> Tag as Mnemonic / Visual Memory Shortcut
            </span>
            <span className="text-[10px] text-amber-800">
              Flags item for candidates searching memory shortcuts and quick formulas.
            </span>
          </div>
        </label>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Image / File URL (Optional)</label>
          <input
            type="url"
            placeholder="https://your-supabase-storage-url.com/chart.png"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Note Content / Breakdown</label>
          <textarea
            rows={4}
            placeholder="Type explanations or abbreviation details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        {statusMsg && (
          <div
            className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-bold border ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="size-4 text-red-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Publish Note"}
        </button>
      </form>
    </div>
  );
}