import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Sign out candidate from Supabase
  await supabase.auth.signOut();

  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(`${requestUrl.origin}/`, {
    status: 302,
  });

  // 2. Prevent caching of the redirect response
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");

  return response;
}