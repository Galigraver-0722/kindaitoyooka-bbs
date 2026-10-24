"use client";

import { useState } from "react";

type ReactionIcon = "heart" | "bookmark";

function Icon({ type, active }: { type: ReactionIcon; active: boolean }) {
  const filled = active ? "currentColor" : "none";

  if (type === "heart") {
    return (
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill={filled}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      >
        <path d="M8 13.1S2.6 9.8 2.6 5.9A2.85 2.85 0 0 1 8 4.05a2.85 2.85 0 0 1 5.4 1.85C13.4 9.8 8 13.1 8 13.1Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      width="13"
      height="14"
      viewBox="0 0 16 16"
      fill={filled}
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinejoin="round"
    >
      <path d="M3.6 2.4h8.8v11.2L8 10.5l-4.4 3.1V2.4Z" />
    </svg>
  );
}

/**
 * A form that still works without JavaScript. When JavaScript is available it
 * toggles immediately and reconciles with the server's JSON answer, rolling the
 * state back if the request fails.
 */
export function ReactionButton({
  action,
  initialActive,
  initialCount,
  activeLabel,
  inactiveLabel,
  errorLabel,
  icon,
}: {
  action: string;
  initialActive: boolean;
  initialCount: number;
  activeLabel: string;
  inactiveLabel: string;
  errorLabel: string;
  icon: ReactionIcon;
}) {
  const [active, setActive] = useState(initialActive);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) {
      return;
    }

    const next = !active;
    setActive(next);
    setCount((value) => Math.max(0, value + (next ? 1 : -1)));
    setPending(true);
    setFailed(false);

    try {
      const response = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(),
        redirect: "manual",
      });

      if (!response.ok) {
        throw new Error("request failed");
      }

      const data = (await response.json()) as { active?: boolean; count?: number };
      if (typeof data.active === "boolean") {
        setActive(data.active);
      }
      if (typeof data.count === "number") {
        setCount(data.count);
      }
    } catch {
      setActive(!next);
      setCount((value) => Math.max(0, value + (next ? -1 : 1)));
      setFailed(true);
      window.setTimeout(() => setFailed(false), 4000);
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={action} method="post" onSubmit={onSubmit} className="inline-flex flex-col gap-1">
      <button
        type="submit"
        disabled={pending}
        aria-pressed={active}
        aria-label={active ? activeLabel : inactiveLabel}
        className={`btn-quiet ${active ? "text-accent" : ""} ${pending ? "opacity-60" : ""}`}
      >
        <Icon type={icon} active={active} />
        <span>{active ? activeLabel : inactiveLabel}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted">{count}</span>
      </button>
      <span role="alert" className={`text-[10px] leading-snug text-error ${failed ? "" : "sr-only"}`}>
        {failed ? errorLabel : ""}
      </span>
    </form>
  );
}
