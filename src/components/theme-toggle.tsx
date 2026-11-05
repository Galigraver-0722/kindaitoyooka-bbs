"use client";

import { useRouter } from "next/navigation";
import { startTransition, useLayoutEffect, useRef, type MouseEvent } from "react";

export function ThemeToggle({ theme, labels }: { theme: "light" | "dark"; labels: { dark: string; light: string } }) {
  const router = useRouter();
  const busy = useRef(false);
  const button = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";

  // The light and dark headers mount separate buttons. Keep the overlay on
  // body so the new button can reveal the refreshed page without a reload.
  useLayoutEffect(() => {
    busy.current = false;
    if (document.body.dataset.themeSwitching === theme) {
      delete document.body.dataset.themeSwitching;
      button.current?.focus({ preventScroll: true });
    }
    const wipe = document.querySelector<HTMLElement>("[data-theme-wipe]");
    if (!wipe || wipe.dataset.themeWipe !== theme) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wipe.remove();
      return;
    }
    const reveal = wipe.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 180, easing: "ease-out", fill: "forwards",
    });
    void reveal.finished.then(() => wipe.remove()).catch(() => wipe.remove());
  }, [theme]);

  function flip(event: MouseEvent<HTMLButtonElement>) {
    if (busy.current) return;
    busy.current = true;
    const next = isDark ? "light" : "dark";
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    document.body.dataset.themeSwitching = next;
    const refresh = () => startTransition(() => router.refresh());
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      refresh();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const wipe = document.createElement("div");
    wipe.setAttribute("aria-hidden", "true");
    wipe.dataset.themeWipe = next;
    Object.assign(wipe.style, {
      position: "fixed", inset: "0", zIndex: "400", pointerEvents: "auto",
      background: next === "dark" ? "#040F16" : "#F0FBFE",
      clipPath: `circle(0px at ${x}px ${y}px)`,
    });
    document.body.appendChild(wipe);
    const grow = wipe.animate([
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
    ], { duration: 260, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
    void grow.finished.then(refresh).catch(() => {
      wipe.remove();
      refresh();
    });
  }

  return (
    <button
      type="button"
      className="theme-btn"
      ref={button}
      onClick={flip}
      aria-label={isDark ? labels.light : labels.dark}
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
