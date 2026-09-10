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

  // 1. Authenticate user credentials
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authData.user) {
    const msg = error?.message.toLowerCase() || "";

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

  // 2. Query user profile to determine role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  // 3. Redirect according to role
  if (profile?.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/dashboard");
  }

  
}