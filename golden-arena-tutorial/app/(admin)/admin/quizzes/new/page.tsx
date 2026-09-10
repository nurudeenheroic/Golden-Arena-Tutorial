"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Calendar,
  Save,
  CheckCircle,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SubjectOption {
  id: string;
  name: string;
}

interface QuestionItem {
  id: string;
  text: string;
  subject_id?: string;
  topic?: string;
}

export default function AdminNewQuizPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionItem[]>([]);

  // Form State (Exact schema mappings)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);

  // Access & Pricing Flags
  const [isFreeTier, setIsFreeTier] = useState(true);
  const [price, setPrice] = useState(0);

  // Live Event Flags
  const [isMockExam, setIsMockExam] = useState(false);
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");

  // Question Selection State
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Filter Input Controls
  const [inputSubjectFilter, setInputSubjectFilter] = useState("");
  const [inputTopicFilter, setInputTopicFilter] = useState("");
  const [inputKeywordFilter, setInputKeywordFilter] = useState("");

  // Applied Filter State
  const [appliedFilters, setAppliedFilters] = useState({
    subject: "",
    topic: "",
    keyword: "",
  });

  // Notifications
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadFormData() {
      setLoading(true);
      const supabase = createClient();

      // 1. Fetch Subjects
      const { data: subs } = await supabase
        .from("subjects")
        .select("id, name")
        .order("name");
      if (subs) setSubjects(subs);

      // 2. Fetch Questions from Question Bank
      const { data: qData } = await supabase
        .from("questions")
        .select("id, text, subject_id, topic")
        .limit(300);
      if (qData) setAvailableQuestions(qData);

      setLoading(false);
    }

    loadFormData();
  }, []);

  // Sync Question Subject Filter dropdown when main subject selection changes
  useEffect(() => {
    if (subjectId) {
      setInputSubjectFilter(subjectId);
      setAppliedFilters((prev) => ({ ...prev, subject: subjectId }));
    }
  }, [subjectId]);

  // Extract all unique topics across available questions
  const availableTopics = Array.from(
    new Set(
      availableQuestions
        .filter((q) => !inputSubjectFilter || q.subject_id === inputSubjectFilter)
        .map((q) => q.topic)
        .filter((t): t is string => Boolean(t && t.trim() !== ""))
    )
  );

  const handleApplyFilters = () => {
    setAppliedFilters({
      subject: inputSubjectFilter,
      topic: inputTopicFilter,
      keyword: inputKeywordFilter,
    });
  };

  const handleResetFilters = () => {
    setInputSubjectFilter("");
    setInputTopicFilter("");
    setInputKeywordFilter("");
    setAppliedFilters({
      subject: "",
      topic: "",
      keyword: "",
    });
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  // Submit Handler: POSTs using exact database schema
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subjectId) {
      setStatusMsg({
        type: "error",
        text: "Please enter a quiz title and select a subject.",
      });
      return;
    }

    if (selectedQuestionIds.length === 0) {
      setStatusMsg({
        type: "error",
        text: "Please select at least 1 question from the Question Bank.",
      });
      return;
    }

    setStatusMsg(null);

    startTransition(async () => {
      try {
        const supabase = createClient();

        // 1. Insert Entry into `quizzes` Table (Using exact columns)
        const { data: quiz, error: quizErr } = await supabase
          .from("quizzes")
          .insert({
            title,
            description: description.trim() || null,
            subject_id: subjectId,
            time_limit: Number(timeLimit),
            is_free_tier: isFreeTier,
            price: isFreeTier ? 0 : Number(price),
            is_mock_exam: isMockExam,
            is_upcoming: isUpcoming,
            scheduled_for:
              isUpcoming && scheduledFor
                ? new Date(scheduledFor).toISOString()
                : null,
          })
          .select("id")
          .single();

        if (quizErr || !quiz) throw quizErr;

        // 2. Attach Selected Questions to quiz_questions junction table
        const junctionRecords = selectedQuestionIds.map((qId, index) => ({
          quiz_id: quiz.id,
          question_id: qId,
          order_index: index + 1,
        }));

        const { error: junctionErr } = await supabase
          .from("quiz_questions")
          .insert(junctionRecords);

        if (junctionErr) throw junctionErr;

        setStatusMsg({
          type: "success",
          text: "Quiz created successfully! Redirecting...",
        });

        setTimeout(() => {
          router.refresh();
          router.push("/admin/quizzes");
        }, 1200);
      } catch (err: any) {
        setStatusMsg({
          type: "error",
          text: err.message || "Failed to post new quiz.",
        });
      }
    });
  };

  // Matrix Filter Implementation
  const filteredQuestions = availableQuestions.filter((q) => {
    const matchesSubject =
      !appliedFilters.subject || appliedFilters.subject === ""
        ? true
        : q.subject_id === appliedFilters.subject;

    const matchesTopic =
      !appliedFilters.topic || appliedFilters.topic === ""
        ? true
        : q.topic?.toLowerCase().trim() === appliedFilters.topic.toLowerCase().trim();

    const matchesKeyword =
      !appliedFilters.keyword || appliedFilters.keyword.trim() === ""
        ? true
        : q.text.toLowerCase().includes(appliedFilters.keyword.toLowerCase().trim());

    return matchesSubject && matchesTopic && matchesKeyword;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin text-[#833b0c]" />
        <span>Loading Question Bank & Configs...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/quizzes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#833b0c] transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Quizzes</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Create New Quiz or Live Mock
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Configure parameters, access rules, and attach questions from the bank.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-3">
            1. Quiz Details & Duration
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Quiz Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. UTME Physics 2026 Speed Drill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              rows={2}
              placeholder="Brief summary or instructions for candidates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>

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
              <label className="text-xs font-bold text-slate-700">Time Limit (Minutes)</label>
              <input
                type="number"
                required
                min={5}
                max={180}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Access & Schedule Controls */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-3">
            2. Access Controls & Live Scheduling
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Access Tier</span>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="tier"
                    checked={isFreeTier}
                    onChange={() => setIsFreeTier(true)}
                    className="size-4 accent-[#833b0c]"
                  />
                  <span>Free Tier (All Candidates)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="tier"
                    checked={!isFreeTier}
                    onChange={() => setIsFreeTier(false)}
                    className="size-4 accent-[#833b0c]"
                  />
                  <span className="flex items-center gap-1 font-bold text-amber-900">
                    <Sparkles className="size-3.5 fill-amber-600 text-amber-600" /> Pro / Paid Only
                  </span>
                </label>
              </div>

              {!isFreeTier && (
                <div className="space-y-1 pt-2 border-t border-stone-200">
                  <label className="text-[11px] font-bold text-slate-600">Individual Purchase Price (₦)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-[#833b0c]"
                    placeholder="e.g. 1500"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-4 space-y-3">
              <span className="text-xs font-bold text-amber-950 block">Live Exam Options</span>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMockExam}
                  onChange={(e) => setIsMockExam(e.target.checked)}
                  className="size-4 accent-[#833b0c]"
                />
                <span className="text-xs font-bold text-amber-900">Flag as Major Mock Exam</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isUpcoming}
                  onChange={(e) => setIsUpcoming(e.target.checked)}
                  className="size-4 accent-[#833b0c]"
                />
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <Calendar className="size-3.5 text-amber-700" /> Schedule as Upcoming Live Event
                </span>
              </label>

              {isUpcoming && (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-amber-900">Scheduled Start Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full rounded-xl border border-amber-300 bg-white p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-[#833b0c]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Question Selection */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                3. Attach Questions ({selectedQuestionIds.length} Selected)
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure filters below and click &quot;Apply Filters&quot; to search the Question Bank.
              </p>
            </div>

            <span className="text-xs font-bold text-[#833b0c] bg-[#f9eee7] px-3 py-1 rounded-full border border-[#833b0c]/20 self-start sm:self-auto">
              Showing {filteredQuestions.length} of {availableQuestions.length} Questions
            </span>
          </div>

          {/* Filter Bar with Manual Apply Button */}
          <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Subject Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Filter className="size-3 text-[#833b0c]" /> Subject
                </label>
                <select
                  value={inputSubjectFilter}
                  onChange={(e) => setInputSubjectFilter(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white p-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#833b0c]"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Filter className="size-3 text-[#833b0c]" /> Topic
                </label>
                <select
                  value={inputTopicFilter}
                  onChange={(e) => setInputTopicFilter(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white p-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#833b0c]"
                >
                  <option value="">All Topics</option>
                  {availableTopics.map((top) => (
                    <option key={top} value={top}>
                      {top}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Search className="size-3 text-[#833b0c]" /> Keyword Search
                </label>
                <input
                  type="text"
                  value={inputKeywordFilter}
                  onChange={(e) => setInputKeywordFilter(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyFilters();
                    }
                  }}
                  placeholder="Type keyword & press Enter..."
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#833b0c]"
                />
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/60">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-stone-100 transition cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-slate-400" />
                <span>Reset Filters</span>
              </button>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#6e310a] transition cursor-pointer shadow-2xs"
              >
                <Filter className="size-3.5" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          {/* Question List View */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium space-y-2">
                <p>No questions found matching your applied filter criteria.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#833b0c] font-bold underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);

                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionSelection(q.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? "border-[#833b0c] bg-[#f9eee7]/60 text-slate-900 font-bold"
                        : "border-stone-200 bg-stone-50/50 text-slate-700 hover:bg-stone-100"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <CheckCircle className="size-4 text-[#833b0c]" />
                      ) : (
                        <div className="size-4 rounded-full border border-stone-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="leading-relaxed">{q.text}</p>
                      {q.topic && (
                        <span className="inline-block text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          Topic: {q.topic}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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

        {/* Final Submit Button */}
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
          <span>{isPending ? "Creating Quiz..." : "Save & Publish Quiz"}</span>
        </button>
      </form>
    </div>
  );
}