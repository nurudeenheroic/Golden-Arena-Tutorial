import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/marketing/Hero";
import { ExamPreparation } from "@/components/marketing/ExamPreparation";
import { Subjects } from "@/components/marketing/Subjects";
import { Pricing } from "@/components/marketing/pricing"; // Verify named vs default inside pricing.tsx
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

  // Fetch full candidate profile and activity data
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, is_paid, streak, best_streak, progress_percent, leaderboard_rank")
    .eq("id", user?.id ?? "")
    .single();

  // Fetch candidate's recent quiz attempts
  const { data: recentQuizzes } = await supabase
    .from("quiz_attempts")
    .select("name, progress")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(3);

  const candidate = {
    name: profile?.name ?? "Student",
    isPaid: Boolean(profile?.is_paid),
    streak: profile?.streak ?? 0,
    bestStreak: profile?.best_streak ?? 0,
    progressPercent: profile?.progress_percent ?? 0,
    leaderboardRank: profile?.leaderboard_rank ?? null,
    recentQuizzes: recentQuizzes ?? [],
  };

  return (
    <main>
      <Hero user={candidate} />

      {/* Main content + desktop-only sidebar */}
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

        {/* Desktop Sidebar */}
        <div className="hidden pt-5 lg:block">
          <div className="sticky top-24">
            <SideRail user={candidate} isLoading={false} />
          </div>
        </div>
      </div>
    </main>
  );
}