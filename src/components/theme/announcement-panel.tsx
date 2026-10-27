"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { AnnouncementKind } from "@/lib/announcements";

export type AnnouncementItem = {
  id: string;
  date: string;
  kind: AnnouncementKind;
  title: string;
  body: string;
  unread: boolean;
};

/**
 * Official announcements and the changelog, in a panel beside the notification
 * inbox. Opening it clears the dot by writing `User.announcementsSeenAt`.
 *
 * Portalled to <body> for the same reason the inbox is: the header carries
 * `backdrop-filter`, which would otherwise become the containing block for a
 * `position: fixed` panel.
 */
export function AnnouncementPanel({
  items,
  unseen,
  labels,
  themeClass,
  signedIn,
}: {
  items: AnnouncementItem[];
  unseen: number;
  labels: {
    title: string;
    close: string;
    empty: string;
    markSeen: string;
    unreadWord: string;
    kinds: Record<AnnouncementKind, string>;
  };
  themeClass: "tw-d" | "tw-b";
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(unseen);
  const [box, setBox] = useState<{ top: number; right: number; sheet: boolean } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Same placement rule as the inbox: measure the trigger, drop below it, and
  // turn into a bottom sheet on narrow screens.
  const place = useCallback(() => {
    const button = root.current?.querySelector(".ann-btn");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const sheet = window.innerWidth <= 900;
    setBox({
      sheet,
      top: Math.round(rect.bottom + 10),
      right: Math.max(8, Math.round(window.innerWidth - rect.right)),
    });
  }, []);

  useEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    function onClick(event: MouseEvent) {
      const target = event.target as Node;
      if (root.current?.contains(target) || panel.current?.contains(target)) return;
      close();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, close]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && signedIn && count > 0) {
      setCount(0);
      void fetch("/api/announcements/seen", {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      }).catch(() => {});
    }
  }

  return (
    <div className={`ann${open ? " open" : ""}`} ref={root}>
      <button
        type="button"
        className="ann-btn"
        aria-expanded={open}
        aria-label={count > 0 ? `${labels.title} · ${count} ${labels.unreadWord}` : labels.title}
        title={labels.title}
        onClick={toggle}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" />
          <path d="M15 8a5 5 0 0 1 0 8" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
        {count > 0 ? <span className="ann-count">{count > 9 ? "9+" : count}</span> : null}
      </button>

      {open
        ? createPortal(
            <div className={`${themeClass} ann-portal`}>
              <div
                ref={panel}
                className={`ann-panel${box?.sheet ? " sheet" : ""}`}
                role="dialog"
                aria-label={labels.title}
                style={{
                  visibility: box ? "visible" : "hidden",
                  ...(box?.sheet ? {} : { top: box?.top, right: box?.right, left: "auto" }),
                }}
              >
                <div className="ann-head">
                  <b>{labels.title}</b>
                  <button type="button" className="ann-close" onClick={close} aria-label={labels.close}>×</button>
                </div>
                {items.length === 0 ? (
                  <p className="ann-empty">{labels.empty}</p>
                ) : (
                  <ol className="ann-list">
                    {items.map((item) => (
                      <li key={item.id} className={item.unread ? "is-unread" : ""}>
                        <div className="ann-meta">
                          <span className={`ann-kind k-${item.kind}`}>{labels.kinds[item.kind]}</span>
                          <time dateTime={item.date}>{item.date}</time>
                          {item.unread ? <span className="ann-dot" aria-hidden="true" /> : null}
                        </div>
                        <h3>{item.title}</h3>
                        <p className="ann-body">{item.body}</p>
                      </li>
                    ))}
                  </ol>
                )}
                <p className="ann-foot">{signedIn ? labels.markSeen : ""}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
