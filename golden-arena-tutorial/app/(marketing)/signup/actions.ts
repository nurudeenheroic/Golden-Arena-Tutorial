// app/(marketing)/signup/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SignupActionState = {
  error?: string;
} | null;

export async function signupAction(
  prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "";

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Construct target route safely
  const targetPath = callbackUrl
    ? `/signup/check-email?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/signup/check-email";

  // Redirect must execute directly at the root level of the function
  redirect(targetPath);
}