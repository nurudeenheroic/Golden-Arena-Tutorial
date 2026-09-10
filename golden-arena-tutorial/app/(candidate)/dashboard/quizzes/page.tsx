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

  // 1. Check active subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, end_date")
    .eq("user_id", user.id)
    .maybeSingle();

  const isPaid =
    sub?.status === "active" &&
    (!sub.end_date || new Date(sub.end_date) > new Date());

  // 2. Fetch quizzes with subjects
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

  // 3. Fetch user attempts INCLUDING attempt id
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("id, quiz_id, score, total_questions")
    .eq("user_id", user.id);

  // Map attempt_id and calculated score percentage
  const attemptedMap = new Map(
    attempts?.map((a) => [
      a.quiz_id,
      {
        attemptId: a.id,
        percentage: Math.round((a.score / a.total_questions) * 100),
      },
    ]) ?? []
  );

  const formattedQuizzes: FormattedQuiz[] =
    quizzes?.map((q) => {
      const userAttempt = attemptedMap.get(q.id);
      return {
        id: q.id,
        title: q.title,
        subject: (q.subjects as unknown as { name: string })?.name ?? "General",
        durationMinutes: q.time_limit,
        isFreeTier: q.is_free_tier,
        isUpcoming: q.is_upcoming,
        scheduledFor: q.scheduled_for,
        attempted: Boolean(userAttempt),
        lastScorePercentage: userAttempt?.percentage,
        attemptId: userAttempt?.attemptId, // <--- Attach attempt ID for result page linking
      };
    }) ?? [];

  return <QuizzesClientHub quizzes={formattedQuizzes} isPaid={isPaid} />;
}