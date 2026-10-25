"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Delete asks first, in the same overlay the logout uses. The final step is a
 * plain HTML form, so the removal itself does not depend on JavaScript.
 *
 * The dialog is portalled to <body> for the same reason the inbox is: the
 * header carries `backdrop-filter`, which turns it into the containing block
 * for `position: fixed` descendants, and a comment sits inside several nested
 * flex/relative wrappers. Rendering the overlay in place would put it at the
 * mercy of every ancestor's clipping and stacking; from <body> it always covers
 * the viewport.
 */
export function DeleteButton({
  action,
  label,
  title,
  text,
  confirm,
  cancel,
  compact = false,
}: {
  action: string;
  label: string;
  title: string;
  text: string;
  confirm: string;
  cancel: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [themeClass, setThemeClass] = useState<"tw-d" | "tw-b">("tw-d");
  const trigger = useRef<HTMLButtonElement>(null);

  function openDialog() {
    // The scoped theme class carries the design tokens; the portal leaves the
    // themed subtree, so it has to be re-applied on the wrapper.
    const host = trigger.current?.closest(".tw-d, .tw-b");
    setThemeClass(host?.classList.contains("tw-b") ? "tw-b" : "tw-d");
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={compact ? "act delete-btn" : "btn ghost delete-btn"}
        onClick={openDialog}
        aria-label={label}
        title={label}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {compact ? <span>{label}</span> : label}
      </button>

      {open
        ? createPortal(
            <div className={`${themeClass} confirm-portal`}>
              <div
                className="confirm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-confirm-title"
                onClick={(event) => {
                  if (event.target === event.currentTarget) setOpen(false);
                }}
              >
                <div className="confirm-card">
                  <h2 id="delete-confirm-title">{title}</h2>
                  <p>{text}</p>
                  <div className="confirm-foot">
                    <button type="button" className="btn" onClick={() => setOpen(false)}>
                      {cancel}
                    </button>
                    {/* The submit button stays enabled: disabling the submitter
                        inside submit can cancel the navigation, which looked
                        like "the delete did nothing". */}
                    <form action={action} method="post">
                      <button type="submit" className="btn danger">{confirm}</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
