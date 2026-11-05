"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sticky page header that slides away while scrolling down and comes back on
 * a deliberate upward scroll. Small scroll reversals are ignored so the
 * header stays steady. Focused controls and open menus remain visible.
 */
export function ScrollHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    let last = window.scrollY;
    let distance = 0;
    let hidden = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      // Clamp overscroll so rubber-banding does not reverse the header.
      const next = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
      const delta = next - last;
      last = next;
      distance = Math.sign(delta) === Math.sign(distance) ? distance + delta : delta;
      const interacting = node.contains(document.activeElement) || Boolean(node.querySelector("details[open], [aria-expanded=true]"));
      const shouldHide = next > 140 && !interacting && (hidden ? distance > -14 : distance > 28);
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        distance = 0;
        node.classList.toggle("nav-hidden", hidden);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onFocus = () => {
      hidden = false;
      distance = 0;
      node.classList.remove("nav-hidden");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    node.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      node.removeEventListener("focusin", onFocus);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scroll-header" ref={ref}>
      {children}
    </div>
  );
}
