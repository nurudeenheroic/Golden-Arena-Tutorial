import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuizzesClientHub, { FormattedQuiz } from "./QuizzesClientHub";

export const revalidate = 0;

export default async function QuizzesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Check if user has an active paid subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, end_date")
    .eq("user_id", user.id)
    .maybeSingle();

  const isPaid =
    sub?.status === "active" &&
    (!sub.end_date || new Date(sub.end_date) > new Date());

  // 2. Fetch all quizzes with subject details
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(`
      id,
      title,
      time_limit,
      price,
      is_mock_exam,
      is_free_tier,
      is_upcoming,
      scheduled_for,
      subjects ( name )
    `)
    .order("is_upcoming", { ascending: false });

  // 3. Fetch user's completed attempt scores
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("quiz_id, score, total_questions")
    .eq("user_id", user.id);

  const attemptedMap = new Map(
    attempts?.map((a) => [
      a.quiz_id,
      Math.round((a.score / a.total_questions) * 100),
    ]) ?? []
  );

  const formattedQuizzes: FormattedQuiz[] =
    quizzes?.map((q) => ({
      id: q.id,
      title: q.title,
      subject: (q.subjects as unknown as { name: string })?.name ?? "General",
      durationMinutes: q.time_limit,
      isFreeTier: q.is_free_tier,
      isUpcoming: q.is_upcoming,
      scheduledFor: q.scheduled_for,
      attempted: attemptedMap.has(q.id),
      lastScorePercentage: attemptedMap.get(q.id),
    })) ?? [];

  return <QuizzesClientHub quizzes={formattedQuizzes} isPaid={isPaid} />;
}