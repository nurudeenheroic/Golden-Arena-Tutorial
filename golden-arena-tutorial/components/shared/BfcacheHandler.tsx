"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function BfcacheHandler() {
  const router = useRouter();

  useEffect(() => {
    // Listen for browser Back/Forward navigation (pageshow event)
    const handlePageShow = (event: PageTransitionEvent) => {
      // event.persisted is true if page was restored from Chrome's back-forward cache
      if (event.persisted) {
        // Force a server revalidation
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  return null;
}