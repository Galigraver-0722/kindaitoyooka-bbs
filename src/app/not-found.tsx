import Link from "next/link";
import { ThemedPage } from "@/components/theme/themed-page";
import { getTheme } from "@/lib/theme";

export default async function NotFound() {
  const theme = await getTheme();

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <p className="crumb">404</p>
          <h1>ページが見つかりません。</h1>
          <p className="lede">リンクが変わったか、スレッドが削除された可能性があります。</p>
          <div className="row-meta">
            <Link className="pill" href="/">ボードへ戻る</Link>
            <Link className="pill" href="/">スレッドを探す</Link>
          </div>
        </div>
      </main>
    </ThemedPage>
  );
}
