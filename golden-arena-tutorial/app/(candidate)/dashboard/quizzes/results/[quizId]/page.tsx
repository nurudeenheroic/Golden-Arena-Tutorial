import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  ArrowLeft,
  RotateCcw,
  HelpCircle,
  MinusCircle,
} from "lucide-react";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizResultsPage({ params }: PageProps) {
  const { quizId: rawParam } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Try lookup by Attempt ID
  let { data: attempt } = await supabase
    .from("quiz_attempts")
    .select(`
      id,
      score,
      total_questions,
      time_taken_sec,
      created_at,
      quiz_id,
      quizzes (
        id,
        title
      )
    `)
    .eq("id", rawParam)
    .eq("user_id", user.id)
    .maybeSingle();

  // 2. Fallback: Lookup latest attempt by Quiz ID
  if (!attempt) {
    const { data: attemptByQuiz } = await supabase
      .from("quiz_attempts")
      .select(`
        id,
        score,
        total_questions,
        time_taken_sec,
        created_at,
        quiz_id,
        quizzes (
          id,
          title
        )
      `)
      .eq("quiz_id", rawParam)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    attempt = attemptByQuiz;
  }

  if (!attempt) {
    redirect("/dashboard/quizzes");
  }

  // 3. Fetch Itemized Answers
  const { data: userAnswers } = await supabase
    .from("user_answers")
    .select(`
      id,
      selected_option,
      is_correct,
      question_id,
      questions (
        id,
        text,
        options,
        correct_answer,
        explanation
      )
    `)
    .eq("attempt_id", attempt.id)
    .eq("user_id", user.id);

  // Score & Metrics Calculations
  const score = attempt.score ?? 0; // Correct Count (e.g. 5)
  const totalQuestions = attempt.total_questions ?? 1; // True Total (e.g. 40)
  const percentage = Math.round((score / totalQuestions) * 100);
  const timeTakenSec = attempt.time_taken_sec ?? 0;

  const attemptedCount = userAnswers?.length ?? 0; // Total answered (e.g. 6)
  const incorrectCount = attemptedCount - score; // Incorrect answered (e.g. 1)
  const unattemptedCount = Math.max(totalQuestions - attemptedCount, 0); // Unattempted (e.g. 34)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 space-y-8">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/quizzes"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Quizzes</span>
        </Link>
        <span className="text-xs font-semibold text-slate-400">
          Attempt ID: {attempt.id.slice(0, 8)}...
        </span>
      </div>

      {/* Overview Card */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase text-[#833b0c]">
              Quiz Performance
            </span>
            <h1 className="text-2xl font-black text-slate-900">
              {(attempt.quizzes as any)?.title || "Assessment Summary"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/quizzes/${attempt.quiz_id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-stone-200 transition cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>Retake Quiz</span>
            </Link>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-5 text-center space-y-1">
            <Trophy className="size-5 text-amber-600 mx-auto" />
            <span className="block text-xs font-semibold text-slate-500">Overall Score</span>
            <p className="text-2xl font-black text-slate-900">
              {score} / {totalQuestions}
              <span className="ml-2 text-sm font-bold text-slate-500">
                ({percentage}%)
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-5 text-center space-y-1">
            <Clock className="size-5 text-blue-600 mx-auto" />
            <span className="block text-xs font-semibold text-slate-500">Time Spent</span>
            <p className="text-2xl font-black text-slate-900">{formatTime(timeTakenSec)}</p>
          </div>
        </div>

        {/* Detailed Breakdown Metrics (Correct, Incorrect, Unattempted) */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-center space-y-1">
            <CheckCircle2 className="size-4 text-emerald-600 mx-auto" />
            <span className="block text-[11px] font-bold uppercase text-emerald-800">Correct</span>
            <p className="text-xl font-black text-emerald-900">{score}</p>
          </div>

          <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-4 text-center space-y-1">
            <XCircle className="size-4 text-rose-600 mx-auto" />
            <span className="block text-[11px] font-bold uppercase text-rose-800">Incorrect</span>
            <p className="text-xl font-black text-rose-900">{incorrectCount}</p>
          </div>

          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 text-center space-y-1">
            <MinusCircle className="size-4 text-amber-600 mx-auto" />
            <span className="block text-[11px] font-bold uppercase text-amber-800">Unattempted</span>
            <p className="text-xl font-black text-amber-900">{unattemptedCount}</p>
          </div>
        </div>
      </div>

      {/* Itemized Question Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">Attempted Questions Review</h2>

        {!userAnswers || userAnswers.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center text-xs text-slate-500">
            No questions were attempted during this session.
          </div>
        ) : (
          userAnswers.map((ua: any, index: number) => {
            const q = ua.questions;
            if (!q) return null;

            return (
              <div
                key={ua.id}
                className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs"
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-400">
                    Question #{index + 1}
                  </span>
                  {ua.is_correct ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="size-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                      <XCircle className="size-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <p className="text-sm font-bold text-slate-900">{q.text}</p>

                {/* Options List */}
                <div className="grid gap-2 pt-1">
                  {(q.options || []).map((opt: string, i: number) => {
                    const isSelected = ua.selected_option === opt;
                    const isCorrectOption =
                      String(opt).trim().toLowerCase() ===
                      String(q.correct_answer).trim().toLowerCase();

                    let optionStyle = "border-stone-200 bg-white text-slate-700";

                    if (isCorrectOption) {
                      optionStyle =
                        "border-emerald-300 bg-emerald-50 text-emerald-900 font-bold";
                    } else if (isSelected && !ua.is_correct) {
                      optionStyle =
                        "border-rose-300 bg-rose-50 text-rose-900 font-bold";
                    }

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl border p-3.5 text-xs transition ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                              Your Choice
                            </span>
                          )}
                          {isCorrectOption && (
                            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 p-4 space-y-1 text-amber-950">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <HelpCircle className="size-4 text-amber-700" />
                      <span>Explanation</span>
                    </div>
                    <p className="text-xs leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}