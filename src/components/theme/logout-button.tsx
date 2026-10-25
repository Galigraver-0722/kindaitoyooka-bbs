"use client";

import { useState } from "react";

/** Logout asks for confirmation in a small overlay before posting the form. */
export function LogoutButton({
  label,
  title,
  text,
  confirm,
  cancel,
}: {
  label: string;
  title: string;
  text: string;
  confirm: string;
  cancel: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open ? (
        <div className="confirm" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
          <div className="confirm-card">
            <h2 id="logout-confirm-title">{title}</h2>
            <p>{text}</p>
            <div className="confirm-foot">
              <button type="button" className="btn" onClick={() => setOpen(false)} disabled={busy}>
                {cancel}
              </button>
              <form
                action="/api/auth/logout"
                method="post"
                onSubmit={() => setBusy(true)}
              >
                <button className="btn btn-p" type="submit" disabled={busy}>
                  {confirm}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
