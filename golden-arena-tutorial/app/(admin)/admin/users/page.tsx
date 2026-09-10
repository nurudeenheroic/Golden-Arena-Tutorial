import { createClient } from "@/lib/supabase/server";
import UserListClient from "./UserListClient";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch all profiles along with active subscriptions
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      id,
      name,
      display_name,
      email,
      role,
      created_at,
      subscriptions ( status, end_date )
    `)
    .order("created_at", { ascending: false });

  const formattedUsers =
    profiles?.map((p) => {
      const sub = Array.isArray(p.subscriptions)
        ? p.subscriptions[0]
        : p.subscriptions;
      const isPaid =
        sub?.status === "active" &&
        (!sub.end_date || new Date(sub.end_date) > new Date());

      return {
        id: p.id,
        name: p.display_name || p.name || "Student",
        email: p.email ?? "No Email",
        role: p.role ?? "student",
        isPaid,
        createdAt: p.created_at,
      };
    }) ?? [];

  return <UserListClient users={formattedUsers} />;
}