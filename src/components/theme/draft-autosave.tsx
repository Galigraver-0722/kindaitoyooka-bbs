"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Autosaves the composer to `/api/drafts` while the reader types, and offers a
 * button that saves immediately.
 *
 * It attaches to the existing form instead of owning the fields, so the form
 * stays a plain server-rendered `<form>`: without JavaScript nothing here runs
 * and submitting still works.
 */
export function DraftAutosave({
  formId,
  labels,
}: {
  formId: string;
  labels: { hint: string; saving: string; saved: string; failed: string; saveNow: string };
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [at, setAt] = useState<string>("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form || !form.isConnected) {
      return;
    }
    setState("saving");
    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) {
        setState("failed");
        return;
      }
      const payload = (await response.json().catch(() => null)) as { savedAt?: string } | null;
      const when = payload?.savedAt ? new Date(payload.savedAt) : new Date();
      setAt(when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setState("saved");
    } catch {
      setState("failed");
    }
  }, [formId]);

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) {
      return;
    }

    const schedule = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        void save();
      }, 2500);
    };

    form.addEventListener("input", schedule);
    form.addEventListener("change", schedule);
    form.addEventListener("focusout", schedule);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      form.removeEventListener("input", schedule);
      form.removeEventListener("change", schedule);
      form.removeEventListener("focusout", schedule);
    };
  }, [formId, save]);

  const text =
    state === "saving"
      ? labels.saving
      : state === "saved"
        ? `${labels.saved} ${at}`
        : state === "failed"
          ? labels.failed
          : labels.hint;

  return (
    <div className="draft-bar">
      <button
        type="button"
        className="btn ghost draft-save"
        onClick={() => {
          // A pending debounce would fire on top of this save; clear it first.
          if (timer.current) {
            clearTimeout(timer.current);
          }
          void save();
        }}
        disabled={state === "saving"}
        title={labels.hint}
      >
        {labels.saveNow}
      </button>
      <p className={`draft-status ${state}`} role="status" aria-live="polite" title={labels.hint}>
        {text}
      </p>
    </div>
  );
}
