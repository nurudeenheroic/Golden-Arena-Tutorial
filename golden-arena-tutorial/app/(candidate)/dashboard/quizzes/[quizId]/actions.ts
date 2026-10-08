// app/(candidate)/dashboard/quizzes/[quizId]/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Helper function to handle daily streak calculations
async function updateCandidateStreak(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("streak, best_streak, last_active_date")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    console.error("Failed to fetch profile for streak update:", error);
    return;
  }

  const lastActive = profile.last_active_date;
  let currentStreak = profile.streak ?? 0;
  let bestStreak = profile.best_streak ?? 0;

  if (lastActive === today) {
    // Already active today, no streak change needed
    return;
  }

  // Check if last active date was yesterday
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  if (lastActive === yesterday) {
    // Consecutive day! Increment streak
    currentStreak += 1;
  } else {
    // Streak broken or first time, reset to 1
    currentStreak = 1;
  }

  // Update best streak if current breaks personal record
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      streak: currentStreak,
      best_streak: bestStreak,
      last_active_date: today,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Failed to update candidate streak:", updateError);
  }
}

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

  // 3. Save attempt record into public.quiz_attempts and retrieve its ID
  const { data: insertedAttempt, error } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      answers_given: answersGiven,
      time_taken_sec: timeTakenSec,
    })
    .select("id")
    .single();

  if (error || !insertedAttempt) {
    console.error("Error saving quiz attempt:", error);
    throw new Error("Failed to save attempt");
  }

  // 4. Automatically update the candidate's daily streak!
  await updateCandidateStreak(user.id);

  // 5. Redirect candidate to the correct results page route using the attempt ID
  redirect(`/dashboard/quizzes/results/${insertedAttempt.id}`);
async function updateCandidateStreak(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  console.log("🔥 [STREAK DEBUG] Running for user:", userId, "Today is:", today);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("streak, best_streak, last_active_date")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    console.error("❌ [STREAK DEBUG] Failed to fetch profile:", error);
    return;
  }

  console.log("📄 [STREAK DEBUG] Current profile data:", profile);

  const lastActive = profile.last_active_date;
  let currentStreak = profile.streak ?? 0;
  let bestStreak = profile.best_streak ?? 0;

  if (lastActive === today) {
    console.log("ℹ️ [STREAK DEBUG] Already active today. Skipping increment.");
    return;
  }

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  if (lastActive === yesterday) {
    currentStreak += 1;
    console.log("📈 [STREAK DEBUG] Consecutive day! Incrementing streak to:", currentStreak);
  } else {
    currentStreak = 1;
    console.log("🔄 [STREAK DEBUG] Gap detected or first time. Resetting streak to 1.");
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      streak: currentStreak,
      best_streak: bestStreak,
      last_active_date: today,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("❌ [STREAK DEBUG] Failed to update profile table:", updateError);
  } else {
    console.log("✅ [STREAK DEBUG] Successfully saved new streak:", currentStreak);
  }
}

  // 5. Redirect candidate directly to detailed result page
  redirect(`/dashboard/quizzes/${quizId}/result`);
}