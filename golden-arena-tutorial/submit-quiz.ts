// submit-quiz.ts
"use server";

import { createClient } from "@/lib/supabase/server";

interface UserResponse {
  questionId: string;
  selectedOption: string;
}

export async function submitQuizAction(
  quizId: string,
  responses: UserResponse[],
  timeSpentSec: number
) {
  const supabase = await createClient();

  // 1. Authenticate candidate
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized submission.");

  // 2. Prevent duplicate attempts
  const { data: existingAttempt } = await supabase
    .from("quiz_attempts")
    .select("id")
    .eq("quiz_id", quizId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingAttempt) {
    throw new Error("You have already completed this quiz.");
  }

  // 3. Fetch true TOTAL number of questions for this quiz
  const { count: totalQuizQuestions, error: countErr } = await supabase
    .from("quiz_questions")
    .select("*", { count: "exact", head: true })
    .eq("quiz_id", quizId);

  if (countErr || totalQuizQuestions === null || totalQuizQuestions === 0) {
    throw new Error("Failed to verify total question count for this quiz.");
  }

  // 4. Fetch true answer keys (only if user provided responses)
  const questionIds = responses.map((r) => r.questionId);
  let questions: Array<{ id: string; correct_answer: string }> = [];

  if (questionIds.length > 0) {
    const { data: qData, error: qError } = await supabase
      .from("questions")
      .select("id, correct_answer")
      .in("id", questionIds);

    if (qError || !qData) {
      throw new Error("Failed to fetch questions for evaluation.");
    }
    questions = qData;
  }

  const answerMap = new Map(questions.map((q) => [q.id, q.correct_answer]));

  // 5. Evaluate responses on the server
  let correctCount = 0;
  const answerRecordsToInsert: Array<{
    attempt_id?: string;
    user_id: string;
    question_id: string;
    selected_option: string;
    is_correct: boolean;
  }> = [];

  const answersGivenObj: Record<string, string> = {};

  responses.forEach((resp) => {
    const correctAnswer = answerMap.get(resp.questionId);
    answersGivenObj[resp.questionId] = resp.selectedOption;

    const isCorrect =
      correctAnswer &&
      String(resp.selectedOption).trim().toLowerCase() ===
        String(correctAnswer).trim().toLowerCase();

    if (isCorrect) correctCount++;

    answerRecordsToInsert.push({
      user_id: user.id,
      question_id: resp.questionId,
      selected_option: resp.selectedOption,
      is_correct: Boolean(isCorrect),
    });
  });

  const totalQuestions = totalQuizQuestions;

  // 6. Save entry in quiz_attempts
  const { data: attempt, error: attemptErr } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      score: correctCount,
      total_questions: totalQuestions,
      answers_given: answersGivenObj,
      time_taken_sec: Math.max(timeSpentSec, 1),
    })
    .select("id")
    .single();

  if (attemptErr || !attempt) {
    console.error("Supabase quiz_attempts Error:", attemptErr);
    throw new Error(
      `Failed to save quiz attempt: ${attemptErr?.message || "Unknown error"}`
    );
  }

  // 7. Attach attempt_id and save itemized logs in user_answers
  if (answerRecordsToInsert.length > 0) {
    const answersWithAttemptId = answerRecordsToInsert.map((record) => ({
      ...record,
      attempt_id: attempt.id,
    }));

    const { error: userAnswersErr } = await supabase
      .from("user_answers")
      .insert(answersWithAttemptId);

    if (userAnswersErr) {
      console.error("Supabase user_answers Error:", userAnswersErr);
    }
  }

  return {
    attemptId: attempt.id,
    score: correctCount,
    totalQuestions,
    percentage: Math.round((correctCount / totalQuestions) * 100),
  };
}