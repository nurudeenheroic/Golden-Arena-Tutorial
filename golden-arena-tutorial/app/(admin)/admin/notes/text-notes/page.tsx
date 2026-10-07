import { createClient } from "@/lib/supabase/server";
import TextNotesManagerClient from "./TextNotesManagerClient";

export const revalidate = 0;

export default async function TextNotesPage() {
  const supabase = await createClient();

  // Fetch all text notes with image_url instead of file_url
  const { data: notes, error } = await supabase
    .from("study_notes")
    .select(`
      id,
      title,
      content,
      image_url,
      topic_name,
      created_at,
      subject_id,
      subjects ( id, name )
    `)
    .eq("is_mnemonic", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching text notes:", error.message);
  }

  return <TextNotesManagerClient initialNotes={notes ?? []} />;
}