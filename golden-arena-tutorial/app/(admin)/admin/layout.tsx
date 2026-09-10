import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Authenticate user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch user profile and verify strict admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, display_name")
    .eq("id", user.id)
    .single();

  // Redirect candidate students back to candidate dashboard
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const adminUser = {
    id: user.id,
    name: profile.display_name || profile.name || "System Admin",
    email: user.email ?? "",
  };

  return <AdminShell adminUser={adminUser}>{children}</AdminShell>;
}