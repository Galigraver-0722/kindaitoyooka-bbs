"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { ToggleAction } from "@/components/theme/actions";
import { Highlight } from "@/components/theme/highlight";
import { readableInk } from "@/lib/color";

const replyIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M20 15a3 3 0 0 1-3 3H9l-4 3V7a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3Z" />
  </svg>
);

export type CommentData = {
  id: string;
  number: string;
  body: string;
  author: {
    username: string;
    role: string;
    avatarColor: string | null;
    avatarRing: string | null;
  };
  createdAt: string;
  likeCount: number;
  liked: boolean;
  children: CommentData[];
};

export type CommentLabels = {
  reply: string;
  placeholder: string;
  submit: string;
  collapse: string;
  expand: string;
  foldedSuffix: string;
  like: string;
  sendError: string;
  commentsSuffix: string;
  admin: string;
  moderator: string;
  report: string;
  reportPlaceholder: string;
  sendReport: string;
};

const foldListeners = new Set<() => void>();

function subscribeFolds(listener: () => void) {
  foldListeners.add(listener);
  return () => {
    foldListeners.delete(listener);
  };
}

function readFold(key: string) {
  return typeof window !== "undefined" && window.localStorage.getItem(key) === "1";
}

function writeFold(key: string, collapsed: boolean) {
  window.localStorage.setItem(key, collapsed ? "1" : "0");
  foldListeners.forEach((listener) => listener());
}

function countTree(nodes: CommentData[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countTree(node.children), 0);
}

function insertReply(list: CommentData[], parentId: string | null, node: CommentData): CommentData[] {
  if (parentId === null) {
    return [...list, node];
  }

  return list.map((comment) =>
    comment.id === parentId
      ? { ...comment, children: [...comment.children, node] }
      : { ...comment, children: insertReply(comment.children, parentId, node) },
  );
}

function renumber(list: CommentData[], prefix = ""): CommentData[] {
  return list.map((comment, index) => {
    const number = prefix ? `${prefix}-${index + 1}` : String(index + 1);
    return { ...comment, number, children: renumber(comment.children, number) };
  });
}

function ReplyForm({
  threadId,
  parentId,
  labels,
  onPosted,
}: {
  threadId: string;
  parentId?: string;
  labels: CommentLabels;
  onPosted: (comment: CommentData) => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || value.trim().length === 0) {
      return;
    }

    setBusy(true);
    setError(false);

    const body = new FormData();
    body.set("body", value);
    if (parentId) {
      body.set("parentId", parentId);
    }

    try {
      const response = await fetch(`/api/threads/${threadId}/posts`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });

      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!response.ok) {
        setError(true);
        return;
      }

      const data = (await response.json()) as { comment: CommentData };
      onPosted(data.comment);
      setValue("");
      // Keep the cached copy of this thread in step with the server.
      router.refresh();
      event.currentTarget.closest("details")?.removeAttribute("open");
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="reply-form" onSubmit={submit}>
      <textarea
        name="body"
        required
        maxLength={2000}
        placeholder={labels.placeholder}
        aria-label={labels.placeholder}
        rows={3}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="form-foot">
        <button className="btn btn-p" type="submit" disabled={busy}>
          {labels.submit}
        </button>
        {error ? <span className="hint">{labels.sendError}</span> : null}
      </div>
    </form>
  );
}

