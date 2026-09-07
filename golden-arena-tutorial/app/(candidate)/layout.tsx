// app/(candidate)/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BfcacheHandler } from "@/components/shared/BfcacheHandler";

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

  // Fetch display_name specifically
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, is_paid")
    .eq("id", user.id)
    .single();

  const googleFullName =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Student";

  const candidateData = {
    name: profile?.display_name && profile.display_name.trim() !== "" 
      ? profile.display_name 
      : googleFullName,
    isPaid: Boolean(profile?.is_paid),
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fffdfa] text-slate-900">
      <BfcacheHandler />
      <SiteNavbar user={candidateData} />
      <main className="flex-1">{children}</main>
      <SiteFooter user={candidateData} />
    </div>
  );
}