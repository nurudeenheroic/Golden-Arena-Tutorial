"use client";

import { useState, useEffect, useTransition, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SubjectOption {
  id: string;
  name: string;
}

interface PageProps {
  params: Promise<{ questionId: string }>;
}

export default function AdminEditQuestionPage({ params }: PageProps) {
  const { questionId } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  // Question Form State
  const [text, setText] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [explanation, setExplanation] = useState("");

  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadQuestionData() {
      setLoading(true);
      const supabase = createClient();

      // 1. Fetch Subjects
      const { data: subs } = await supabase
        .from("subjects")
        .select("id, name")
        .order("name");
      if (subs) setSubjects(subs);

      // 2. Fetch Existing Question Data
      const { data: q, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (error || !q) {
        setStatusMsg({
          type: "error",
          text: "Failed to load question details or question not found.",
        });
        setLoading(false);
        return;
      }

      // Prefill text, subject, topic, options, explanation
      setText(q.text || "");
      setSubjectId(q.subject_id || "");
      setTopic(q.topic || "");
      const loadedOptions =
        Array.isArray(q.options) && q.options.length > 0
          ? q.options
          : ["", "", "", ""];
      setOptions(loadedOptions);
      setExplanation(q.explanation || "");

      // Match string `correct_answer` to options index
      if (q.correct_answer) {
        const foundIdx = loadedOptions.findIndex(
          (opt) => opt.trim() === q.correct_answer.trim()
        );
        setCorrectOption(foundIdx !== -1 ? foundIdx : 0);
      } else {
        setCorrectOption(0);
      }

      setLoading(false);
    }

    loadQuestionData();
  }, [questionId]);

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const addOptionField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionField = (index: number) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    if (correctOption >= updated.length) {
      setCorrectOption(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || !subjectId) {
      setStatusMsg({
        type: "error",
        text: "Please enter the question text and select a subject.",
      });
      return;
    }

    if (options.some((o) => !o.trim())) {
      setStatusMsg({
        type: "error",
        text: "Please ensure all option fields are filled out.",
      });
      return;
    }

    setStatusMsg(null);

    startTransition(async () => {
      try {
        const supabase = createClient();

        // Convert selected radio index back to option text string
        const correctAnswerText = options[correctOption] || options[0];

        const { error } = await supabase
          .from("questions")
          .update({
            text: text.trim(),
            subject_id: subjectId,
            topic: topic.trim() || null,
            options,
            correct_answer: correctAnswerText,
            explanation: explanation.trim() || null,
          })
          .eq("id", questionId);

        if (error) throw error;

        setStatusMsg({
          type: "success",
          text: "Question updated successfully!",
        });

        setTimeout(() => {
          router.refresh();
          if (subjectId) {
            router.push(`/admin/subjects/${subjectId}`);
          } else {
            router.push("/admin/questions");
          }
        }, 1000);
      } catch (err: any) {
        setStatusMsg({
          type: "error",
          text: err.message || "Failed to update question.",
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin text-[#833b0c]" />
        <span>Loading Question Details...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={subjectId ? `/admin/subjects/${subjectId}` : "/admin/questions"}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#833b0c] transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Question Bank</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">Edit Question</h1>
        <p className="text-xs text-slate-500 font-medium">
          Modify question text, multiple choice options, correct answer, and explanation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
          {/* Question Text */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Question Text *</label>
            <textarea
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. What is the SI unit of electric current?"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>

          {/* Subject & Topic Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Subject *</label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
              >
                <option value="">Select Subject...</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Topic / Tag</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Current Electricity"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
              />
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Answer Options (Select the radio corresponding to the correct answer)
              </label>
              <button
                type="button"
                onClick={addOptionField}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#833b0c] hover:underline cursor-pointer"
              >
                <Plus className="size-3" />
                <span>Add Option</span>
              </button>
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_option"
                    checked={correctOption === idx}
                    onChange={() => setCorrectOption(idx)}
                    className="size-4 accent-[#833b0c] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-400 uppercase w-4">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}...`}
                    className="flex-1 rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOptionField(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-slate-700">Detailed Explanation</label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Step-by-step solution or mnemonic for candidates..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-bold border ${
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-[#833b0c] py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#6e310a] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span>{isPending ? "Saving Changes..." : "Save Question Changes"}</span>
        </button>
      </form>
    </div>
  );
}