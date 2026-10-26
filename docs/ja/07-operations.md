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
| `RATE_LIMIT_<NAME>_LIMIT` | いいえ | `10` | 1 つの制限の回数を変える。`<NAME>` は `LOGIN`、`REGISTER`、`THREAD`、`REPLY`、`REPORT`、`LIKE`、`BOOKMARK` |
| `RATE_LIMIT_<NAME>_WINDOW_MIN` | いいえ | `10` | 同じ制限のウィンドウを分で指定する |
| `TRUST_PROXY` | プロキシの背後で使う | `1` | `X-Forwarded-For` のクライアントアドレスを信頼する。既定は無効。直接公開している場合、クライアントがヘッダーを偽装して新しいバケットを得られてしまう |
| `BOARD_ARCHIVE_DAYS` | いいえ | `90` | `pnpm archive-boards` が見る無活動の日数 |

レート制限のカウンターは `RateLimit` テーブルにあります。再起動しても攻撃者が新しい枠を得ることはなく、同じデータベースを使う 2 つのプロセスは同じウィンドウを共有します。期限切れの行はログインのたびに掃除します。キーに使うアドレスは `X-Forwarded-For` から取りますが、読むのは `TRUST_PROXY=1` のときだけです。信頼できるプロキシがない場合、すべてのリクエストが 1 つのバケットを共有するので、IP 単位の制限は意図的に厳しくなり、アカウント単位の制限はそのまま効きます。同梱の Caddy + systemd 構成では Caddy がヘッダーを上書きするため `TRUST_PROXY=1` を設定しています。

既定値は、教室が 1 つの学校 IP を共有することを考えて緩めにしてあります。ログインは IP + ユーザー名ごとに 10 分 10 回、登録は IP ごとに 1 時間 60 回、スレッドは 1 時間 10 件、返信は 1 時間 60 件、通報は 1 日 30 件、リアクションは 1 時間 300 回です。コードを直さず `.env` で 1 つだけ締めて、サービスを再起動してください。

```bash
# 例: 公開する環境で、ログインを 10 分 5 回に締める
RATE_LIMIT_LOGIN_LIMIT=5
RATE_LIMIT_LOGIN_WINDOW_MIN=10
```

`.env` はコミットしないでください。項目は `.env.example` に書いてあります。サーバー用の雛形は `deploy/toyooka-bbs.env.example` です。

配備用のテンプレートは `deploy/` にあります。

| ファイル | 用途 |
| --- | --- |
| `deploy/Caddyfile` | HTTPS のリバースプロキシ。セキュリティヘッダー付き |
| `deploy/toyooka-bbs.service` | systemd のユニット |
| `deploy/toyooka-bbs.env.example` | 本番用の環境変数ファイル |
| `deploy/bbs-backup.sh` | 日次 cron 用。30 日分を残す |

## 3. ローカル開発

```bash
pnpm install
cp .env.example .env
pnpm db:deploy      # prisma/migrations から prisma/dev.db を作る
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
pnpm reset-password <username>   # 手作業の復旧。新しいパスワードを一度だけ表示する
pnpm backup [dir]                # 動いたまま一貫性のあるバックアップを取る
pnpm verify-backup <file>        # バックアップの整合性と件数を確認する
pnpm restore <file> <target> --force   # バックアップを戻す。先にサービスを止める
pnpm db:migrate --name <change>   # prisma/schema.prisma を直したあと
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
pnpm db:deploy   # prisma/migrations のマイグレーションをすべて適用する
pnpm build
```

`prisma/migrations` に最初のマイグレーションがあるので、新しいサーバーでも手元と同じスキーマができます。`pnpm db:push` は履歴を残さないので、使い捨ての実験だけに使います。

新しいデータベースにはボードが 1 つもありません。ボードを作る経路はコミュニティボード専用なので、サイトを開く前にブートストラップを実行してください。公式ボード 5 つと、必要なら管理者 1 人を作ります。デモアカウントもサンプル投稿も作らず、既知のパスワードも使いません。何度実行しても安全です（ボードは slug で upsert されます）。

```bash
BOOTSTRAP_ADMIN_USERNAME=teacher \
BOOTSTRAP_ADMIN_PASSWORD='<長くて推測されないパスワード>' \
pnpm bootstrap
```

パスワードは環境変数で渡してください。コマンドライン引数はシェル履歴と `ps` に残ります。`pnpm bootstrap --boards-only` はアカウントを作らず、`pnpm bootstrap --promote <username>` はパスワードを変えずに既存アカウントを `ADMIN` にします。

ここで `pnpm db:seed` を実行しないでください。`admin`、`moderator`、`student` を公開パスワード `toyooka-demo-123` で作ります。このスクリプトは `NODE_ENV=production` では `--force` を付けない限り実行を拒否するようになりました。

サイト上で登録する方法もあります。空のデータベースでは最初のアカウントが `ADMIN` になります。ただし URL に到達できる状態では競争になります。最初に登録した人がサイトの管理者になるためです。公開済みなら先にブートストラップを実行してください。

### 4.3 systemd ユニット

