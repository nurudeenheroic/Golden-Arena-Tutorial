import { createClient } from "@/lib/supabase/server";
import QuestionsManagerClient from "./QuestionsManagerClient";

export const revalidate = 0;

export default async function AdminQuestionsPage() {
  const supabase = await createClient();

  // 1. Fetch questions with .range(0, 4999) to bypass the 1,000 limit
  const { data: questions, error } = await supabase
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
      image_url,
      subject_id,
      subjects ( name, track )
    `)
    .range(0, 4999); // <--- THIS BYPASSES THE 1,000 LIMIT

  if (error) {
    console.error("Error fetching questions:", error.message);
  }

  // 2. Fetch subjects for the filter dropdowns
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, track")
    .order("name");

  return (
    <QuestionsManagerClient
      initialQuestions={questions ?? []}
      subjects={subjects ?? []}
    />
  );
}