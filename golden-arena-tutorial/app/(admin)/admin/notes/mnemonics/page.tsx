import { createClient } from "@/lib/supabase/server";
import MnemonicsManagerClient from "./MnemonicsManagerClient";

export const revalidate = 0;

export default async function MnemonicsPage() {
  const supabase = await createClient();

  // Fetch all mnemonics with subject relations
  const { data: mnemonics, error } = await supabase
    .from("study_notes")
    .select(`
      id,
      title,
      image_url,
      topic_name,
      created_at,
      subject_id,
      subjects ( id, name )
    `)
    .eq("is_mnemonic", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mnemonics:", error.message);
  }

  return <MnemonicsManagerClient initialMnemonics={mnemonics ?? []} />;
}