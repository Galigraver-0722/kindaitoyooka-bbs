"use client";

import { useEffect, useState } from "react";
import { readableInk } from "@/lib/color";

export function ProfileEditor({
  username,
  bio,
  avatarColor,
  avatarRing,
  labels,
}: {
  username: string;
  bio: string;
  avatarColor: string;
  avatarRing: string;
  labels: {
    edit: string;
    title: string;
    close: string;
    bio: string;
    bioPlaceholder: string;
    avatarColor: string;
    ringColor: string;
    cancel: string;
    save: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [currentBio, setCurrentBio] = useState(bio);
  const [color, setColor] = useState(avatarColor);
  const [ring, setRing] = useState(avatarRing);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        {labels.edit}
      </button>

      {open ? (
        <div className="drawer-backdrop" onClick={() => setOpen(false)}>
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-drawer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="drawer-head">
              <h2 id="profile-drawer-title">{labels.title}</h2>
              <button type="button" className="drawer-close" aria-label={labels.close} onClick={() => setOpen(false)}>
                ×
              </button>
            </header>

            <form className="drawer-form" action="/api/profile" method="post">
              <div className="drawer-preview">
                <span
                  className="profile-ava"
                  aria-hidden="true"
                  style={{ background: color, borderColor: ring, color: readableInk(color) }}
                >
                  {username.slice(0, 1).toUpperCase()}
                </span>
                <span className="drawer-handle">@{username}</span>
              </div>

              <label className="field-label" htmlFor="profile-bio">{labels.bio}</label>
              <textarea
                id="profile-bio"
                name="bio"
                maxLength={200}
                rows={4}
                value={currentBio}
                onChange={(event) => setCurrentBio(event.target.value)}
                placeholder={labels.bioPlaceholder}
              />
              <p className="hint">{currentBio.length} / 200</p>

              <div className="color-row">
                <label className="color-field">
                  <span className="field-label">{labels.avatarColor}</span>
                  <input
                    type="color"
                    name="avatarColor"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                  />
                </label>
                <label className="color-field">
                  <span className="field-label">{labels.ringColor}</span>
                  <input
                    type="color"
                    name="avatarRing"
                    value={ring}
                    onChange={(event) => setRing(event.target.value)}
                  />
                </label>
              </div>

              <div className="drawer-foot">
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  {labels.cancel}
                </button>
                <button type="submit" className="btn btn-p">
                  {labels.save}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
