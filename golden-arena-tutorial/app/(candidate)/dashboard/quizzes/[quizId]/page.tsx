import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuizRunnerClient from "./QuizRunnerClient";

export const revalidate = 0;

export default async function QuizRunnerPage({
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

  // 1. Intercept & Redirect if candidate has already attempted this quiz
  const { data: existingAttempt } = await supabase
    .from("quiz_attempts")
    .select("id")
    .eq("quiz_id", quizId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingAttempt) {
    redirect(`/dashboard/quizzes/results/${existingAttempt.id}`);
  }

  // 2. Fetch Quiz Details
  const { data: quiz } = await supabase
    .from("quizzes")
    .select(`
      id,
      title,
      time_limit,
      is_free_tier,
      subjects ( name )
    `)
    .eq("id", quizId)
    .single();

  if (!quiz) redirect("/dashboard/quizzes");

  // 3. Check Plan Access Control
  if (!quiz.is_free_tier) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, end_date")
      .eq("user_id", user.id)
      .maybeSingle();

    const isPaid =
      sub?.status === "active" &&
      (!sub.end_date || new Date(sub.end_date) > new Date());

    if (!isPaid) {
      redirect("/dashboard/quizzes");
    }
  }

  // 4. Fetch Linked Questions (securely without correct answers)
  const { data: quizQuestions } = await supabase
    .from("quiz_questions")
    .select(`
      questions (
        id,
        text,
        options
      )
    `)
    .eq("quiz_id", quizId);

  const formattedQuestions =
    quizQuestions?.map((qq) => {
      const q = qq.questions as unknown as {
        id: string;
        text: string;
        options: string[];
      };
      return {
        id: q.id,
        text: q.text,
        options: q.options ?? [],
      };
    }) ?? [];

  return (
    <QuizRunnerClient
      quizId={quiz.id}
      quizTitle={quiz.title}
      timeLimitMinutes={quiz.time_limit}
      questions={formattedQuestions}
    />
  );
}