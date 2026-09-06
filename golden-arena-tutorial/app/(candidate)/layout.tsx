//  export default function CandidateLayout({ children }) {
  // Auth check will go here later (redirect to /login if not signed in)
 // app/(candidate)/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { SiteFooter } from "@/components/shared/SiteFooter";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-900">
      <SiteNavbar user={{ name: profile?.name ?? "Student" }} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
