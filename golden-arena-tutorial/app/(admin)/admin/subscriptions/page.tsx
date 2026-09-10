import { createClient } from "@/lib/supabase/server";
import SubscriptionsManagerClient from "./SubscriptionsManagerClient";

export const revalidate = 0;

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  // 1. Fetch active subscriptions (status = active and end_date is in the future)
  const { data: activeSubs, error: subErr } = await supabase
    .from("subscriptions")
    .select("id, user_id, status, plan, start_date, end_date")
    .eq("status", "active")
    .gte("end_date", nowIso);

  if (subErr) {
    console.error("Error fetching subscriptions:", subErr.message);
  }

  // 2. Fetch pending subscription payment requests
  const { data: rawRequests, error: reqErr } = await supabase
    .from("subscription_requests")
    .select("id, user_id, plan, amount, status, created_at, confirmed_at")
    .order("created_at", { ascending: false });

  if (reqErr) {
    console.error("Error fetching subscription requests:", reqErr.message);
  }

  // 3. Fetch all candidate profiles (names and emails)
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, name, display_name, email")
    .order("name", { ascending: true });

  if (profErr) {
    console.error("Error fetching profiles:", profErr.message);
  }

  const profilesMap: Record<string, any> = {};
  (profiles || []).forEach((p) => {
    profilesMap[p.id] = p;
  });

  // Map of active subscriptions by user_id
  const activeSubsMap: Record<string, any> = {};
  (activeSubs || []).forEach((sub) => {
    activeSubsMap[sub.user_id] = sub;
  });

  const activeUserIds = new Set(Object.keys(activeSubsMap));

  // 4. Build unified list starting with all registered profiles
  const allCandidatesMap: Record<string, any> = {};

  // First, add all profiles as base records
  (profiles || []).forEach((prof) => {
    const isActivePro = activeUserIds.has(prof.id);
    allCandidatesMap[prof.id] = {
      id: `user-${prof.id}`,
      userId: prof.id,
      candidateName: prof.display_name || prof.name || "Candidate",
      candidateEmail: prof.email || "No email",
      planType: isActivePro ? activeSubsMap[prof.id].plan : "Free Tier",
      amount: 0,
      status: isActivePro ? "active" : "free",
      startDate: isActivePro ? activeSubsMap[prof.id].start_date : null,
      endDate: isActivePro ? activeSubsMap[prof.id].end_date : null,
      currentPlanStatus: isActivePro ? "pro" : "free",
      requestType: "profile",
    };
  });

  // Second, overlay or append explicit subscription requests (especially pending/rejected ones)
  const requests = (rawRequests || []).map((req) => {
    const prof = profilesMap[req.user_id];
    const isActivePro = activeUserIds.has(req.user_id);

    return {
      id: req.id,
      userId: req.user_id,
      candidateName: prof?.display_name || prof?.name || "Candidate",
      candidateEmail: prof?.email || "No email",
      planType: req.plan || "pro_annual",
      amount: req.amount || 0,
      status: req.status || "pending",
      startDate: null,
      endDate: null,
      currentPlanStatus: isActivePro ? "pro" : "free",
      requestType: "payment_request",
    };
  });

  // Combine both views into one comprehensive manager list
  const combinedList = [
    ...Object.values(allCandidatesMap),
    ...requests,
  ];

  return (
    <SubscriptionsManagerClient
      initialRequests={combinedList}
      candidates={profiles || []}
    />
  );
}