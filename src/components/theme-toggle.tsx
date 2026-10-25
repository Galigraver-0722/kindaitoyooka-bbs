"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";

const SCROLL_KEY = "theme-scroll";

export function ThemeToggle({ theme }: { theme: "light" | "dark" }) {
  const busy = useRef(false);
  const isDark = theme === "dark";

  // The switch is a full reload (two independent designs), so put the reader
  // back where they were. A layout effect restores before the first paint.
  useLayoutEffect(() => {
    let y: string | null = null;
    try {
      y = sessionStorage.getItem(SCROLL_KEY);
      if (y !== null) sessionStorage.removeItem(SCROLL_KEY);
    } catch {}
    if (y !== null && Number(y) > 0) {
      window.scrollTo(0, Number(y));
    }
  }, []);

  function flip(event: MouseEvent<HTMLButtonElement>) {
    if (busy.current) return;
    busy.current = true;

    const next = isDark ? "light" : "dark";
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;

    try {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    } catch {}

    // The header has backdrop-filter, which makes it a containing block for
    // fixed children, so the wipe is created on <body> instead of in the JSX.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      window.location.reload();
      return;
    }

    const wipe = document.createElement("div");
    wipe.setAttribute("aria-hidden", "true");
    Object.assign(wipe.style, {
      position: "fixed",
      inset: "0",
      zIndex: "400",
      pointerEvents: "none",
      opacity: "1",
      background: next === "dark" ? "#040F16" : "#F0FBFE",
    });
    document.body.appendChild(wipe);

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    wipe.style.clipPath = `circle(0px at ${x}px ${y}px)`;

    const grow = wipe.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(150vmax at ${x}px ${y}px)` },
      ],
      { duration: 300, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
    );
    grow.onfinish = () => window.location.reload();
  }

  return (
    <button
      type="button"
      className="theme-btn"
      onClick={flip}
      aria-label={isDark ? "ライトモードに切り替える" : "ダークモードに切り替える"}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
      )}
      <span>{isDark ? "LIGHT" : "DARK"}</span>
    </button>
  );
}
