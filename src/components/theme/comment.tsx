"use client";

import { useState } from "react";
import { ToggleAction } from "@/components/theme/actions";

const replyIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M20 15a3 3 0 0 1-3 3H9l-4 3V7a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3Z" />
  </svg>
);

export type CommentData = {
  id: string;
  number: string;
  body: string;
  author: { username: string; role: string };
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
  admin: string;
  moderator: string;
};

function countTree(nodes: CommentData[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countTree(node.children), 0);
}

/** One comment and its replies, collapsible like a Reddit thread. */
export function Comment({
  data,
  threadId,
  canReply,
  labels,
}: {
  data: CommentData;
  threadId: string;
  canReply: boolean;
  labels: CommentLabels;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const hiddenReplies = countTree(data.children);
  const role = data.author.role === "ADMIN" ? labels.admin : data.author.role === "MODERATOR" ? labels.moderator : null;

  return (
    <div className={`cmt${collapsed ? " folded" : ""}`} id={`p-${data.id}`}>
      <div className="cmt-head">
        <button
          type="button"
          className="cmt-fold"
          aria-expanded={!collapsed}
          aria-label={collapsed ? labels.expand : labels.collapse}
          title={collapsed ? labels.expand : labels.collapse}
          onClick={() => setCollapsed((value) => !value)}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d={collapsed ? "M9 6l6 6-6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
        <span className="cmt-no">{data.number}</span>
        <span className="cmt-who">
          <span className="dot">{data.author.username.slice(0, 1).toUpperCase()}</span>
          {data.author.username}
        </span>
        <span className="cmt-time">{data.createdAt}</span>
        {role ? <span className="pill role">{role}</span> : null}
        {collapsed ? (
          <button type="button" className="cmt-folded" onClick={() => setCollapsed(false)}>
            {hiddenReplies} {labels.foldedSuffix}
          </button>
        ) : null}
      </div>

      {collapsed ? null : (
        <>
          <div className="cmt-body">{data.body}</div>

          <div className="acts cmt-acts">
            <ToggleAction
              kind="like"
              endpoint={`/api/posts/${data.id}/like`}
              initialCount={data.likeCount}
              initialActive={data.liked}
            />
            {canReply ? (
              <details className="reply-box">
                <summary className="act reply-btn">
                  {replyIcon}
                  <span>{labels.reply}</span>
                </summary>
                <form className="reply-form" action={`/api/threads/${threadId}/posts`} method="post">
                  <input type="hidden" name="parentId" value={data.id} />
                  <textarea
                    name="body"
                    required
                    maxLength={2000}
                    placeholder={labels.placeholder}
                    aria-label={labels.placeholder}
                    rows={3}
                  />
                  <button className="btn btn-p" type="submit">{labels.submit}</button>
                </form>
              </details>
            ) : null}
          </div>

          {data.children.length > 0 ? (
            <div className="cmt-kids">
              {data.children.map((child) => (
                <Comment key={child.id} data={child} threadId={threadId} canReply={canReply} labels={labels} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
