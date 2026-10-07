"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SubjectOption = { id: string; name: string };
type StagedImage = {
  file: File;
  previewUrl: string;
  title: string;
};

export default function NewMnemonicPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [topicName, setTopicName] = useState("");
  
  // Staged list of multiple images to upload
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
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

  // Handle selecting multiple image files
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newStaged: StagedImage[] = Array.from(files).map((file) => {
      // Default title from filename without extension
      const defaultTitle = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        title: defaultTitle,
      };
    });

    setStagedImages((prev) => [...prev, ...newStaged]);
    // Reset file input value so selecting the same files again triggers onChange
    e.target.value = "";
  };

  // Update title for a specific staged image
  const handleTitleChange = (index: number, newTitle: string) => {
    setStagedImages((prev) => {
      const updated = [...prev];
      updated[index].title = newTitle;
      return updated;
    });
  };

  // Remove a staged image from the batch
  const handleRemoveStaged = (index: number) => {
    setStagedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Bulk upload and save batch
  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !topicName || stagedImages.length === 0) {
      setStatusMsg({ type: "error", text: "Please select a subject, enter a topic, and stage at least one image." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();

      for (const item of stagedImages) {
        const fileExt = item.file.name.split(".").pop();
        const fileName = `mnemonic_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `notes/${fileName}`;

        // Upload to 'question-images' bucket (ensure this bucket exists and is public in Supabase)
        const { error: uploadError } = await supabase.storage
          .from("question-images")
          .upload(filePath, item.file);

        if (uploadError) {
          throw new Error(`Upload failed for ${item.title}: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from("question-images")
          .getPublicUrl(filePath);

        // Insert record into study_notes database
        const { error: dbError } = await supabase.from("study_notes").insert({
          title: item.title.trim() || "Untitled Mnemonic",
          subject_id: subjectId,
          topic_name: topicName.trim(),
          image_url: publicUrl,
          is_mnemonic: true,
        });

        if (dbError) {
          throw new Error(`Database save failed for ${item.title}: ${dbError.message}`);
        }
      }

      setStatusMsg({ type: "success", text: `Successfully uploaded ${stagedImages.length} mnemonic(s) under section: ${topicName}!` });
      setTimeout(() => router.push("/admin/notes/mnemonics"), 1500);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to complete batch upload." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/notes" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c]">
        <ArrowLeft className="size-4" />
        <span>Back to Hub</span>
      </Link>

      <div>
        <h1 className="text-xl font-black text-slate-900">Batch Upload Visual Mnemonics</h1>
        <p className="text-xs text-slate-500">Select shared options once, then stage and upload multiple diagram charts or memory aids at once.</p>
      </div>

      <form onSubmit={handleSubmitBatch} className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
        
        {/* Step 1: Shared Options */}
        <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
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
              placeholder="e.g. Chemical Bonding & Structures"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-semibold outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>

        {/* Step 2: Multi-File Picker */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ImageIcon className="size-4 text-[#833b0c]" />
            <span>3. Select Image Files (Multiple allowed) *</span>
          </label>

          <label className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-6 text-xs font-bold text-slate-600 hover:border-[#833b0c] transition">
            <Upload className="size-6 text-[#833b0c]" />
            <span>Click to select one or more images</span>
            <span className="text-[10px] text-slate-400 font-normal">PNG, JPG, WebP supported</span>
            <input type="file" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" />
          </label>
        </div>

        {/* Step 3: Staged Images Preview & Title Customization */}
        {stagedImages.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              Staged Files for Upload ({stagedImages.length})
            </h3>

            <div className="grid gap-3">
              {stagedImages.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <div className="size-16 rounded-xl bg-white border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <img src={item.previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Mnemonic Title #{idx + 1}</label>
                    <input
                      type="text"
                      required
                      value={item.title}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs font-medium outline-none focus:border-[#833b0c]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStaged(idx)}
                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer self-center"
                    title="Remove item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {statusMsg && (
          <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-bold border ${statusMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"}`}>
            {statusMsg.type === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <AlertCircle className="size-4 text-red-600" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || stagedImages.length === 0}
          className="w-full rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Uploading Batch...</span>
            </>
          ) : (
            <span>Publish All Staged Mnemonics ({stagedImages.length})</span>
          )}
        </button>
      </form>
    </div>
  );
}