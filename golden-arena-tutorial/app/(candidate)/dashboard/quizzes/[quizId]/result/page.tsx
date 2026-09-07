// app/(candidate)/dashboard/quizzes/[quizId]/result/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Award, BookOpen } from "lucide-react";

export const revalidate = 0;

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Fetch latest attempt for this quiz
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (!attempt) redirect(`/dashboard/quizzes`);

  // 2. Fetch quiz details & question key
  const { data: quizData } = await supabase
    .from("quizzes")
    .select(`
      title,
      quiz_questions (
        questions (
          id,
          text,
          options,
          correct_answer,
          explanation
        )
      )
    `)
    .eq("id", quizId)
    .single();

  const answersGiven = (attempt.answers_given as Record<string, string>) || {};
  const questionsList =
    quizData?.quiz_questions.map((qq) => qq.questions as unknown as {
      id: string;
      text: string;
      options: string[];
      correct_answer: string;
      explanation: string;
    }) ?? [];

  const percentageScore = Math.round(
    (attempt.score / attempt.total_questions) * 100
  );

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 space-y-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/quizzes"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#833b0c]"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Quizzes</span>
        </Link>
      </div>

      {/* Score Summary Card */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <h1 className="text-xl font-black text-slate-900">{quizData?.title}</h1>
        
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Score</span>
            <p className="text-2xl font-black text-slate-900">{percentageScore}%</p>
            <p className="text-[10px] text-slate-500">{attempt.score} / {attempt.total_questions} Correct</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Correct</span>
            <p className="text-2xl font-black text-emerald-900">{attempt.score}</p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
            <span className="text-[10px] font-bold text-red-700 uppercase">Incorrect / Skipped</span>
            <p className="text-2xl font-black text-red-900">{attempt.total_questions - attempt.score}</p>
          </div>
        </div>
      </section>

      {/* Itemized Question Explanations */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="size-4 text-[#833b0c]" />
          <span>Question Review & Explanations</span>
        </h2>

        {questionsList.map((q, idx) => {
          const userAns = answersGiven[q.id];
          const isCorrect = userAns?.trim() === q.correct_answer?.trim();

          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 space-y-3 bg-white ${
                isCorrect ? "border-emerald-200" : "border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Question {idx + 1}</span>
                {isCorrect ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="size-3" /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800">
                    <XCircle className="size-3" /> Incorrect
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-slate-900">{q.text}</p>

              {/* Options list */}
              <div className="grid sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, i) => {
                  const isKey = opt.trim() === q.correct_answer?.trim();
                  const isUserChoice = opt.trim() === userAns?.trim();

                  let style = "border-stone-200 bg-stone-50 text-slate-700";
                  if (isKey) style = "border-emerald-500 bg-emerald-50 font-bold text-emerald-900";
                  else if (isUserChoice && !isKey) style = "border-red-300 bg-red-50 text-red-900";

                  return (
                    <div key={i} className={`rounded-xl border p-3 text-xs flex justify-between ${style}`}>
                      <span>{opt}</span>
                      {isKey && <span className="text-[10px] font-bold text-emerald-700">Correct Key</span>}
                      {isUserChoice && !isKey && <span className="text-[10px] font-bold text-red-700">Your Answer</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="rounded-xl bg-[#f9eee7]/50 p-3 text-xs text-slate-700 border border-[#833b0c]/20">
                  <span className="block font-bold text-[#833b0c] text-[10px] uppercase">Explanation</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}