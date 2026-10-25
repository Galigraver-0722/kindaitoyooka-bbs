import type { ReactNode } from "react";
import { splitHighlight } from "@/lib/highlight";

/**
 * Renders text with the current search term marked. Pure and server-safe, so
 * both the server pages and client comment trees can use it.
 */
export function Highlight({ text, term }: { text: string; term?: string }): ReactNode {
  const parts = splitHighlight(text, term);
  if (parts.every((part) => !part.hit)) {
    return text;
  }
  return (
    <>
      {parts.map((part, index) =>
        part.hit ? (
          <mark className="hl" key={`${part.text}-${index}`}>{part.text}</mark>
        ) : (
          <span key={`${index}-${part.text.length}`}>{part.text}</span>
        ),
      )}
    </>
  );
}
