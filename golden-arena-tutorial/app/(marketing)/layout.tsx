// app/(marketing)/layout.tsx
//
// Wraps every page under (marketing) with the shared navbar/footer.
// Logged-out state — no user prop passed, so SiteNavbar shows Log In/Sign Up.

import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { SiteFooter } from "@/components/shared/SiteFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-900">
      <SiteNavbar />
      {children}
      <SiteFooter />
    </div>
  );
}
