import { createClient } from "@/lib/supabase/server";
import SubscriptionsManagerClient from "./SubscriptionsManagerClient";

export const revalidate = 0;

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();

  // 1. Fetch ALL subscriptions (removed non-existent 'tier' column)
  const { data: allSubs, error: subErr } = await supabase
    .from("subscriptions")
    .select("id, user_id, status, plan, start_date, end_date");

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

  // 3. Fetch all candidate profiles
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
  const now = new Date();

  (allSubs || []).forEach((sub) => {
    const status = sub.status?.toLowerCase();
    const isStatusValid = ["active", "pro", "approved", "completed", "paid"].includes(status);
    const isNotExpired = !sub.end_date || new Date(sub.end_date) >= now;

    if (isStatusValid && isNotExpired) {
      activeSubsMap[sub.user_id] = {
        ...sub,
        plan: sub.plan || "Pro Plan"
      };
    }
  });

  const activeUserIds = new Set(Object.keys(activeSubsMap));

  // --- DEBUG LOGS FOR TERMINAL INSPECTION ---
  console.log("--- DEBUG SUBSCRIPTIONS ---");
  console.log("Total Profiles Found:", profiles?.length || 0);
  console.log("Total Subscriptions Found:", allSubs?.length || 0);
  console.log("Active Subs Mapped:", Object.keys(activeSubsMap).length);

  // 4. Build unified list starting with all registered profiles
  const allCandidatesMap: Record<string, any> = {};

  (profiles || []).forEach((prof) => {
    const isActivePro = activeUserIds.has(prof.id);
    const subRecord = activeSubsMap[prof.id];

    allCandidatesMap[prof.id] = {
      id: `user-${prof.id}`,
      userId: prof.id,
      candidateName: prof.display_name || prof.name || "Candidate",
      candidateEmail: prof.email || "No email",
      planType: isActivePro ? subRecord.plan : "Free Tier",
      amount: 0,
      status: isActivePro ? "active" : "free",
      startDate: isActivePro ? subRecord.start_date : null,
      endDate: isActivePro ? subRecord.end_date : null,
      currentPlanStatus: isActivePro ? "pro" : "free",
      requestType: "profile",
    };
  });

  // Second, overlay or append explicit subscription requests
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