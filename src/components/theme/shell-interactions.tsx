"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Keyboard search and dismissible native navigation, with no rendering dependency. */
export function ShellInteractions() {
  const pathname = usePathname();
  useEffect(() => {
    const currentMenu = () => document.querySelector<HTMLDetailsElement>(".bd-drawer");
    const menu = currentMenu();
    if (menu) menu.open = false;
    const keydown = (event: KeyboardEvent) => {
      const menu = currentMenu();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>(".search input, .cmd input")?.focus({ preventScroll: true });
      }
      if (event.key === "Escape" && menu?.open) {
        menu.open = false;
        menu.querySelector<HTMLElement>("summary")?.focus({ preventScroll: true });
      }
    };
    const pointerdown = (event: PointerEvent) => {
      const menu = currentMenu();
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", pointerdown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", pointerdown);
    };
  }, [pathname]);
  return null;
}
