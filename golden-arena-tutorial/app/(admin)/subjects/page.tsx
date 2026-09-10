import { createClient } from "@/lib/supabase/server";
import { BookMarked, Plus, Layers } from "lucide-react";
import SubjectManagerClient from "./SubjectManagerClient";

export const revalidate = 0;

export default async function AdminSubjectsPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });

  return <SubjectManagerClient initialSubjects={subjects ?? []} />;
}