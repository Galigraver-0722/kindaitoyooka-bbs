"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "@/components/icons";

export function ComposeFab({ label }: { label: string }) {
  const pathname = usePathname();

  if (pathname === "/new") {
    return null;
  }

  return (
    <Link
      href="/new"
      aria-label={label}
      title={label}
      className="compose-fab fixed bottom-5 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent-hover/30 bg-accent text-white shadow-[0_10px_30px_rgba(36,38,34,0.2)] transition-transform duration-150 hover:scale-[1.04] hover:bg-accent-hover active:scale-95 sm:bottom-8 sm:right-8"
    >
      <PlusIcon size={20} />
    </Link>
  );
}
