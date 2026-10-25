"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type InboxItem = {
  id: string;
  kind: "reply" | "comment" | "like" | "post-like" | "bookmark";
  actor: string;
  message: string;
  when: string;
  href: string;
  excerpt?: string;
};

/** Badge label; anything above 99 would stretch the pill, so it is capped. */
export function formatUnread(count: number): string {
  if (count <= 0) return "";
  return count > 99 ? "99+" : String(count);
}

const ICONS: Record<InboxItem["kind"], string> = {
  reply: "M9 17H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v2",
  comment: "M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z",
  like: "M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z",
  "post-like": "M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z",
  bookmark: "M7 4h10v17l-5-4-5 4Z",
};

/**
 * Header inbox. The events are derived on the server from rows that already
 * exist; this component only owns the popup and the "seen" timestamp.
 */
export function NotificationInbox({
  items,
  unseen,
  labels,
  themeClass,
}: {
  items: InboxItem[];
  unseen: number;
  themeClass: "tw-d" | "tw-b";
  labels: { title: string; empty: string; markSeen: string; open: string; close: string; unreadWord: string };
}) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(unseen);
  const [panelBox, setPanelBox] = useState<{ top: number; right: number; sheet: boolean } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  /**
   * The header carries `backdrop-filter`, which makes it the containing block
   * for `position: fixed` children (the same trap the floating button hit).
   * The panel is therefore portalled to <body> and placed from the button's
   * measured rectangle, or as a bottom sheet on narrow screens.
   */
  const place = useCallback(() => {
    const button = root.current?.querySelector(".inbox-btn");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const sheet = window.innerWidth <= 900;
    setPanelBox({
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
    if (next && count > 0) {
      setCount(0);
      void fetch("/api/notifications/seen", {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      }).catch(() => {});
    }
  }

  return (
    <div className={`inbox${open ? " open" : ""}`} ref={root}>
      <button
        type="button"
        className="inbox-btn"
        aria-label={count > 0 ? `${labels.title} · ${count} ${labels.unreadWord}` : labels.title}
        aria-expanded={open}
        onClick={toggle}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
          <path d="M10.3 20a2 2 0 0 0 3.4 0" />
        </svg>
        {count > 0 ? <span className="inbox-count">{formatUnread(count)}</span> : null}
      </button>

      {open
        ? createPortal(
            <div className={`${themeClass} inbox-portal`}>
            <div
              ref={panel}
              className={`inbox-panel${panelBox?.sheet ? " sheet" : ""}`}
              role="dialog"
              aria-label={labels.title}
              style={{
                visibility: panelBox ? "visible" : "hidden",
                ...(panelBox?.sheet
                  ? {}
                  : { top: panelBox?.top, right: panelBox?.right, left: "auto", bottom: "auto" }),
              }}
            >
          <div className="inbox-head">
            <b>{labels.title}</b>
            <button type="button" className="inbox-close" onClick={close} aria-label={labels.close}>×</button>
          </div>
          {items.length === 0 ? (
            <p className="inbox-empty">{labels.empty}</p>
          ) : (
            <ul className="inbox-list">
              {items.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} onClick={close}>
                    <span className={`inbox-icon k-${item.kind}`} aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={ICONS[item.kind]} />
                      </svg>
                    </span>
                    <span className="inbox-text">
                      <span className="inbox-msg">{item.message}</span>
                      {item.excerpt ? <span className="inbox-excerpt">{item.excerpt}</span> : null}
                      <span className="inbox-when">{item.when}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
            </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
