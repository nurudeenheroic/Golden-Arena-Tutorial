// GAT public homepage.
// This page only composes sections; most UI code lives in components/marketing.
// Navbar and Footer are provided by app/(marketing)/layout.tsx, not here.

import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { SideRail } from "@/components/marketing/SideRail";
import { Stats } from "@/components/marketing/Stats";
import { Subjects } from "@/components/marketing/Subjects";
import { SuccessCTA } from "@/components/marketing/SuccessCTA";
import { Testimonials } from "@/components/marketing/Testimonials";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";

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

          <Subjects />

          <HowItWorks />

          {/* Testimonials intentionally appear before the final CTA. */}
          <Testimonials />

          <WhatsAppCTA />

          <SuccessCTA />
        </div>

        {/* Sidebar is hidden on mobile/tablet to keep the responsive layout clean. */}
        <div className="hidden pt-5 lg:block">
          <div className="sticky top-24">
            <SideRail />
          </div>
        </div>
      </div>
    </main>
  );
}
