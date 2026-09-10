import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SubjectDetailClient from "./SubjectDetailClient";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

export default async function SubjectDetailPage({ params }: PageProps) {
  const { subjectId } = await params;
  const supabase = await createClient();

  // 1. Fetch Subject Details
  const { data: subject, error: subjectErr } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", subjectId)
    .single();

  if (subjectErr || !subject) {
    notFound();
  }

  // 2. Fetch Questions strictly matching subject_id (without referencing created_at)
  const { data: questions, error: questionsErr } = await supabase
    .from("questions")
    .select("id, text, topic, explanation")
    .eq("subject_id", subjectId);

  if (questionsErr) {
    console.error("Error fetching questions for subject:", questionsErr.message);
  }

  // 3. Fetch Notes & Quizzes counts
  const [
    { count: notesCount, data: notesPreview },
    { count: quizzesCount },
  ] = await Promise.all([
    supabase
      .from("study_notes")
      .select("id, title, topic", { count: "exact" })
      .eq("subject_id", subjectId)
      .limit(3),
    supabase
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .eq("subject_id", subjectId),
  ]);

  return (
    <SubjectDetailClient
      subject={subject}
      notesCount={notesCount ?? 0}
      notesPreview={notesPreview ?? []}
      quizzesCount={quizzesCount ?? 0}
      questions={questions ?? []}
    />
  );
}