# 運用ランブック

> 日本語版です。英語版が正本です: [English](../07-operations.md)

この文書は、小さなサーバー 1 台と保守担当 1 人を前提にしています。学校がホスティングを用意する場合は、配備の節だけ環境に合わせて読み替えてください。バックアップと復旧のルールは変えないでください。

## 1. 必要なもの

| 項目 | バージョン／備考 |
| --- | --- |
| Node.js | 22 LTS 以上 |
| pnpm | 12.x（`package.json` で宣言） |
| データベース | SQLite のファイル。サーバープロセスは不要 |
| ディスク | テキストだけなら 1 GB で足りる。バックアップの余裕を残す |
| TLS | ドメインと自動証明書（Caddy が最も簡単） |

## 2. 環境変数

| 名前 | 必須 | 例 | 備考 |
| --- | --- | --- | --- |
| `DATABASE_URL` | はい | `file:./prod.db` | `prisma/` からの相対パス |
| `NODE_ENV` | 本番では必須 | `production` | `next start` でも設定される |
| `PORT` | いいえ | `3000` | `pnpm start -p 3000` で渡す |
| `COOKIE_SECURE` | いいえ | `true` | 本番では既定で secure。`false` にするのは、LAN の平文 HTTP の場合だけ |

`.env` はコミットしないでください。項目は `.env.example` に書いてあります。

## 3. ローカル開発

```bash
pnpm install
cp .env.example .env
pnpm db:push        # create prisma/dev.db
pnpm db:seed        # boards, demo users, sample threads
pnpm dev            # http://localhost:3000
```

シードで作られるデモアカウントは次のとおりです（開発専用）。

| ユーザー名 | ロール | パスワード |
| --- | --- | --- |
| `admin` | ADMIN | `toyooka-demo-123` |
| `moderator` | MODERATOR | `toyooka-demo-123` |
| `student` | STUDENT | `toyooka-demo-123` |

よく使うコマンドは次のとおりです。

```bash
pnpm lint
pnpm build
pnpm db:studio      # browse the database in a browser
pnpm exec prisma migrate dev --name <change>   # after switching to migrations
```

## 4. 最初の本番配備（VPS + Caddy + systemd）

### 4.1 サーバーの準備

```bash
sudo adduser --system --group --home /srv/bbs bbs
sudo mkdir -p /srv/bbs /srv/backups
sudo chown -R bbs:bbs /srv/bbs /srv/backups
```

Node.js 22 と pnpm は、お使いのディストリビューションの公式手順で導入します。導入後に次のコマンドで確認してください。

```bash
node -v
pnpm -v
```

### 4.2 アプリケーションの配備

`bbs` ユーザーとして作業します。

```bash
git clone https://github.com/<owner>/kindaitoyooka-bbs.git /srv/bbs/app
cd /srv/bbs/app
pnpm install --frozen-lockfile
cp .env.example .env
# edit .env: DATABASE_URL="file:./prod.db"
pnpm exec prisma migrate deploy   # after the initial migration exists
pnpm build
```

まだ `db push` を使っている場合（公開前のみ）は、`migrate deploy` の代わりに `pnpm db:push` を実行します。実際の利用者が登録する前に、マイグレーションへ切り替えてください。

最初の管理者は、サイト上で登録して作ります。データベースが空のときは、最初のアカウントが `ADMIN` になります。そのあとでデモアカウントを削除してください。

```bash
pnpm exec prisma studio   # or a SQL client; delete the seeded users
```

### 4.3 systemd ユニット

`/etc/systemd/system/toyooka-bbs.service` の内容は次のとおりです。

```ini
[Unit]
Description=Toyooka BBS
After=network.target

[Service]
Type=simple
User=bbs
Group=bbs
WorkingDirectory=/srv/bbs/app
EnvironmentFile=/srv/bbs/app/.env
Environment=NODE_ENV=production
ExecStart=/usr/local/bin/pnpm start -p 3000
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

`/usr/local/bin/pnpm` の部分は、`command -v pnpm` の出力に置き換えてください。そのうえで次を実行します。

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now toyooka-bbs
sudo systemctl status toyooka-bbs
```

