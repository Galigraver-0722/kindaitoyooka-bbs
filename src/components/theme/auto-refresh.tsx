"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";

const INTERVAL_MS = 12_000;
const FLASH_MS = 2_200;
/** Replies, comments and the opening post; thread cards and rows carry `t-`. */
const WATCH_SELECTOR = '[id^="p-"],[id^="t-"]';
/** Safety net for a refresh that settles without the transition ever pending. */
const SETTLE_MS = 1_800;

/**
 * Keeps an open page live: polls a cheap version probe, re-renders the server
 * components when the number moved, then flashes the items that were not on
 * screen before.
 *
 * The flash is applied when the refresh has actually committed. An earlier
 * version waited a fixed 900 ms and compared ids afterwards, which silently
 * missed slow renders; `useTransition` reports real completion instead.
 */
export function AutoRefresh() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const version = useRef<number | null>(null);
  const before = useRef<Set<string>>(new Set());
  const armed = useRef(false);
  const settle = useRef<number | null>(null);

  const snapshot = useCallback(
    () => Array.from(document.querySelectorAll(WATCH_SELECTOR), (node) => node.id),
    [],
  );

  const flush = useCallback(() => {
    if (!armed.current) return;
    armed.current = false;
    if (settle.current !== null) {
      window.clearTimeout(settle.current);
      settle.current = null;
    }

    const seen = before.current;
    for (const id of snapshot()) {
      if (seen.has(id)) continue;
      const node = document.getElementById(id);
      if (!node) continue;
      node.classList.remove("flash");
      void (node as HTMLElement).offsetWidth;
      node.classList.add("flash");
      window.setTimeout(() => node.classList.remove("flash"), FLASH_MS);
    }
  }, [snapshot]);

  // The transition turns false once the refreshed tree is on screen.
  useEffect(() => {
    if (!pending) flush();
  }, [pending, flush]);

  useEffect(() => {
    let stopped = false;

    async function tick() {
      if (document.hidden || armed.current) return;

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

        before.current = new Set(snapshot());
        armed.current = true;
        settle.current = window.setTimeout(flush, SETTLE_MS);
        startTransition(() => router.refresh());
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
  }, [router, snapshot, flush, startTransition]);

  return null;
}
