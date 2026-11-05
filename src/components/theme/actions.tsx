"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { publishCount, subscribeCounts } from "@/components/theme/live-counts";

const ICONS = {
  like: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
    </svg>
  ),
  save: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <path d="M7 4h10v17l-5-4-5 4Z" />
    </svg>
  ),
};

/**
 * Optimistic like / save toggle. Talks to the JSON branch of the API so the
 * page never reloads: no white flash, no scroll jump.
 */
export function ToggleAction({
  kind,
  endpoint,
  initialCount,
  initialActive,
  label,
  large = false,
}: {
  kind: "like" | "save";
  endpoint: string;
  initialCount: number;
  initialActive: boolean;
  label: string;
  large?: boolean;
}) {
  const router = useRouter();
  // `useId` is stable across tabs (same tree position), which would make the
  // second tab mistake another tab's broadcast for its own echo. A random token
  // per mounted button keeps "ignore my own event" honest across tabs.
  const [instanceId] = useState(() => `t${Math.random().toString(36).slice(2)}`);
  const [active, setActive] = useState(initialActive);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [fromServer, setFromServer] = useState({ count: initialCount, active: initialActive });

  // Another button for the same record (this page or another tab) already got
  // the server's answer; mirror it instead of waiting for a refresh.
  useEffect(
    () =>
      subscribeCounts((update) => {
        if (update.endpoint !== endpoint || update.source === instanceId) {
          return;
        }
        setCount(Math.max(0, update.count));
        setActive(update.active);
      }),
    [endpoint, instanceId],
  );

  // A server refresh (AutoRefresh) brings new numbers, but React ignores later
  // values of `useState`'s argument. Adopt the server's numbers unless our own
  // optimistic toggle is still in flight.
  if (!busy && (fromServer.count !== initialCount || fromServer.active !== initialActive)) {
    setFromServer({ count: initialCount, active: initialActive });
    setCount(initialCount);
    setActive(initialActive);
  }

  async function toggle() {
    if (busy) {
      return;
    }

    const next = !active;
    setActive(next);
    setCount((value) => Math.max(0, value + (next ? 1 : -1)));
    setBusy(true);

    if (next) {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 340);
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });

      if (response.status === 401) {
        const here = `${window.location.pathname}${window.location.search}`;
        router.push(`/login?next=${encodeURIComponent(here)}`);
        return;
      }
      if (!response.ok) {
        throw new Error(String(response.status));
      }

      const data = (await response.json()) as { active?: boolean; count?: number };
      const nextActive = typeof data.active === "boolean" ? data.active : next;
      const nextCount =
        typeof data.count === "number"
          ? Math.max(0, data.count)
          : Math.max(0, count + (next ? 1 : -1));
      setActive(nextActive);
      setCount(nextCount);
      publishCount({ endpoint, count: nextCount, active: nextActive, source: instanceId });
      // Store the new numbers in the Router Cache too, so going back to this
      // list does not show the pre-click count.
      router.refresh();
    } catch {
      setActive(!next);
      setCount((value) => Math.max(0, value + (next ? -1 : 1)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={`act ${kind}${active ? " on" : ""}${pulse ? " pulse" : ""}${large ? " act-lg" : ""}`}
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={toggle}
    >
      {ICONS[kind]}
      <span>{count}</span>
    </button>
  );
}
