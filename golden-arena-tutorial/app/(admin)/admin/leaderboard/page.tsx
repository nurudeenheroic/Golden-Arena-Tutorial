import { createClient } from "@/lib/supabase/server";
import LeaderboardClient from "./LeaderboardClient";

export const revalidate = 0;

export default async function AdminLeaderboardPage() {
  const supabase = await createClient();

  // 1. Fetch completed quiz attempts
  const { data: attempts, error } = await supabase
    .from("quiz_attempts")
    .select(`
      id,
      user_id,
      score,
      total_questions,
      completed_at,
      created_at
    `);

  if (error) {
    console.error("Error fetching leaderboard data:", error.message);
  }

  // 2. Fetch Profiles map
  const userIds = Array.from(
    new Set((attempts || []).map((a) => a.user_id).filter(Boolean))
  );

  let profilesMap: Record<
    string,
    { name?: string; display_name?: string; email?: string }
  > = {};

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, display_name, email")
      .in("id", userIds);

    if (profiles) {
      profilesMap = profiles.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as typeof profilesMap);
    }
  }

  // 3. Aggregate candidate stats using percentage-based scoring
  const leaderboardMap: Record<
    string,
    {
      userId: string;
      name: string;
      email: string;
      totalPoints: number;
      percentageSum: number;
      testsCompleted: number;
    }
  > = {};

  (attempts || []).forEach((att) => {
    const uId = att.user_id;
    if (!uId) return;

    const prof = profilesMap[uId];
    const name =
      prof?.display_name || prof?.name || `Candidate #${uId.slice(0, 6)}`;
    const email = prof?.email || "No email";

    const totalQ = att.total_questions || 1;
    const score = att.score || 0;
    
    // Percentage for this quiz (0 - 100)
    const quizPct = (score / totalQ) * 100;
    
    // Points earned for this quiz (0.0 - 10.0)
    const quizPoints = quizPct / 10;

    if (!leaderboardMap[uId]) {
      leaderboardMap[uId] = {
        userId: uId,
        name,
        email,
        totalPoints: 0,
        percentageSum: 0,
        testsCompleted: 0,
      };
    }

    leaderboardMap[uId].totalPoints += quizPoints;
    leaderboardMap[uId].percentageSum += quizPct;
    leaderboardMap[uId].testsCompleted += 1;
  });

  // 4. Calculate final accuracy averages and sort rankings
  const rankings = Object.values(leaderboardMap)
    .map((candidate) => ({
      userId: candidate.userId,
      name: candidate.name,
      email: candidate.email,
      totalPoints: Number(candidate.totalPoints.toFixed(1)),
      testsCompleted: candidate.testsCompleted,
      accuracyPct: Math.round(
        candidate.percentageSum / (candidate.testsCompleted || 1)
      ),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return <LeaderboardClient rankings={rankings} />;
}