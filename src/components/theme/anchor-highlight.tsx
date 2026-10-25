"use client";

import { useEffect } from "react";

const FLASH_MS = 2200;

/**
 * When a link points at a post (`#p-…`) the reader lands mid-page with no clue
 * which line is the target. Flash that post once so the eye can find it.
 */
export function AnchorHighlight() {
  useEffect(() => {
    let timer: number | undefined;

    function run() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      window.clearTimeout(timer);
      target.classList.remove("flash");
      // Restart the animation even when the same anchor is used twice.
      void target.offsetWidth;
      target.classList.add("flash");
      timer = window.setTimeout(() => target.classList.remove("flash"), FLASH_MS);
    }

    run();
    window.addEventListener("hashchange", run);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", run);
    };
  }, []);

  return null;
}
