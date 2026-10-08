import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/marketing/Hero";
import { ExamPreparation } from "@/components/marketing/ExamPreparation";
import { Subjects } from "@/components/marketing/Subjects";
import { Pricing } from "@/components/marketing/pricing";
import { AboutTeaser } from "@/components/marketing/AboutTeaser";
import { SideRail } from "@/components/shared/SideRail";
import { FAQ } from "@/components/marketing/FAQ";
import { Contact } from "@/components/marketing/Contact";
import { Stats } from "@/components/marketing/Stats";
import { SuccessCTA } from "@/components/marketing/SuccessCTA";
import { Testimonials } from "@/components/marketing/Testimonials";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
import { HowItWorks } from "@/components/marketing/HowItWorks";

export default async function CandidateDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  // 1. Fetch Candidate Profile safely
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  // 2. Fetch Subscription
  const { data: subData } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // 3. Fetch Recent Quiz Attempts joined with quizzes for titles and attempt ID
  const { data: recentAttempts } = await supabase
    .from("quiz_attempts")
    .select("id, score, total_questions, created_at, quizzes (title)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  const formattedQuizzes = recentAttempts?.map((attempt: any) => {
    const score = attempt.score ?? 0;
    const total = attempt.total_questions ?? 1;
    const percent = Math.round((score / total) * 100);
    const quizTitle = attempt.quizzes?.title ?? "CBT Practice Test";

    return {
      name: quizTitle,
      progress: percent > 100 ? 100 : percent,
      attemptId: attempt.id, // 👈 Passes the attempt ID so the sidebar can link to the result page!
    };
  }) ?? [];

  // 4. Build Complete Sorted Leaderboard (Prioritizing display_name, fallback to name)
  const { data: allProfiles } = await supabase.from("profiles").select("id, name, display_name");
  const { data: allAttempts } = await supabase.from("quiz_attempts").select("user_id, score");

  const candidateScores: Record<string, { id: string; name: string; totalScore: number }> = {};
  
  allProfiles?.forEach((p: any) => {
    const candidateDisplayName = p.display_name && p.display_name.trim() !== "" 
      ? p.display_name 
      : (p.name ?? "Candidate");

    candidateScores[p.id] = { id: p.id, name: candidateDisplayName, totalScore: 0 };
  });

  allAttempts?.forEach((att: any) => {
    const uid = att.user_id;
    if (candidateScores[uid]) {
      candidateScores[uid].totalScore += (att.score ?? 0);
    }
  });

  // Full sorted list of all candidates by points descending
  const sortedLeaderboard = Object.values(candidateScores)
    .sort((a, b) => b.totalScore - a.totalScore);

  // Find the logged-in user's exact 1-based rank
  const userRankIndex = sortedLeaderboard.findIndex((item) => item.id === userId);
  const userCalculatedRank = userRankIndex !== -1 && sortedLeaderboard[userRankIndex].totalScore > 0 
    ? userRankIndex + 1 
    : null;

  // Map top 3 for display
  const leaderboard = sortedLeaderboard
    .filter((item) => item.totalScore > 0)
    .slice(0, 3)
    .map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      score: `${item.totalScore} pts`,
      isCurrentUser: item.id === userId, // Flag to identify if this row is the logged-in user
    }));

  // Determine user plan & paid status
  const userPlan = subData?.plan ?? subData?.plan_name ?? profile?.plan ?? "free";
  const isUserPaid = Boolean(profile?.is_paid) || subData?.status === "active" || userPlan.toLowerCase() !== "free";

  const candidate = {
    name: profile?.name ?? user?.user_metadata?.name ?? "Student",
    email: profile?.email ?? user?.email ?? "",
    role: profile?.role ?? "student",
    plan: userPlan,
    isPaid: isUserPaid,
    streak: profile?.streak ?? 0,
    bestStreak: profile?.best_streak ?? 0,
    progressPercent: profile?.progress_percent ?? 0,
    leaderboardRank: userCalculatedRank, // Now dynamically computed!
    recentQuizzes: formattedQuizzes,
  };

  return (
    <main>
      <Hero user={candidate} />

      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        <div className="min-w-0">
          <div className="py-5">
            <Stats />
          </div>

          <ExamPreparation user={candidate} />
          <Subjects user={candidate} />
          <HowItWorks />
          <AboutTeaser />
          <Pricing user={candidate} />
          <Testimonials />
          <FAQ />
          <Contact />
          <WhatsAppCTA />
          <SuccessCTA />
        </div>

        <div className="hidden pt-5 lg:block">
          <div className="sticky top-24">
            <SideRail user={candidate} leaderboard={leaderboard} isLoading={false} />
          </div>
        </div>
      </div>
    </main>
  );
}