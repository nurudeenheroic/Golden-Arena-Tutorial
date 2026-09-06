// app/(marketing)/signup/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // becomes raw_user_meta_data->>'name', read by the signup trigger
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/signup/check-email");
}
