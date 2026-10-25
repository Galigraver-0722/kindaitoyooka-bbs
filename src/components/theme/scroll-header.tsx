"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sticky page header that slides away while scrolling down and comes back on
 * the first upward scroll, so a tall bar does not sit on top of the reading
 * area the whole time.
 */
export function ScrollHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    let last = window.scrollY;
    let hidden = false;

    const onScroll = () => {
      const next = window.scrollY;
      const goingDown = next > last && next > 140;

      if (goingDown !== hidden) {
        hidden = goingDown;
        node.classList.toggle("nav-hidden", hidden);
      }
      last = next;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-header" ref={ref}>
      {children}
    </div>
  );
}
