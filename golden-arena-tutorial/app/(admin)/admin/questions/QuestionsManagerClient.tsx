"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Upload,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface QuestionItem {
  id: string;
  question_code?: string;
  text: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty?: string;
  year?: number | string;
  topic?: string;
  subject_id?: string;
  subjects?: { name?: string; track?: string } | null;
}

interface SubjectItem {
  id: string;
  name: string;
  track: string;
}

export default function QuestionsManagerClient({
  initialQuestions,
  subjects,
}: {
  initialQuestions: QuestionItem[];
  subjects: SubjectItem[];
}) {
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [search, setSearch] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter subjects based on selected track
  const filteredSubjects = selectedTrack
    ? subjects.filter(
        (s) => s.track?.toLowerCase() === selectedTrack.toLowerCase()
      )
    : subjects;

  // Extract unique topics from questions matching subject/track filter
  const uniqueTopics = Array.from(
    new Set(
      questions
        .filter((q) => {
          if (selectedSubjectId && q.subject_id !== selectedSubjectId)
            return false;
          if (
            selectedTrack &&
            q.subjects?.track?.toLowerCase() !== selectedTrack.toLowerCase()
          )
            return false;
          return true;
        })
        .map((q) => q.topic)
        .filter((t): t is string => Boolean(t && t.trim() !== ""))
    )
  );

  // Apply all search and filter conditions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      (q.question_code &&
        q.question_code.toLowerCase().includes(search.toLowerCase()));

    const matchesTrack =
      !selectedTrack ||
      q.subjects?.track?.toLowerCase() === selectedTrack.toLowerCase();

    const matchesSubject =
      !selectedSubjectId || q.subject_id === selectedSubjectId;

    const matchesTopic =
      !selectedTopic ||
      q.topic?.toLowerCase().trim() === selectedTopic.toLowerCase().trim();

    return matchesSearch && matchesTrack && matchesSubject && matchesTopic;
  });

  // Handle Question Deletion
  const handleDeleteQuestion = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(id);
    const supabase = createClient();

    // 1. Clear junction references if any
    await supabase.from("quiz_questions").delete().eq("question_id", id);

    // 2. Delete main question record
    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      alert(`Failed to delete question: ${error.message}`);
    } else {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }

    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Question Bank</h1>
          <p className="text-xs text-slate-500">
            Master repository of UTME practice questions, answers, and solutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/questions/csv-upload"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 transition"
          >
            <Upload className="size-3.5 text-[#833b0c]" />
            <span>Upload CSV</span>
          </Link>

          <Link
            href="/admin/questions/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>New Question</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Filters Bar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
          <Filter className="size-3.5 text-[#833b0c]" />
          <span>Filter Questions ({filteredQuestions.length})</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword or Q#..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>

          {/* Track Filter */}
          <select
            value={selectedTrack}
            onChange={(e) => {
              setSelectedTrack(e.target.value);
              setSelectedSubjectId("");
              setSelectedTopic("");
            }}
            className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
          >
            <option value="">All Tracks</option>
            <option value="science">Science</option>
            <option value="arts">Arts / Humanities</option>
            <option value="commercial">Commercial</option>
            <option value="general">General</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedTopic("");
            }}
            className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
          >
            <option value="">All Subjects</option>
            {filteredSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.track})
              </option>
            ))}
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
          >
            <option value="">All Topics</option>
            {uniqueTopics.map((top) => (
              <option key={top} value={top}>
                {top}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Grid Layout */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredQuestions.map((q, idx) => {
            const subjectName = q.subjects?.name ?? "General";
            const trackName = q.subjects?.track ?? "general";

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 hover:border-[#833b0c]/30 transition shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header Meta */}
                  <div className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-[#f9eee7] px-2 py-0.5 text-[#833b0c] font-black uppercase text-[10px]">
                        {subjectName} ({trackName})
                      </span>
                      <span className="text-emerald-700 font-extrabold">
                        Key: {q.correct_answer}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap text-slate-400 text-[10px]">
                      <span>{q.question_code ?? `Q#${idx + 1}`}</span>
                      {q.topic && (
                        <span className="text-slate-600 font-semibold truncate max-w-[150px]">
                          • {q.topic}
                        </span>
                      )}
                      {q.year && <span>• {q.year}</span>}
                      <span className="capitalize">• {q.difficulty ?? "Medium"}</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {q.text}
                  </p>

                  {/* Multiple Choice Options Grid */}
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border text-xs font-medium ${
                            opt.trim() === q.correct_answer?.trim()
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

                  {/* Explanation */}
                  {q.explanation && (
                    <p className="text-[11px] text-slate-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <strong className="text-[#833b0c]">Explanation:</strong>{" "}
                      {q.explanation}
                    </p>
                  )}
                </div>

                {/* Bottom Actions Footer */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <Link
                    href={`/admin/questions/${q.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-stone-100 transition cursor-pointer"
                  >
                    <Pencil className="size-3 text-slate-500" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    disabled={deletingId === q.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    {deletingId === q.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Trash2 className="size-3 text-rose-600" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-2">
          <HelpCircle className="mx-auto size-8 text-slate-300" />
          <p className="text-xs font-bold text-slate-700">
            No questions found in the bank matching your filters.
          </p>
          <p className="text-[11px] text-slate-400">
            Try adjusting your track, subject, topic, or search parameters.
          </p>
        </div>
      )}
    </div>
  );
}