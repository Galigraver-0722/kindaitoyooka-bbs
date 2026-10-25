"use client";

import { useRouter } from "next/navigation";

/** Returns to the previous page; falls back to the feed when there is no history. */
export function BackButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="nav-btn"
      aria-label={label}
      title={label}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
    </button>
  );
}
