"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary. Without this file a server error during the beta
 * shows Next's default "Application error" page, which has no site chrome and
 * no way for a tester to say what they were doing. This one keeps the school's
 * look, tells the reader the failure is ours, and logs to the console so a
 * screenshot carries the actual message.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Visible in the browser console and in a screenshot; the server log has the
    // full stack traced by `digest`.
    console.error("[bbs] route error", error.digest ?? "", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
        background: "#F0FBFE",
        backgroundImage: "radial-gradient(rgba(6,35,48,.13) 1.1px, transparent 1.1px)",
        backgroundSize: "22px 22px",
        color: "#062330",
        fontFamily:
          '"Helvetica Neue", "Hiragino Sans", "Yu Gothic", Meiryo, "Noto Sans JP", sans-serif',
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          background: "#FFFFFF",
          border: "2px solid #062330",
          borderRadius: 18,
          boxShadow: "6px 6px 0 #062330",
          padding: "26px 26px 22px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
            fontSize: 10,
            letterSpacing: ".14em",
            color: "#0A94A6",
          }}
        >
          ERROR{error.digest ? ` / ${error.digest}` : ""}
        </p>
        <h1 style={{ margin: "10px 0 0", fontSize: 24, lineHeight: 1.3, letterSpacing: "-.02em" }}>
          ページを表示できませんでした
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.9, color: "#3A5E6C" }}>
          一時的な不具合の可能性があります。もう一度読み込んでください。それでも直らないときは、
          この画面の ERROR の文字列を添えて管理者に知らせてください。
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.8, color: "#4B7180" }}>
          Something broke while rendering this page. Reload once; if it keeps failing, send the
          ERROR code above to the administrator.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "11px 20px",
              border: "2px solid #062330",
              borderRadius: 12,
              background: "#12BFD1",
              boxShadow: "4px 4px 0 #062330",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
              color: "#062330",
            }}
          >
            もう一度読み込む
          </button>
          <Link
            href="/"
            style={{
              padding: "11px 20px",
              border: "2px solid #062330",
              borderRadius: 12,
              background: "#FFFFFF",
              boxShadow: "4px 4px 0 #062330",
              fontSize: 14,
              fontWeight: 800,
              color: "#062330",
              textDecoration: "none",
            }}
          >
            ボードへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
