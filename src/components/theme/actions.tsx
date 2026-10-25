"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [active, setActive] = useState(initialActive);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [pulse, setPulse] = useState(false);

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
      if (typeof data.active === "boolean") {
        setActive(data.active);
      }
      if (typeof data.count === "number") {
        setCount(Math.max(0, data.count));
      }
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
