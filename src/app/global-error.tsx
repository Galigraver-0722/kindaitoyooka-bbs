"use client";

/**
 * Last-resort boundary: errors thrown by the root layout itself. It replaces
 * <html> and <body>, so it cannot rely on any of the site's CSS — everything
 * here is inline on purpose.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "32px 20px",
          background: "#F0FBFE",
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
            padding: "26px",
          }}
        >
          <p style={{ margin: 0, fontSize: 10, letterSpacing: ".14em", color: "#0A94A6" }}>
            FATAL{error.digest ? ` / ${error.digest}` : ""}
          </p>
          <h1 style={{ margin: "10px 0 0", fontSize: 22, lineHeight: 1.35 }}>
            サイトを起動できませんでした
          </h1>
          <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.9, color: "#3A5E6C" }}>
            管理者に連絡してください。サーバーのログに同じ ERROR の文字列が残っています。
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.8, color: "#4B7180" }}>
            The site failed to start. Check the server log for the code above.
          </p>
        </div>
      </body>
    </html>
  );
}
