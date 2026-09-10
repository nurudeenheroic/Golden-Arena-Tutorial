import { createClient } from "@/lib/supabase/server";
import TrackPreviewClient from "./TrackPreviewClient";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ trackSlug: string }>;
}

export default async function TrackPreviewPage({ params }: PageProps) {
  const { trackSlug } = await params;
  const supabase = await createClient();

  // Fetch subjects under this specific track
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .ilike("track", trackSlug)
    .order("name", { ascending: true });

  return (
    <TrackPreviewClient
      trackSlug={trackSlug}
      initialSubjects={subjects ?? []}
    />
  );
}