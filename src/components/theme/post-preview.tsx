"use client";

import { useEffect, useState } from "react";

/**
 * Preview for a post body.
 *
 * The textarea is uncontrolled in two of the three forms, so the component
 * reads the field by id instead of lifting the value into React. That keeps the
 * forms working without JavaScript, and the preview is a read-only extra: it
 * never edits the textarea.
 *
 * Rendering matches how a post is displayed (`white-space: pre-wrap`), because
 * the point of a preview is to answer "does this look right when published",
 * not to invent a second markup language.
 */
export function PostPreview({
  fieldId,
  labels,
  maxLength,
}: {
  fieldId: string;
  labels: { open: string; close: string; empty: string; title: string; countUnit: string };
  maxLength: number;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  function read() {
    const field = document.getElementById(fieldId) as HTMLTextAreaElement | null;
    return field?.value ?? "";
  }

  // Keep the preview in step while it is open; listeners are only attached
  // during that window.
  useEffect(() => {
    if (!open) return;
    const field = document.getElementById(fieldId) as HTMLTextAreaElement | null;
    if (!field) return;
    const onInput = () => setText(field.value);
    field.addEventListener("input", onInput);
    return () => field.removeEventListener("input", onInput);
  }, [open, fieldId]);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setText(read());
    setOpen(true);
  }

  return (
    <>
      <button type="button" className="btn ghost pv-toggle" aria-expanded={open} onClick={toggle}>
        {open ? labels.close : labels.open}
      </button>

      {open ? (
        <section className="pv" aria-live="polite">
          <div className="pv-head">
            <b>{labels.title}</b>
            <span className="pv-count">{text.length} / {maxLength} {labels.countUnit}</span>
          </div>
          {text.trim().length === 0 ? (
            <p className="pv-empty">{labels.empty}</p>
          ) : (
            <div className="pv-body">{text}</div>
          )}
        </section>
      ) : null}
    </>
  );
}
