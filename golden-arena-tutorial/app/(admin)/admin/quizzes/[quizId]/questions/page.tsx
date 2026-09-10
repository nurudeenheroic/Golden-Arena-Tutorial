import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QuizQuestionsManagerClient from "./QuizQuestionsManager";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizQuestionsPage({ params }: PageProps) {
  const { quizId } = await params;
  const supabase = await createClient();

  // 1. Fetch Quiz details
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, title, subject_id, subjects ( name )")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    notFound();
  }

  // 2. Fetch IDs of attached questions via junction table
  const { data: junctionData } = await supabase
    .from("quiz_questions")
    .select("question_id")
    .eq("quiz_id", quizId);

  const attachedIds = junctionData?.map((j) => j.question_id) ?? [];

  // 3. Fetch full question objects for attached and available pool
  let attachedQuestions: any[] = [];
  let availableQuestions: any[] = [];

  if (attachedIds.length > 0) {
    const { data: attached } = await supabase
      .from("questions")
      .select("id, text, options, correct_answer, topic, explanation")
      .in("id", attachedIds);
    attachedQuestions = attached ?? [];
  }

  // Fetch unattached questions matching the quiz's subject
  let availableQuery = supabase
    .from("questions")
    .select("id, text, options, correct_answer, topic, explanation")
    .order("id", { ascending: false })
    .limit(50);

  if (quiz.subject_id) {
    availableQuery = availableQuery.eq("subject_id", quiz.subject_id);
  }

  const { data: allSubjectQuestions } = await availableQuery;

  if (allSubjectQuestions) {
    availableQuestions = allSubjectQuestions.filter(
      (q) => !attachedIds.includes(q.id)
    );
  }

  return (
    <QuizQuestionsManagerClient
      quiz={quiz}
      attachedQuestions={attachedQuestions}
      availableQuestions={availableQuestions}
    />
  );
}