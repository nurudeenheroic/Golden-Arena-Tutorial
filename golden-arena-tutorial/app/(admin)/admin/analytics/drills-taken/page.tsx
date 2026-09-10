import { createClient } from "@/lib/supabase/server";
import DrillsListClient from "./DrillsListClient";

export const revalidate = 0;

export default async function DrillsTakenPage() {
  const supabase = await createClient();

  // 1. Fetch all quiz attempts with quiz and user details
  const { data: attempts, error } = await supabase
    .from("quiz_attempts")
    .select(`
      id,
      quiz_id,
      user_id,
      score,
      total_questions,
      time_taken_sec,
      created_at,
      quizzes ( id, title, time_limit )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching drill analytics:", error.message);
  }

  const rawAttempts = attempts || [];

  // 2. Resolve Candidate Profiles separately
  const userIds = Array.from(new Set(rawAttempts.map((a) => a.user_id).filter(Boolean)));
  let profilesMap = new Map<string, { name?: string; display_name?: string; email?: string }>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, display_name, email")
      .in("id", userIds);

    if (profiles) {
      profiles.forEach((p) => profilesMap.set(p.id, p));
    }
  }

  // 3. Group attempts by Quiz ID
  const groupedDrills: Record<
    string,
    {
      quizId: string;
      quizTitle: string;
      totalAttemptsCount: number;
      candidateIds: Set<string>;
      totalScore: number;
      totalQuestions: number;
      attemptsList: Array<{
        attemptId: string;
        candidateId: string;
        candidateName: string;
        candidateEmail: string;
        score: number;
        totalQuestions: number;
        timeTakenSec: number;
        createdAt: string;
      }>;
    }
  > = {};

  rawAttempts.forEach((att) => {
    const quizId = att.quiz_id || "unassigned";
    const quizTitle = att.quizzes?.title || "Standard Practice Drill";
    const candidate = profilesMap.get(att.user_id);

    if (!groupedDrills[quizId]) {
      groupedDrills[quizId] = {
        quizId,
        quizTitle,
        totalAttemptsCount: 0,
        candidateIds: new Set(),
        totalScore: 0,
        totalQuestions: 0,
        attemptsList: [],
      };
    }

    const group = groupedDrills[quizId];
    group.totalAttemptsCount += 1;
    if (att.user_id) group.candidateIds.add(att.user_id);
    group.totalScore += att.score || 0;
    group.totalQuestions += att.total_questions || 0;

    group.attemptsList.push({
      attemptId: att.id,
      candidateId: att.user_id,
      candidateName: candidate?.name || candidate?.display_name || "Candidate",
      candidateEmail: candidate?.email || att.user_id,
      score: att.score || 0,
      totalQuestions: att.total_questions || 1,
      timeTakenSec: att.time_taken_sec || 0,
      createdAt: att.created_at,
    });
  });

  // 4. Format Drills Array
  const drillsData = Object.values(groupedDrills).map((d) => {
    const avgScorePct =
      d.totalQuestions > 0 ? Math.round((d.totalScore / d.totalQuestions) * 100) : 0;

    return {
      quizId: d.quizId,
      quizTitle: d.quizTitle,
      totalAttempts: d.totalAttemptsCount,
      uniqueCandidates: d.candidateIds.size,
      avgScorePct,
      attemptsList: d.attemptsList,
    };
  });

  return <DrillsListClient drills={drillsData} />;
}