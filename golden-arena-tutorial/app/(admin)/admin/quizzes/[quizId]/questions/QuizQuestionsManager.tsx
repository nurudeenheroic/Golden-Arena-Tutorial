"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Quiz {
  id: string;
  title: string;
  subject_id?: string;
  subjects?: { name?: string } | null;
}

interface Question {
  id: string;
  text: string;
  options?: string[];
  correct_answer?: string;
  topic?: string;
  explanation?: string;
}

export default function QuizQuestionsManagerClient({
  quiz,
  attachedQuestions: initialQuestions = [],
  availableQuestions: initialAvailable = [],
}: {
  quiz?: Quiz;
  attachedQuestions?: Question[];
  availableQuestions?: Question[];
}) {
  const [attachedQuestions, setAttachedQuestions] =
    useState<Question[]>(initialQuestions);
  const [availableQuestions, setAvailableQuestions] =
    useState<Question[]>(initialAvailable);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const subjectName = quiz?.subjects?.name ?? "General";
  const quizTitle = quiz?.title ?? "Quiz";

  // Filter attached questions by keyword
  const filteredAttached = attachedQuestions.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  // Remove question from quiz junction
  const handleRemoveQuestion = async (questionId: string) => {
    if (!quiz?.id) return;
    setLoadingId(questionId);
    const supabase = createClient();

    const { error } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("quiz_id", quiz.id)
      .eq("question_id", questionId);

    if (error) {
      alert(`Failed to remove question: ${error.message}`);
    } else {
      const removed = attachedQuestions.find((q) => q.id === questionId);
      setAttachedQuestions((prev) => prev.filter((q) => q.id !== questionId));
      if (removed) {
        setAvailableQuestions((prev) => [removed, ...prev]);
      }
    }
    setLoadingId(null);
  };

  // Attach question to quiz junction
  const handleAttachQuestion = async (q: Question) => {
    if (!quiz?.id) return;
    setLoadingId(q.id);
    const supabase = createClient();

    const { error } = await supabase
      .from("quiz_questions")
      .insert({ quiz_id: quiz.id, question_id: q.id });

    if (error) {
      alert(`Failed to add question: ${error.message}`);
    } else {
      setAvailableQuestions((prev) => prev.filter((item) => item.id !== q.id));
      setAttachedQuestions((prev) => [...prev, q]);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/quizzes/${quiz?.id ?? ""}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#833b0c] transition mb-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Quiz Overview</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="rounded-lg bg-[#f9eee7] px-2.5 py-1 text-[10px] font-black text-[#833b0c] uppercase">
              {subjectName}
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {quizTitle}: Question Selector
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Attach or detach practice items for this examination drill.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attached questions..."
              className="w-full rounded-xl border border-stone-200 bg-white pl-8 pr-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>
        </div>
      </div>

      {/* Section 1: Attached Questions Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="size-4 text-[#833b0c]" />
          <span>Attached Questions ({filteredAttached.length})</span>
        </h2>

        {filteredAttached.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAttached.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 hover:border-[#833b0c]/30 transition shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="text-slate-400 font-bold">#{idx + 1}</span>
                    {q.correct_answer && (
                      <span className="text-emerald-700 font-extrabold">
                        Key: {q.correct_answer}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {q.text}
                  </p>

                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border text-xs font-medium ${
                            q.correct_answer &&
                            opt.trim() === q.correct_answer.trim()
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                              : "bg-stone-50 border-stone-200 text-slate-700"
                          }`}
                        >
                          <span className="text-slate-400 font-bold uppercase mr-1">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <p className="text-[11px] text-slate-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <strong className="text-[#833b0c]">Explanation:</strong>{" "}
                      {q.explanation}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <Link
                    href={`/admin/questions/${q.id}`}
                    className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-[#833b0c]"
                  >
                    <Pencil className="size-3 text-slate-400" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    disabled={loadingId === q.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    {loadingId === q.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Trash2 className="size-3 text-rose-600" />
                    )}
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-xs font-bold text-slate-400">
            No questions currently attached to this quiz matching your search query.
          </div>
        )}
      </div>

      {/* Section 2: Available Unattached Questions Grid */}
      {availableQuestions.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-stone-200">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Plus className="size-4 text-[#833b0c]" />
            <span>Available Bank Questions ({availableQuestions.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {availableQuestions.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 space-y-4 hover:border-stone-300 transition shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {q.text}
                  </p>

                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-1.5">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-slate-700"
                        >
                          <span className="text-slate-400 font-bold uppercase mr-1">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-200/80 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleAttachQuestion(q)}
                    disabled={loadingId === q.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#6f300a] transition disabled:opacity-50 cursor-pointer"
                  >
                    {loadingId === q.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Plus className="size-3.5" />
                    )}
                    <span>Add to Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}