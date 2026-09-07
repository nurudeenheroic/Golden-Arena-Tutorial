// GAT public homepage.
// This page only composes sections; most UI code lives in components/marketing.
// Navbar and Footer are provided by app/(marketing)/layout.tsx, not here.

import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { Contact } from "@/components/marketing/Contact";
import { SideRail } from "@/components/shared/SideRail";
import { Stats } from "@/components/marketing/Stats";
import { Subjects } from "@/components/marketing/Subjects";
import { SuccessCTA } from "@/components/marketing/SuccessCTA";
import { Testimonials } from "@/components/marketing/Testimonials";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
import { ExamPreparation } from "@/components/marketing/ExamPreparation";
import { AboutTeaser } from "@/components/marketing/AboutTeaser";


export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Main content + desktop-only reference-style sidebar. */}
      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        <div className="min-w-0">
          <div className="py-5">
            <Stats />
          </div>

          <ExamPreparation />

          <Subjects />

          <HowItWorks />

          <AboutTeaser />

          <Pricing />

          {/* Testimonials intentionally appear before the final CTA. */}
          <Testimonials />

          <FAQ/>

          <Contact />

          <WhatsAppCTA />

          <SuccessCTA />
        </div>

        {/* Sidebar is hidden on mobile/tablet to keep the responsive layout clean. */}
        <div className="hidden pt-5 lg:block">
          <div className="sticky top-24">
            <SideRail user={null} isLoading={false} />
          </div>
        </div>
      </div>
    </main>
  );
}
