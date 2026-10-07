"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, FileText, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SubjectOption = { id: string; name: string };

export default function NewTextNotePage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [topicName, setTopicName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
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
    if (!subjectId || !topicName || !title || !content) {
      setStatusMsg({ type: "error", text: "Please complete all required fields (Subject, Topic, Title, and Content)." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("study_notes").insert({
        title: title.trim(),
        subject_id: subjectId,
        topic_name: topicName.trim(),
        content: content.trim(),
        image_url: fileUrl.trim() || null, // Updated from file_url to match your schema
        is_mnemonic: false,
      });

      if (error) throw error;

      setStatusMsg({ type: "success", text: "Study note published successfully!" });
      setTimeout(() => router.push("/admin/notes/text-notes"), 1200);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save study note." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/notes" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c]">
        <ArrowLeft className="size-4" />
        <span>Back to Hub</span>
      </Link>

      <div>
        <h1 className="text-xl font-black text-slate-900">Upload Text Study Note</h1>
        <p className="text-xs text-slate-500">Provide comprehensive textual revision guides and section breakdowns for candidates.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
        {/* Step 1: Subject & Topic Selection */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">1. Select Subject *</label>
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-semibold outline-none focus:border-[#833b0c]"
            >
              <option value="">Choose Subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">2. Topic / Section Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Chemical Kinetics & Equilibrium"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-semibold outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>

        {/* Step 2: Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">3. Note Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Comprehensive Guide to Reaction Rates"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-semibold outline-none focus:border-[#833b0c]"
          />
        </div>

        {/* Step 3: Reference Document URL */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">4. Reference Document / PDF URL (Optional)</label>
          <input
            type="url"
            placeholder="https://your-storage-url.com/document.pdf"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        {/* Step 4: Content */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="size-4 text-[#833b0c]" />
            <span>5. Note Content / Breakdown *</span>
          </label>
          <textarea
            rows={6}
            required
            placeholder="Type comprehensive explanations, formulas, and candidate revision notes..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        {statusMsg && (
          <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-bold border ${statusMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"}`}>
            {statusMsg.type === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <AlertCircle className="size-4 text-red-600" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Publish Study Note"}
        </button>
      </form>
    </div>
  );
}