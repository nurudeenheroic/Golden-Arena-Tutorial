"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  BookOpen,
  Search,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Subject {
  id: string;
  name: string;
  track: string;
}

interface NotePreview {
  id: string;
  title: string;
  topic?: string;
}

interface Question {
  id: string;
  text: string;
  options?: string[];
  correct_answer?: string;
  topic?: string;
  explanation?: string;
}

export default function SubjectDetailClient({
  subject,
  notesCount,
  notesPreview,
  quizzesCount,
  questions: initialQuestions,
}: {
  subject: Subject;
  notesCount: number;
  notesPreview: NotePreview[];
  quizzesCount: number;
  questions: Question[];
}) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique topics from the subject's question bank
  const uniqueTopics = Array.from(
    new Set(
      questions
        .map((q) => q.topic)
        .filter((t): t is string => Boolean(t && t.trim() !== ""))
    )
  );

  // Filter questions dynamically by keyword and topic
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchesTopic =
      !selectedTopic || selectedTopic === ""
        ? true
        : q.topic?.toLowerCase().trim() === selectedTopic.toLowerCase().trim();

    return matchesSearch && matchesTopic;
  });

  // Delete Question Handler
  const handleDeleteQuestion = async (questionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(questionId);
    const supabase = createClient();

    // 1. Remove junction references if any exist
    await supabase.from("quiz_questions").delete().eq("question_id", questionId);

    // 2. Delete question from database
    const { error } = await supabase.from("questions").delete().eq("id", questionId);

    if (error) {
      alert(`Failed to delete question: ${error.message}`);
    } else {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    }

    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/subjects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#833b0c] transition mb-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Subjects</span>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900">{subject.name}</h1>
          <span className="rounded-lg bg-[#f9eee7] px-2.5 py-1 text-[10px] font-bold text-[#833b0c] uppercase">
            {subject.track}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Subject performance analytics, study resources, and question bank management.
        </p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Study Notes Card */}
        <Link
          href={`/admin/notes?subject=${subject.id}`}
          className="group rounded-3xl border border-stone-200 bg-white p-6 space-y-3 shadow-2xs hover:border-[#833b0c]/40 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Study Notes & Mnemonics
            </span>
            <FileText className="size-5 text-[#833b0c] group-hover:scale-110 transition-transform" />
          </div>

          <div>
            <p className="text-3xl font-black text-slate-900">{notesCount}</p>
            <p className="text-xs text-slate-400 font-medium">Available study guides</p>
          </div>

          {/* Notes Preview List */}
          {notesPreview.length > 0 && (
            <div className="pt-2 border-t border-stone-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Recent Guides:
              </span>
              <ul className="text-xs text-slate-600 font-medium space-y-0.5">
                {notesPreview.map((n) => (
                  <li key={n.id} className="truncate flex items-center gap-1.5">
                    <Sparkles className="size-3 text-[#833b0c] shrink-0" />
                    <span>{n.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 flex items-center text-xs font-bold text-[#833b0c] group-hover:underline gap-1">
            <span>Manage Study Notes</span>
            <ArrowRight className="size-3.5" />
          </div>
        </Link>

        {/* Quizzes Card */}
        <Link
          href={`/admin/quizzes?subjectId=${subject.id}`}
          className="group rounded-3xl border border-stone-200 bg-white p-6 space-y-3 shadow-2xs hover:border-[#833b0c]/40 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Subject Quizzes & Drills
            </span>
            <BookOpen className="size-5 text-[#833b0c] group-hover:scale-110 transition-transform" />
          </div>

          <div>
            <p className="text-3xl font-black text-slate-900">{quizzesCount}</p>
            <p className="text-xs text-slate-400 font-medium">
              Published assessments under {subject.name}
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-bold text-[#833b0c] group-hover:underline gap-1">
            <span>View Filtered Quizzes</span>
            <ArrowRight className="size-3.5" />
          </div>
        </Link>
      </div>

      {/* Question Bank Header & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="size-4 text-[#833b0c]" />
              <span>Question Bank ({filteredQuestions.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Browse, filter, edit, or remove practice questions registered for {subject.name}.
            </p>
          </div>

          {/* Actions: Add New Question Button */}
          <Link
            href={`/admin/questions/new?subjectId=${subject.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add New Question</span>
          </Link>
        </div>

        {/* Search & Topic Filters Bar */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
            <Filter className="size-3.5 text-[#833b0c]" />
            <span>Search & Topic Filter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search question text..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
              />
            </div>

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

        {/* Responsive Question Grid */}
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 hover:border-[#833b0c]/30 transition shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header Meta */}
                  <div className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-[#f9eee7] px-2 py-0.5 text-[#833b0c] font-black uppercase text-[10px]">
                        {subject.name}
                      </span>
                      {q.correct_answer && (
                        <span className="text-emerald-700 font-extrabold">
                          Key: {q.correct_answer}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <span>#{idx + 1}</span>
                      {q.topic && (
                        <span className="text-slate-600 font-semibold truncate max-w-[180px]">
                          • Topic: {q.topic}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {q.text}
                  </p>

                  {/* Options List */}
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border text-xs font-medium ${
                            q.correct_answer && opt.trim() === q.correct_answer.trim()
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
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-2">
            <HelpCircle className="mx-auto size-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-700">
              No questions found for {subject.name} matching your filter.
            </p>
            <p className="text-[11px] text-slate-400">
              Click &quot;Add New Question&quot; above to create one or adjust your topic search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}