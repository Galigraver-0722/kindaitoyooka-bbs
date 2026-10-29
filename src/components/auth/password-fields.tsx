"use client";

import { useId, useState } from "react";
import { passwordStrength } from "@/lib/password-strength";

/**
 * Password input with a reveal toggle, plus, on the registration form, a
 * confirmation field and live feedback.
 *
 * Without JavaScript the form still works: both inputs are named and the server
 * checks the length and the match. Everything here is an enhancement layered on
 * top of that.
 *
 * The labels arrive as plain strings, not functions: server components cannot
 * pass functions to a client component.
 */
export type PasswordFieldLabels = {
  passwordLabel: string;
  show: string;
  hide: string;
  confirmLabel: string;
  minLabel: string;
  matchLabel: string;
  mismatchLabel: string;
  strengthLabel: string;
  weak: string;
  fair: string;
  strong: string;
};

function Eye({ off }: { off: boolean }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.7 9.7 0 0 1 12 6c4.4 0 8 3.6 9 6a10.6 10.6 0 0 1-3 3.9" />
      <path d="M6.4 6.4A10.8 10.8 0 0 0 3 12c1 2.4 4.6 6 9 6 1.3 0 2.5-.3 3.6-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12c1-2.4 4.6-6 9-6s8 3.6 9 6c-1 2.4-4.6 6-9 6s-8-3.6-9-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PasswordFields({
  mode,
  minLength,
  labels,
}: {
  mode: "login" | "register";
  minLength: number;
  labels: PasswordFieldLabels;
}) {
  const base = useId();
  const passwordId = `${base}-password`;
  const confirmId = `${base}-confirm`;

  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [reveal, setReveal] = useState(false);
  const [revealConfirm, setRevealConfirm] = useState(false);

  const strength = passwordStrength(value, minLength);
  const strengthWord =
    strength.score >= 3 ? labels.strong : strength.score === 2 ? labels.fair : labels.weak;
  const matchState = confirm.length === 0 ? "idle" : confirm === value ? "ok" : "bad";

  return (
    <>
      <label className="field-label" htmlFor={passwordId}>{labels.passwordLabel}</label>
      <div className="pw-wrap">
        <input
          id={passwordId}
          name="password"
          type={reveal ? "text" : "password"}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={minLength}
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-describedby={mode === "register" ? `${passwordId}-notes` : undefined}
        />
        <button
          type="button"
          className="pw-toggle"
          onClick={() => setReveal((current) => !current)}
          aria-pressed={reveal}
          aria-label={reveal ? labels.hide : labels.show}
          title={reveal ? labels.hide : labels.show}
        >
          <Eye off={reveal} />
        </button>
      </div>

      {mode === "register" ? (
        <div className="pw-notes" id={`${passwordId}-notes`} aria-live="polite">
          <p className={`pw-req ${strength.longEnough ? "ok" : "bad"}`}>
            <span aria-hidden="true">{strength.longEnough ? "✓" : "·"}</span> {labels.minLabel}
          </p>
          <div className="pw-meter" data-score={strength.score} aria-hidden="true">
            <i /><i /><i />
          </div>
          <p className="pw-strength">
            {labels.strengthLabel}: {value.length === 0 ? "—" : strengthWord}
          </p>
        </div>
      ) : null}

      {mode === "register" ? (
        <>
          <label className="field-label" htmlFor={confirmId}>{labels.confirmLabel}</label>
          <div className="pw-wrap">
            <input
              id={confirmId}
              name="passwordConfirm"
              type={revealConfirm ? "text" : "password"}
              autoComplete="new-password"
              minLength={minLength}
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              aria-describedby={`${confirmId}-state`}
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setRevealConfirm((current) => !current)}
              aria-pressed={revealConfirm}
              aria-label={revealConfirm ? labels.hide : labels.show}
              title={revealConfirm ? labels.hide : labels.show}
            >
              <Eye off={revealConfirm} />
            </button>
          </div>
          <p className={`pw-check ${matchState}`} id={`${confirmId}-state`} aria-live="polite">
            {matchState === "idle" ? "" : matchState === "ok" ? labels.matchLabel : labels.mismatchLabel}
          </p>
        </>
      ) : null}
    </>
  );
}
