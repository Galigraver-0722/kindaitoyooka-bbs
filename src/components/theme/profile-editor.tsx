"use client";

import { useEffect, useState } from "react";
import { readableInk } from "@/lib/color";

export function ProfileEditor({
  username,
  bio,
  avatarColor,
  avatarRing,
}: {
  username: string;
  bio: string;
  avatarColor: string;
  avatarRing: string;
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
        編集
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
              <h2 id="profile-drawer-title">プロフィールを編集</h2>
              <button type="button" className="drawer-close" aria-label="閉じる" onClick={() => setOpen(false)}>
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

              <label className="field-label" htmlFor="profile-bio">自己紹介</label>
              <textarea
                id="profile-bio"
                name="bio"
                maxLength={200}
                rows={4}
                value={currentBio}
                onChange={(event) => setCurrentBio(event.target.value)}
                placeholder="部活、好きな科目、ひとこと。"
              />
              <p className="hint">{currentBio.length} / 200</p>

              <div className="color-row">
                <label className="color-field">
                  <span className="field-label">アイコンの色</span>
                  <input
                    type="color"
                    name="avatarColor"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                  />
                </label>
                <label className="color-field">
                  <span className="field-label">枠の色</span>
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
                  キャンセル
                </button>
                <button type="submit" className="btn btn-p">
                  保存する
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
