"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Browser back and forward restore the render the client router cached earlier,
 * which can show counts from before a like, save, or reply. Re-fetching on
 * `popstate` keeps those entries honest without touching the first paint.
 */
export function RouteFreshness() {
  const router = useRouter();

  useEffect(() => {
    function onPopState() {
      router.refresh();
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  return null;
}