function Comment({
  data,
  threadId,
  canReply,
  labels,
  viewer,
  highlight,
  onReply,
}: {
  data: CommentData;
  threadId: string;
  canReply: boolean;
  labels: CommentLabels;
  viewer: string | null;
  highlight?: string;
  onReply: (parentId: string, comment: CommentData) => void;
}) {
  const storageKey = `fold:${threadId}:${data.id}`;
  const collapsed = useSyncExternalStore(
    subscribeFolds,
    () => readFold(storageKey),
    () => false,
  );
  const hiddenReplies = countTree(data.children);
  const role = data.author.role === "ADMIN" ? labels.admin : data.author.role === "MODERATOR" ? labels.moderator : null;

  function toggle() {
    writeFold(storageKey, !collapsed);
  }

  return (
    <div className={`cmt${collapsed ? " folded" : ""}`} id={`p-${data.id}`}>
      <div className="cmt-head">
        <button
          type="button"
          className="cmt-fold"
          aria-expanded={!collapsed}
          aria-label={collapsed ? labels.expand : labels.collapse}
          title={collapsed ? labels.expand : labels.collapse}
          onClick={toggle}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d={collapsed ? "M9 6l6 6-6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
        <span className="cmt-no">{data.number}</span>
        <span className="cmt-who">
          <span
            className="dot"
            style={{
              background: data.author.avatarColor ?? undefined,
              borderColor: data.author.avatarRing ?? undefined,
              color: readableInk(data.author.avatarColor),
            }}
          >
            {data.author.username.slice(0, 1).toUpperCase()}
          </span>
          {data.author.username}
        </span>
        <span className="cmt-time">{data.createdAt}</span>
        {role ? <span className="pill role">{role}</span> : null}
        {collapsed ? (
          <button type="button" className="cmt-folded" onClick={toggle}>
            {hiddenReplies} {labels.foldedSuffix}
          </button>
        ) : null}
      </div>

      {collapsed ? null : (
        <>
          <div className="cmt-body"><Highlight text={data.body} term={highlight} /></div>

          <div className="acts cmt-acts">
            <ToggleAction
              kind="like"
              endpoint={`/api/posts/${data.id}/like`}
              initialCount={data.likeCount}
              initialActive={data.liked}
              label={labels.like}
            />
            {canReply ? (
              <details className="reply-box">
                <summary className="act reply-btn">
                  {replyIcon}
                  <span>{labels.reply}</span>
                </summary>
                <ReplyForm
                  threadId={threadId}
                  parentId={data.id}
                  labels={labels}
                  onPosted={(comment) => onReply(data.id, comment)}
                />
              </details>
            ) : null}
          </div>
          {viewer && viewer !== data.author.username ? (
            <details className="report-box">
              <summary className="act report-btn">
                <span>{labels.report}</span>
              </summary>
              <form className="reply-form" action="/api/reports" method="post">
                <input type="hidden" name="postId" value={data.id} />
                <textarea
                  name="reason"
                  required
                  minLength={3}
                  maxLength={500}
                  rows={2}
                  placeholder={labels.reportPlaceholder}
                  aria-label={labels.reportPlaceholder}
                />
                <button className="btn btn-p" type="submit">{labels.sendReport}</button>
              </form>
            </details>
          ) : null}

          {data.children.length > 0 ? (
            <div className="cmt-kids">
              {data.children.map((child) => (
                <Comment
                  key={child.id}
                  data={child}
                  threadId={threadId}
                  canReply={canReply}
                  labels={labels}
                  viewer={viewer}
                  highlight={highlight}
                  onReply={onReply}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

/** Comment tree plus the bottom reply box; both update without a reload. */
export function CommentSection({
  threadId,
  initial,
  canReply,
  labels,
  emptyText,
  loginText,
  loginLabel,
  viewer,
  highlight,
}: {
  threadId: string;
  initial: CommentData[];
  canReply: boolean;
  labels: CommentLabels;
  emptyText: string;
  loginText: string;
  loginLabel: string;
  viewer: string | null;
  highlight?: string;
}) {
  const [comments, setComments] = useState<CommentData[]>(initial);

  const add = (parentId: string | null, comment: CommentData) => {
    setComments((prev) => renumber(insertReply(prev, parentId, comment)));
  };

  return (
    <>
      <div className="feed-bar comments-head">
        <h2>
          <span className="tick" />
          {comments.length} {labels.commentsSuffix}
        </h2>
      </div>

      {comments.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <div className="cmt-tree">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              data={comment}
              threadId={threadId}
              canReply={canReply}
              labels={labels}
              viewer={viewer}
              highlight={highlight}
              onReply={(parentId, posted) => add(parentId, posted)}
            />
          ))}
        </div>
      )}

      {canReply ? (
        <div className="form-card" id="reply-form">
          <h2>{labels.reply}</h2>
          <ReplyForm
            threadId={threadId}
            labels={labels}
            onPosted={(comment) => add(null, comment)}
          />
        </div>
      ) : (
        <p className="notice">
          {loginText} <a href={`/login?next=${encodeURIComponent(`/t/${threadId}`)}`}>{loginLabel}</a>
        </p>
      )}
    </>
  );
}