### 4.4 Caddy による TLS

`/etc/caddy/Caddyfile` の内容は次のとおりです。

```caddyfile
bbs.example.com {
    encode gzip
    reverse_proxy 127.0.0.1:3000
}
```

```bash
sudo systemctl reload caddy
```

Caddy が証明書の取得と更新を自動で行います。先に、ドメインの DNS をサーバーへ向けてください。

### 4.5 ファイアウォール

22（必要な場合）、80、443 だけを許可します。ポート 3000 はインターネットへ公開しないでください。

## 5. バックアップ

データベースはファイル 1 つです。サイト全体と同じように守ってください。

### 日次バックアップスクリプト

`/usr/local/bin/bbs-backup.sh` の内容は次のとおりです。

```bash
#!/usr/bin/env bash
set -euo pipefail
umask 077

DB=/srv/bbs/app/prisma/prod.db
DEST=/srv/backups
STAMP=$(date +%Y-%m-%d)

sqlite3 "$DB" ".backup '$DEST/bbs-$STAMP.db'"
find "$DEST" -name 'bbs-*.db' -mtime +30 -delete

# Optional: copy off the server (rclone, rsync, or the school's storage)
# rclone copy "$DEST/bbs-$STAMP.db" remote:bbs-backups/
```

```bash
sudo chmod 700 /usr/local/bin/bbs-backup.sh
sudo crontab -e
# 0 3 * * * /usr/local/bin/bbs-backup.sh
```

### 復旧演習（毎月行う）

```bash
sudo systemctl stop toyooka-bbs
cp /srv/backups/bbs-2026-10-24.db /srv/bbs/app/prisma/prod.db
sudo chown bbs:bbs /srv/bbs/app/prisma/prod.db
sudo systemctl start toyooka-bbs
curl -fsS https://bbs.example.com/ >/dev/null && echo OK
```

既知のスレッドとその返信が残っていることを確認してください。一度も復旧していないバックアップは、バックアップではなく希望にすぎません。

## 6. マイグレーション

公開前に、最初のマイグレーションを作ります。

```bash
pnpm exec prisma migrate dev --name init
git add prisma/migrations
```

配備のたびに、次の順で実行します。

```bash
git pull
pnpm install --frozen-lockfile
pnpm exec prisma migrate deploy
pnpm build
sudo systemctl restart toyooka-bbs
```

ルールは次のとおりです。

- データを削除・書き換えるマイグレーションの前には、必ずバックアップを取る。
- 本番に対して `prisma db push` を実行しない。
- 以前のビルドを残しておき、ロールバックがデータベースの復旧ではなく、チェックアウトと再ビルドで済むようにする。

## 7. 監視

最低限、次の監視を置きます。

| シグナル | 方法 | 通知 |
| --- | --- | --- |
| サイトの稼働 | 1 分ごとの死活監視 | 2 回失敗したらメールかチャット |
| ディスク容量 | 毎日の `df -h`、または node_exporter | 使用率 80% 超 |
| アプリケーションのエラー | `journalctl -u toyooka-bbs -f`、Sentry（フェーズ 1） | 500 の急増 |
| バックアップの作成 | Cron の出力をログファイルへ | 2 日間ファイルがない |
| 監査の動き | `/moderation` の最近の操作 | 予期しない一括削除やロール変更 |
| データベースの整合性 | 毎月の `sqlite3 prod.db "PRAGMA integrity_check;"` | `ok` 以外 |

## 8. 障害対応ランブック

### サイトが 502/503 を返すとき

1. `systemctl status toyooka-bbs` で状態を見ます。
2. `journalctl -u toyooka-bbs -n 200 --no-pager` で直近のログを確認します。
3. `df -h` でディスクを確認します。満杯になると SQLite の書き込みが壊れます。
4. `systemctl restart toyooka-bbs` で再起動します。
5. それでも直らない場合は、`DATABASE_URL` とファイルの権限を確認します。

### `database is locked` が出るとき

