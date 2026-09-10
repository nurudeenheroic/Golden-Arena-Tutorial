import { createClient } from "@/lib/supabase/server";
import QuestionsManagerClient from "./QuestionsManagerClient";

export const revalidate = 0;

export default async function AdminQuestionsPage() {
  const supabase = await createClient();

  // 1. Fetch questions with linked subject details
  const { data: questions } = await supabase
    .from("questions")
    .select(`
      id,
      question_code,
      text,
      options,
      correct_answer,
      explanation,
      difficulty,
      year,
      topic,
      subject_id,
      subjects ( name, track )
    `)
    .order("id", { ascending: false });

  // 2. Fetch all subjects for filtering
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, track")
    .order("name", { ascending: true });

  return (
    <QuestionsManagerClient
      initialQuestions={questions ?? []}
      subjects={subjects ?? []}
    />
  );
}