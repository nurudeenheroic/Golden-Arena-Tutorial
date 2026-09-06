// app/(marketing)/login/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type LoginActionState = {
  errorType?: "email" | "password" | "both";
  message?: string;
} | null;

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const msg = error.message.toLowerCase();

    // Specific password errors
    if (msg.includes("password")) {
      return {
        errorType: "password",
        message: "Incorrect password. Please try again.",
      };
    }

    // Default Supabase error (Invalid login credentials covers both invalid email or wrong password)
    return {
      errorType: "both",
      message: "Invalid email or password. Please check your credentials.",
    };
  }

  redirect("/dashboard");
}