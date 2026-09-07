// app/(candidate)/dashboard/quizzes/[quizId]/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitQuizAttempt(
  quizId: string,
  answersGiven: Record<string, string>, // { question_id: "Concise" }
  timeTakenSec: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1. Fetch correct answers for all questions in this quiz
  const { data: quizQuestions } = await supabase
    .from("quiz_questions")
    .select(`
      question_id,
      questions (
        id,
        correct_answer
      )
    `)
    .eq("quiz_id", quizId);

  if (!quizQuestions) throw new Error("Quiz questions not found");

  let score = 0;
  const totalQuestions = quizQuestions.length;

  // 2. Calculate score
  quizQuestions.forEach((qq) => {
    const q = qq.questions as unknown as { id: string; correct_answer: string };
    const userSelected = answersGiven[q.id];
    if (userSelected && userSelected.trim() === q.correct_answer.trim()) {
      score += 1;
    }
  });

  // 3. Save attempt record into public.quiz_attempts
  const { error } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_id: quizId,
    score,
    total_questions: totalQuestions,
    answers_given: answersGiven,
    time_taken_sec: timeTakenSec,
  });

  if (error) {
    console.error("Error saving quiz attempt:", error);
    throw new Error("Failed to save attempt");
  }

  // 4. Redirect candidate directly to detailed result page
  redirect(`/dashboard/quizzes/${quizId}/result`);
}