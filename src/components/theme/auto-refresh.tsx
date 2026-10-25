"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const INTERVAL_MS = 12_000;
const FLASH_MS = 2_200;

/**
 * Polls a cheap version probe and re-renders the page when something new
 * arrived, then flashes the posts that were not on screen before. This is what
 * makes two readers in one thread see each other without reloading.
 */
export function AutoRefresh() {
  const router = useRouter();
  const version = useRef<number | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    let stopped = false;

    async function tick() {
      if (document.hidden || busy.current) return;

      // Never re-render in the middle of typing: a reply form or search field
      // with focus means the reader is composing something.
      const active = document.activeElement;
      const composing =
        !!active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      try {
        const response = await fetch("/api/pulse", { cache: "no-store" });
        if (!response.ok || stopped) return;
        const data = (await response.json()) as { at?: number };
        const at = typeof data.at === "number" ? data.at : 0;

        if (version.current === null) {
          version.current = at;
          return;
        }
        if (at <= version.current) return;

        version.current = at;
        if (composing) return;

        const before = new Set(
          Array.from(document.querySelectorAll('[id^="p-"]'), (node) => node.id),
        );

        busy.current = true;
        router.refresh();

        window.setTimeout(() => {
          busy.current = false;
          const fresh = Array.from(document.querySelectorAll('[id^="p-"]'))
            .map((node) => node.id)
            .filter((id) => !before.has(id));

          for (const id of fresh) {
            const node = document.getElementById(id);
            if (!node) continue;
            node.classList.remove("flash");
            void (node as HTMLElement).offsetWidth;
            node.classList.add("flash");
            window.setTimeout(() => node.classList.remove("flash"), FLASH_MS);
          }
        }, 900);
      } catch {
        // Offline or a slow tick; try again next interval.
      }
    }

    void tick();
    const timer = window.setInterval(() => void tick(), INTERVAL_MS);
    const onVisible = () => {
      if (!document.hidden) void tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
