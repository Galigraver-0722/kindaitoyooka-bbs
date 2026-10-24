"use client";

import { useState } from "react";
import { BookmarkIcon, HeartIcon } from "@/components/icons";

type ReactionIcon = "heart" | "bookmark";

function Icon({ type, active }: { type: ReactionIcon; active: boolean }) {
  return type === "heart" ? (
    <HeartIcon filled={active} size={16} />
  ) : (
    <BookmarkIcon filled={active} size={16} />
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
  compact = false,
  showCount = true,
  hideRowWhenInactive = false,
}: {
  action: string;
  initialActive: boolean;
  initialCount: number;
  activeLabel: string;
  inactiveLabel: string;
  errorLabel: string;
  icon: ReactionIcon;
  compact?: boolean;
  showCount?: boolean;
  hideRowWhenInactive?: boolean;
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
    const form = event.currentTarget;

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
      if (hideRowWhenInactive && data.active === false) {
        form.closest("li")?.classList.add("hidden");
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
        title={active ? activeLabel : inactiveLabel}
        className={`btn-quiet ${compact ? "justify-center px-1.5" : ""} ${
          active ? "text-accent" : ""
        } ${pending ? "opacity-60" : ""}`}
      >
        <Icon type={icon} active={active} />
        {compact ? null : <span>{active ? activeLabel : inactiveLabel}</span>}
        {showCount ? (
          <span className="font-mono text-[12px] tabular-nums text-muted">{count}</span>
        ) : null}
      </button>
      <span role="alert" className={`text-[10px] leading-snug text-error ${failed ? "" : "sr-only"}`}>
        {failed ? errorLabel : ""}
      </span>
    </form>
  );
}