ユニットの雛形は `deploy/toyooka-bbs.service` にあります。インストール前に pnpm のパスを環境に合わせてください。

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

`deploy/Caddyfile` の雛形には、HSTS と基本的なセキュリティヘッダーも入っています。`/etc/caddy/Caddyfile` の内容は次のとおりです。

```caddyfile
bbs.example.com {
    encode gzip zstd
    reverse_proxy 127.0.0.1:3000
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

```bash
sudo systemctl reload caddy
```

Caddy が証明書の取得と更新を自動で行います。先に、ドメインの DNS をサーバーへ向けてください。

### 4.5 ファイアウォール

22（必要な場合）、80、443 だけを許可します。ポート 3000 はインターネットへ公開しないでください。

## 5. バックアップ

データベースはファイル 1 つです。サイト全体と同じように守ってください。アプリを動かしたまま取る場合は `pnpm backup` を使ってください。SQLite の `VACUUM INTO` で、書き込み中でも一貫性のあるコピーを作ります。動いている `.db` を `cp` で複製すると、書きかけのページを拾うことがあります。

### コマンド

| コマンド | 内容 |
| --- | --- |
| `pnpm backup [dir]` | `bbs-<timestamp>.db` を書き、整合性を確認し、SHA-256 と件数を表示する |
| `pnpm verify-backup <file>` | 信頼する前に、整合性と件数をもう一度確認する |
| `pnpm restore <file> <target> --force` | 確認済みのバックアップを対象データベースへ戻し、もう一度確認する |

対象のデータベースは使用中であってはいけません。本番の復旧では、必ず先にサービスを止めてください。

### 日次バックアップ cron

リポジトリに `deploy/bbs-backup.sh` があります。`bbs` ユーザーで実行するので、復旧時にサービスがファイルを読めます。30 日より古いファイルを消し、`/srv/backups` へ書きます。

```bash
sudo install -m 700 -o bbs -g bbs deploy/bbs-backup.sh /usr/local/bin/bbs-backup.sh
sudo -u bbs crontab -e
# 0 3 * * * /usr/local/bin/bbs-backup.sh /srv/backups >> /srv/bbs/backup.log 2>&1
```

ローカルのバックアップが成功したあとに、別の場所へも複製してください。失敗がログに残るよう、cron には実際のコマンドを書きます。

```bash
# 上の行のあとに追加する例:
# rclone copy /srv/backups/ remote:bbs-backups/ --include 'bbs-*.db'
```

### 復旧演習（毎月行う）

```bash
sudo systemctl stop toyooka-bbs
sudo -u bbs bash -lc 'cd /srv/bbs/app && pnpm restore /srv/backups/bbs-2026-10-24.db prisma/prod.db --force'
sudo systemctl start toyooka-bbs
curl -fsS https://bbs.example.com/health
```

サイトを開き、既知のスレッドと返信、バックアップ時点の最新投稿が残っていることを確認してください。一度も復旧していないバックアップは、バックアップではなく希望にすぎません。

### ローカルで行った演習（2026-10-24）

同じコマンドを、本番に触れずに開発用データベースで実行しました。

1. `pnpm backup /tmp/bbs-backups` で、アプリを動かしたままバックアップを取った。
2. `pnpm verify-backup` が `Integrity: ok` と、想定どおりの利用者・スレッド・投稿数を返した。
3. `pnpm restore <backup> /tmp/bbs-restore.db` で別のデータベースを作り、整合性が `ok` だった。
4. 復元したファイルを指す 2 台目の `next start` をポート 3100 で動かし、同じスレッドが読めることを確認した。

これはスクリプトの確認であり、サーバーの確認ではありません。本番の演習は、最初の配備後に実際のホストで行う必要があります。

## 5.1 ボードの定期アーカイブ

スレッドが来なくなったコミュニティボードが、左の欄に永久に居座る必要はありません。`pnpm archive-boards` は、表示中の最新スレッドが `BOARD_ARCHIVE_DAYS`（既定 90 日）より古いコミュニティボードをアーカイブし、監査ログを 1 行書き、スレッドはすべて読めるまま残します。復元は `/moderation` から行います（管理者のみ）。

```bash
# まずは下見。何が変わるかを表示するだけ
pnpm archive-boards --dry-run

# 毎日 4 時に bbs ユーザーで実行
sudo crontab -u bbs -e
0 4 * * * cd /srv/bbs/app && pnpm archive-boards >> /var/log/bbs-archive.log 2>&1
```

スレッドが 1 本もないボードは対象外です。判定は最新スレッドの `lastPostAt` だけを見るので、新しい部活のボードは最初から 1 ウィンドウ分の猶予を持ちます。

## 6. マイグレーション

`prisma/migrations/20261025120000_init` が起点です。スキーマが宣言するテーブルをすべて作る内容で、開発用のデータベースは適用済みとして記録してあります。スキーマを変えるときは `prisma/schema.prisma` を直し、新しいマイグレーションを作ります。

```bash
pnpm db:migrate --name <change>
git add prisma/migrations
```

配備のたびに、次の順で実行します。

```bash
git pull
pnpm install --frozen-lockfile
pnpm db:deploy        # prisma migrate deploy
pnpm build
sudo systemctl restart toyooka-bbs
```

マイグレーションとスキーマが食い違っていないかは、使い捨てのファイルに適用して確かめます。

```bash
rm -f /tmp/migtest.db
DATABASE_URL="file:/tmp/migtest.db" pnpm db:deploy
npx prisma migrate diff --from-migrations prisma/migrations \
  --to-schema-datamodel prisma/schema.prisma --shadow-database-url "file:/tmp/shadow.db"
