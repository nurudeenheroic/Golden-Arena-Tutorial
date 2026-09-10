import { createClient } from "@/lib/supabase/server";
import ResultsAuditClient from "./ResultsAuditClient";

export const revalidate = 0;

export default async function AdminResultsPage() {
  const supabase = await createClient();

  // 1. Fetch attempts with linked quizzes and subjects
  const { data: attemptsData, error: attemptsError } = await supabase
    .from("quiz_attempts")
    .select(`
      id,
      user_id,
      quiz_id,
      score,
      total_questions,
      completed_at,
      created_at,
      quizzes ( id, title, subject_id, subjects ( id, name ) )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (attemptsError) {
    console.error("Error fetching quiz attempts:", attemptsError.message);
  }

  // 2. Collect unique user_ids to fetch profile details manually
  const userIds = Array.from(
    new Set((attemptsData || []).map((att) => att.user_id).filter(Boolean))
  );

  let profilesMap: Record<string, { name?: string; display_name?: string; email?: string }> = {};

  if (userIds.length > 0) {
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, name, display_name, email")
      .in("id", userIds);

    if (profilesData) {
      profilesMap = profilesData.reduce((acc, prof) => {
        acc[prof.id] = prof;
        return acc;
      }, {} as typeof profilesMap);
    }
  }

  // 3. Map and normalize attempt records safely
  const attempts = (attemptsData || []).map((att) => {
    const profile = profilesMap[att.user_id];
    const quizObj = Array.isArray(att.quizzes) ? att.quizzes[0] : att.quizzes;
    const subjectObj = quizObj?.subjects
      ? Array.isArray(quizObj.subjects)
        ? quizObj.subjects[0]
        : quizObj.subjects
      : null;

    return {
      id: att.id,
      score: att.score ?? 0,
      totalQuestions: att.total_questions ?? 1,
      completedAt: att.completed_at || att.created_at,
      candidateId: att.user_id,
      candidateName:
        profile?.display_name ||
        profile?.name ||
        "Candidate #" + (att.user_id ? att.user_id.slice(0, 6) : "Anon"),
      candidateEmail: profile?.email || "No email linked",
      quizId: quizObj?.id || att.quiz_id,
      quizTitle: quizObj?.title || "UTME Practice Drill",
      subjectName: subjectObj?.name || "General",
    };
  });

  return <ResultsAuditClient attempts={attempts} />;
}