1. 長時間動いている `prisma studio` やバックアップが、ファイルを開いたままにしていないか確認します。
2. サービスを再起動します。
3. 通常の負荷で繰り返すなら、PostgreSQL へ移る時期です（`docs/ja/02` を参照）。

### データの消失・破損

1. 直ちにサービスを停止します。これ以上書き込ませません。
2. 現在のファイルを、調査用に別名でコピーします。
3. 最後に検証したバックアップから復旧します。
4. 整合性と内容を確認します。
5. 担当教員に連絡し、何が失われたかを記録します。

### 荒らし・スパムの大量発生

1. 公開の場で反応しないでください。
2. 通報をまとめて削除し、処理します。
3. 手に負えない量なら、メンテナンスページを出すか、プロキシ側でアクセスを制限します。
4. 担当教員へエスカレーションします。アカウントが乗っ取られている場合は、全セッションを削除します（`prisma.session.deleteMany()`）。全員がログアウトされます。
5. 再開する前に、レート制限を追加します。

### 認証情報の漏えいが疑われるとき

1. 全セッションを削除します（全員がログアウトされます）。
2. 影響を受けたアカウントのパスワードを再設定します（シード、または管理者用の SQL）。
3. GitHub のデプロイキー、サーバーへのアクセス、API トークンをローテーションします。
4. 想定していないモデレーション操作がないか、監査記録を確認します。
5. 担当教員に伝え、学校の事故対応手順に従います。

### 個人情報の誤公開

`docs/ja/06` の第 10 節に従います。内容を削除して証拠を保全し、担当教員に連絡します。誰が見たかを記録し、それ以上広げないようにしてください。

## 8.1 要注意語リストの更新

語彙は `naughty-words` 依存パッケージ（CC BY 4.0）に含まれます。更新は `pnpm update` で入りますが、配備前に差分を読み、誤検出が増えないか確認してください。除外リストと追加した日本語の語は `src/lib/content-filter.ts` にあり、テストで守っています。一致しただけで投稿を自動削除しないでください。判断は人間が行います。

## 9. 公開チェックリスト

- [ ] 担当教員と学校の管理職から、書面で承認を得た。
- [ ] ドメインと HTTPS が動いており、HTTP は HTTPS へリダイレクトする。
- [ ] デモアカウントを削除し、固有のパスワードで実際の管理者アカウントを作成した。
- [ ] `COOKIE_SECURE` は安全な既定値のままにしている。
- [ ] 日次のバックアップ cron を設定し、復旧を 1 回試験した。
- [ ] レート制限を実装した（またはプロキシ側で暫定の制限をかけている）。
- [ ] ルール、プライバシー通知、モデレーション方針を公開した。
- [ ] 少なくとも 2 人のモデレーターに研修を行い、エスカレーション先を共有した。
- [ ] 死活監視を設定した。
- [ ] 保守担当がエラーログを確認できる。
- [ ] ロールバックの手順を文書に残し、1 回練習した。

## 10. 費用の目安

| 項目 | 年間費用（円、概算） |
| --- | --- |
| ドメイン | 1,500〜4,000 |
| VPS（1 vCPU、1 GB） | 7,000〜15,000 |
| オフサイトのバックアップ保存 | 0〜2,000 |
| TLS 証明書 | 0（Caddy 経由の Let's Encrypt） |
| **合計** | **20,000 円未満** |

学校が所有するサーバーなら現金の支出は抑えられますが、運用のリスクは上がります。公開前に、ドメインとサーバーアカウントの所有者を決めてください。生徒個人のアカウントは、学校のインフラを長期的に置く場所としてふさわしくありません。

## 11. 保守カレンダー

| 時期 | 作業 |
| --- | --- |
| 毎週 | 未処理の通報を確認し、ディスクとログを見て、依存関係のパッチを当てる |
| 毎月 | 復旧演習、依存関係の監査（`pnpm audit`）、モデレーターの負荷の確認 |
| 各学期 | 担当教員と方針を見直し、モデレーター研修を更新する |
| 毎年 | ドメインを更新し、ホスティングの所有者と後継計画を確認する |