# 「No difference detected.」なら、コミットした SQL はスキーマと一致しています
```

ルールは次のとおりです。

- データを削除・書き換えるマイグレーションの前には、必ずバックアップを取る。
- 本番に対して `prisma db push` を実行しない。
- 以前のビルドを残しておき、ロールバックがデータベースの復旧ではなく、チェックアウトと再ビルドで済むようにする。

## 7. 監視

最低限、次の監視を置きます。

| シグナル | 方法 | 通知 |
| --- | --- | --- |
| サイトの稼働 | `GET /health` を 1 分ごとに監視 | 2 回失敗したらメールかチャット。データベースに触れないとき `/health` は 503 を返す |
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
5. 再開する前に、`.env` の `RATE_LIMIT_*` を締めます。波が去ったら元に戻してください。

### 認証情報の漏えいが疑われるとき

1. 全セッションを削除します（全員がログアウトされます）。
2. 影響を受けたアカウントのパスワードを `pnpm reset-password <username>` で再設定します。このコマンドは、そのアカウントのセッションもすべて削除します。
3. GitHub のデプロイキー、サーバーへのアクセス、API トークンをローテーションします。
4. 想定していないモデレーション操作がないか、監査記録を確認します。
5. 担当教員に伝え、学校の事故対応手順に従います。

### 個人情報の誤公開

`docs/ja/06` の第 10 節に従います。内容を削除して証拠を保全し、担当教員に連絡します。誰が見たかを記録し、それ以上広げないようにしてください。

## 8.1 要注意語リストの更新

語彙は `naughty-words` 依存パッケージ（CC BY 4.0）に含まれます。更新は `pnpm update` で入りますが、配備前に差分を読み、誤検出が増えないか確認してください。除外リストと追加した日本語の語は `src/lib/content-filter.ts` にあり、テストで守っています。一致しただけで投稿を自動削除しないでください。判断は人間が行います。

## 8.2 手作業によるパスワードの再設定

まだ利用者自身で再設定する仕組みがないため、パスワードを忘れた生徒は、保守担当に直接申し出ます。公開のスレッドで再設定を頼まないでください。そこでは本人確認ができず、頼んだこと自体が「誰が忘れたか」をさらします。

1. 対面、または担当教員を通して本人確認をします。
2. 正確なユーザー名でコマンドを実行します。

   ```bash
   pnpm reset-password sakura_17
   ```

3. コマンドは 16 文字のパスワードを生成し、`scrypt` のハッシュだけを保存し、そのアカウントの全セッションを削除して、パスワードを一度だけ表示します。
4. パスワードは本人だけに渡してください。チャット、メール、スレッド、コミットに貼らないでください。
5. 生徒には、ログインしたら早めに変更するよう伝えます。利用者自身で変更できる仕組みができるまでは、一度だけ使うものとして扱い、漏れたらもう一度再設定を依頼するよう説明します。
6. 再設定した日付、ユーザー名、依頼の経路を、保守担当の非公開の記録に残します。公開データベースには書きません。

このコマンドは `DATABASE_URL` を必要とします。リポジトリ直下の `.env` を読むので、サーバーではリポジトリのディレクトリで実行してください。

## 9. 公開チェックリスト

- [ ] 担当教員と学校の管理職から、書面で承認を得た。
- [ ] ドメインと HTTPS が動いており、HTTP は HTTPS へリダイレクトする。
- [ ] デモアカウントを削除し、固有のパスワードで実際の管理者アカウントを作成した。
- [ ] `COOKIE_SECURE` は安全な既定値のままにしている。
- [ ] 日次のバックアップ cron を設定し、復旧を 1 回試験した。
- [x] レート制限を実装し、環境変数で調整できるようにした。
- [ ] ルール、プライバシー通知、モデレーション方針を公開した。
- [ ] 少なくとも 2 人のモデレーターに研修を行い、エスカレーション先を共有した。
- [ ] 死活監視を設定した。
- [ ] 保守担当がエラーログを確認できる。
- [ ] `pnpm bootstrap` を実行済み。公式ボードがあり、実在の `ADMIN` が 1 人だけで、デモアカウントがない（`pnpm exec prisma studio` で確認）。
- [ ] `/robots.txt` が `Disallow: /` のまま。サイトを告知するときに `src/app/robots.ts` を書き換える。
- [ ] エラー画面が学校のデザインで出る（`/meta` から一度例外を起こし、ERROR の文字列が出ることを確認）。
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
