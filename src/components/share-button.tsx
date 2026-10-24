"use client";

import { useState } from "react";

export function ShareButton({
  path,
  label,
  copiedLabel,
}: {
  path: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = new URL(path, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // The reader dismissed the share sheet.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(label, url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`btn-quiet ${copied ? "text-accent" : ""}`}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
