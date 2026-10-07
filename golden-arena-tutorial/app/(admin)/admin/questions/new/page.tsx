"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SubjectOption = { id: string; name: string };

export default function NewQuestionPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [text, setText] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [questionCode, setQuestionCode] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [year, setYear] = useState(2026);
  
  // Image states
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Handle direct file upload to Supabase Storage
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `question_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("question-images")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("question-images")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to upload image file." });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !subjectId || !optionA || !optionB || !optionC || !optionD) {
      setStatusMsg({ type: "error", text: "Please fill in the question text, subject, and all 4 options." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();
      const optionsArray = [optionA, optionB, optionC, optionD];

      const { error } = await supabase.from("questions").insert({
        text,
        subject_id: subjectId,
        question_code: questionCode || null,
        options: optionsArray,
        correct_answer: correctAnswer,
        explanation: explanation || null,
        difficulty,
        year: Number(year),
        image_url: imageUrl || null, // Saved to database
      });

      if (error) throw error;

      setStatusMsg({ type: "success", text: "Question created and saved to bank!" });
      setTimeout(() => router.push("/questions"), 1200);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to create question." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/questions" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c]">
        <ArrowLeft className="size-4" />
        <span>Back to Question Bank</span>
      </Link>

      <div>
        <h1 className="text-xl font-black text-slate-900">Create New Question</h1>
        <p className="text-xs text-slate-500">Add a single question with options, step-by-step explanation, and optional diagrams.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
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
            <label className="text-xs font-bold text-slate-700">Question Code (Optional)</label>
            <input
              type="text"
              placeholder="e.g. PHY-2026-01"
              value={questionCode}
              onChange={(e) => setQuestionCode(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Question Prompt Text</label>
          <textarea
            required
            rows={3}
            placeholder="Type question prompt here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        {/* Question Image / Diagram Section */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ImageIcon className="size-4 text-[#833b0c]" />
            <span>Question Diagram / Image (Optional)</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 space-y-2 w-full">
              <input
                type="url"
                placeholder="Paste direct image URL or upload file..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
              />
              
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-stone-100 transition">
                  <Upload className="size-3.5 text-[#833b0c]" />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                {uploadingImage && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#833b0c]">
                    <Loader2 className="size-3.5 animate-spin" /> Uploading...
                  </span>
                )}
              </div>
            </div>

            {/* Live Image Preview Thumbnail */}
            {imageUrl && (
              <div className="relative size-24 rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
                <img src={imageUrl} alt="Question preview" className="h-full w-full object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-1 right-1 bg-rose-600 text-white rounded-full size-5 text-[10px] font-bold flex items-center justify-center hover:bg-rose-700 transition cursor-pointer"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Options Input Grid */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <span className="text-xs font-bold text-slate-800">Answer Choices</span>
          
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Option A"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
            <input
              type="text"
              required
              placeholder="Option B"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className="rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
            <input
              type="text"
              required
              placeholder="Option C"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              className="rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
            <input
              type="text"
              required
              placeholder="Option D"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              className="rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Correct Key</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Exam Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Detailed Explanation (Optional)</label>
          <textarea
            rows={3}
            placeholder="Step-by-step breakdown explaining why the key is correct..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
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
          disabled={isSubmitting || uploadingImage}
          className="w-full rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save Question to Bank"}
        </button>
      </form>
    </div>
  );
}