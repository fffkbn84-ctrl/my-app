import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="ft-grid">
        <div>
          <Link href="/" className="logo" style={{ display: "inline-flex", marginBottom: "12px", alignItems: "baseline" }}>
            <span className="logo-ja">Kinda</span>
            <span className="logo-sep">·</span>
            <span className="logo-en">ふたりへ</span>
          </Link>
          <p className="ft-desc">
            好きな人を見つけて、一緒に過ごす日々まで。
            <br />
            ふたりに寄り添うすべてが、ひとつの場所に。
          </p>
        </div>

        <div className="ft-col">
          <h5>Kinda サービス</h5>
          <ul>
            <li><Link href="/kinda-type">Kinda type — 合うカウンセラーを見つける</Link></li>
            <li><Link href="/kinda-talk">Kinda talk — カウンセラーを見る</Link></li>
            <li><Link href="/kinda-act">Kinda act — お見合い・デートの場所</Link></li>
            <li><Link href="/kinda-glow">Kinda glow — 自分を整える</Link></li>
            <li><Link href="/kinda-note">Kinda note — 気持ちを整理する</Link></li>
          </ul>
        </div>

        <div className="ft-col">
          <h5>読みもの</h5>
          <ul>
            <li><Link href="/kinda-story">Kinda story — ふたりの物語</Link></li>
            <li><Link href="/columns">Kinda voices — 取材・コラム</Link></li>
          </ul>

          <h5 style={{ marginTop: 28 }}>アカウント</h5>
          <ul>
            <li><Link href="/mypage">マイページ</Link></li>
            <li><Link href="/login">ログイン・新規登録</Link></li>
          </ul>
        </div>

        <div className="ft-col">
          <h5>Kinda ふたりへ</h5>
          <ul>
            <li><Link href="/about">このサービスについて</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
            <li><Link href="/partners">掲載のご相談</Link></li>
          </ul>

          <h5 style={{ marginTop: 28 }}>規約・表記</h5>
          <ul>
            <li><Link href="/terms">利用規約</Link></li>
            <li><Link href="/privacy">プライバシーポリシー</Link></li>
            <li><Link href="/tokushou">特定商取引法に基づく表記</Link></li>
          </ul>
        </div>
      </div>

      <div className="ft-bottom">
        <p>© {year} Kinda ふたりへ. All rights reserved.</p>
        <p>
          <Link href="/privacy" style={{ color: "inherit", textDecoration: "none", marginRight: 12 }}>プライバシー</Link>
          <Link href="/terms" style={{ color: "inherit", textDecoration: "none", marginRight: 12 }}>利用規約</Link>
          <Link href="/tokushou" style={{ color: "inherit", textDecoration: "none" }}>特商法表記</Link>
        </p>
      </div>
    </footer>
  );
}
