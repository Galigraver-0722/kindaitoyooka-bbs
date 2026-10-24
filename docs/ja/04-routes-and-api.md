# ルートとフォームのエンドポイント

> 日本語版です。英語版が正本です: [English](../04-routes-and-api.md)

これらのエンドポイントは、このアプリケーションの HTML フォームを処理するために存在します。**バージョン付きの公開 API ではありません。** 将来モバイルクライアントを作るなら、明示的なバージョニングを持つ JSON API が必要です。

## 1. ページ

| パス | アクセス | 目的 |
| --- | --- | --- |
| `/` | 公開 | ヒーロー、最新スレッド 8 件、ボード一覧、投稿ルール |
| `/b/[slug]` | 公開 | ボード内の表示中のスレッド。固定が先、次に活動順 |
| `/t/[id]` | 公開 | 全投稿を含むスレッド、返信フォーム、通報ボタン |
| `/new` | ログイン済み | スレッド作成。ゲストは `/login?next=/new` へリダイレクト |
| `/login` | 公開 | ログインフォーム。ログイン済みならリダイレクト |
| `/register` | 公開 | 登録フォーム。最初のアカウントは `ADMIN` になる |
| `/moderation` | モデレーター／管理者 | 未処理の通報。それ以外はリダイレクト |
| 未知のパス | 公開 | カスタム 404 |

すべてのページはリクエストごとにサーバーで描画します。クライアント側のデータ取得はありません。

## 2. 変更系エンドポイント

すべてのエンドポイントは `application/x-www-form-urlencoded` または `multipart/form-data`（標準の HTML フォーム形式）を受け取り、クロスオリジンの `Origin` ヘッダーを拒否し、成功時は `303 See Other` を返してブラウザに `GET` を行わせます。

### `POST /api/auth/register`

| フィールド | 必須 | ルール |
| --- | --- | --- |
| `username` | はい | 3〜20 文字、`[A-Za-z0-9_]`、小文字化 |
| `email` | いいえ | 有効なアドレス、254 文字以内、一意 |
| `password` | はい | 10〜200 文字、前後の空白を削除しない |
| `next` | いいえ | 同一サイトのパスのみ |

- 成功: セッション Cookie を設定し、`next` または `/` へリダイレクト。
- 失敗: `/register?error=<code>` へリダイレクト。パスワードは決して画面に戻さない。
- コード: `invalid-input`、`username-taken`、`email-taken`。

### `POST /api/auth/login`

| フィールド | 必須 |
| --- | --- |
| `username` | はい |
| `password` | はい |
| `next` | いいえ |

- 成功: セッション Cookie を設定し、`next` または `/` へリダイレクト。
- 失敗: `/login?error=invalid-credentials`（存在しないユーザーでも、パスワード誤りでも同じメッセージ）。
- ロックアウトもレート制限もまだない。公開前に追加すること。

### `POST /api/auth/logout`

- 有効な Cookie があればセッション行を削除し、Cookie を消して `/?notice=signed-out` へリダイレクトする。

### `POST /api/threads`

| フィールド | 必須 | ルール |
| --- | --- | --- |
| `boardId` | はい | 存在し、アーカイブされていないボード |
| `title` | はい | 3〜120 文字 |
| `body` | はい | 1〜10,000 文字 |

- 認証: ログイン済みの利用者。
- 成功: `Thread` と最初の `Post` を原子的に作成し、`/t/<id>` へリダイレクト。
- 失敗: `/new?board=<slug>&error=<code>`。
- コード: `board-not-found`、`invalid-input`、`login-required`。

### `POST /api/threads/[id]/posts`

| フィールド | 必須 | ルール |
| --- | --- | --- |
| `body` | はい | 1〜10,000 文字 |

- 認証: ログイン済みの利用者。
- 前提: スレッドが存在し、削除されておらず、ロックされていない。
- 成功: `Post` を挿入し、同じトランザクションで `Thread.lastPostAt` を更新して、`/t/<id>#p-<postId>` へリダイレクト。
- 失敗コード: `thread-locked`、`invalid-input`、`thread-not-found`。

### `POST /api/threads/[id]/lock`

- 認証: `MODERATOR` または `ADMIN`。本文なし。
- `isLocked` を反転し、スレッドへ戻る。
- 失敗コード: `forbidden`、`thread-not-found`。

### `POST /api/threads/[id]/delete`

- 認証: `MODERATOR` または `ADMIN`。本文なし。
- `isDeleted = true` にして、ボードへリダイレクト。
- 失敗コード: `forbidden`、`thread-not-found`。

### `POST /api/posts/[id]/delete`

- 認証: `MODERATOR` または `ADMIN`。本文なし。
- `isDeleted = true` にして、スレッドへリダイレクト。投稿はプレースホルダーとして表示され続ける。
- 失敗コード: `forbidden`、`not-found`。

### `POST /api/reports`

| フィールド | 必須 | ルール |
| --- | --- | --- |
| `postId` | はい | 存在する投稿 |
| `reason` | はい | 3〜500 文字 |

- 認証: ログイン済みの利用者。
- 成功: `Report` を作成し、`?notice=reported` 付きでスレッドへリダイレクト。
- 失敗コード: `report-invalid`。

### `POST /api/reports/[id]/resolve`

| フィールド | 必須 | 値 |
| --- | --- | --- |
| `action` | はい | `remove` または `dismiss` |

- 認証: `MODERATOR` または `ADMIN`。
- `remove`: 通報された投稿を論理削除し、通報を `removed` にする。
- `dismiss`: 投稿はそのままにし、通報を `dismissed` にする。
- どちらの場合も `/moderation` へリダイレクト。

## 3. エラー処理

JSON のエラー形式はありません。利用者向けの失敗は、クエリ文字列の短いコードを付けて該当ページへリダイレクトします。`src/lib/messages.ts` がコードを英語の文に対応付けます。未知のコードは汎用の「フォームを確認してください」に落ちるため、手で作った URL でページに任意のテキストを差し込むことはできません。

想定外の失敗（データベース停止、未処理の例外）は Next.js が 500 を返します。公開前にエラー監視を追加してください。`docs/ja/07-operations.md` を参照。

## 4. Cookie

| 属性 | 値 | 理由 |
| --- | --- | --- |
| 名前 | `toyooka_session` | |
| 値 | 16 進 64 文字（32 バイトのランダム） | 256 ビットのエントロピー |
| `HttpOnly` | true | JavaScript から読めない |
| `SameSite` | `Lax` | ほとんどのクロスサイトフォーム送信を防ぐ |
| `Secure` | 本番では true | HTTPS が必要 |
| `Path` | `/` | |
| `Expires` | 30 日 | |

`COOKIE_SECURE=false` は、学校 LAN で平文 HTTP を使う場合のためだけに存在します。公開インターネットでは使わないでください。

## 5. CSRF とオリジンの確認

`SameSite=Lax` は、クロスサイトの POST で Cookie が設定されることをすでに防いでいます。多層防御として、すべての POST ハンドラーが `isSameOrigin()` を呼び、`Origin` ヘッダーが別ホストを指していれば拒否します。`Origin` ヘッダーのないリクエスト（curl や一部のプライバシーツール）は許可します。攻撃者がブラウザにクロスサイトのフォーム送信で `Origin` を省略させることはできません。

## 6. キャッシュ

どのエンドポイントもキャッシュしません。ページは動的です。ヘッダーにログイン中の利用者名が含まれるため、アプリの前段の CDN にレスポンスをキャッシュさせてはいけません。
