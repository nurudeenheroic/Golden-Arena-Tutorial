// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    
    // 1. Exchange the OAuth code for a session
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && authData.user) {
      // 2. Fetch the user's role from the profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();

      const userRole = profile?.role?.toLowerCase().trim();

      // 3. Redirect Admins to /admin/dashboard
      if (userRole === "admin") {
        return NextResponse.redirect(`${origin}/admin/dashboard`);
      }

      // Default redirect for candidates
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send them back to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}