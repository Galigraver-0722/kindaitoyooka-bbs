"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Keep a closing panel mounted until its short exit transition finishes. */
export function usePanelMotion() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const exit = useRef<Animation | null>(null);

  useEffect(() => () => exit.current?.cancel(), []);

  const close = useCallback(() => {
    if (exit.current) return;
    const node = panel.current;
    if (node?.contains(document.activeElement)) root.current?.querySelector("button")?.focus({ preventScroll: true });
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    const style = getComputedStyle(node);
    const animation = node.animate(
      [{ opacity: style.opacity, transform: style.transform }, { opacity: 0, transform: "translateY(8px) scale(.99)" }],
      { duration: 140, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" },
    );
    exit.current = animation;
    void animation.finished.then(() => {
      exit.current = null;
      setOpen(false);
    }).catch(() => {});
  }, []);

  return { open, setOpen, root, panel, close };
}
