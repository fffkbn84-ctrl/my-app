import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="ft-grid">
        <div>
          <Link href="/" className="logo" style={{ display: "inline-flex", marginBottom: "12px" }}>
            <span className="logo-ja">ふたりへ</span>
            <span className="logo-sep" />
            <span className="logo-en">futarive</span>
            <span className="logo-dot" />
          </Link>
          <p className="ft-desc">関係を育てているふたりのための場所。婚活中から、ずっと先まで。</p>
        </div>

        <div className="ft-col">
          <h5>相談所</h5>
          <ul>
            <li><Link href="#">相談所を探す</Link></li>
            <li><Link href="#">カウンセラーから探す</Link></li>
            <li><Link href="#">エリアから探す</Link></li>
          </ul>
        </div>

        <div className="ft-col">
          <h5>お店・スポット</h5>
          <ul>
            <li><Link href="#">お見合いのカフェ・ラウンジ</Link></li>
            <li><Link href="#">デートにおすすめ</Link></li>
            <li><Link href="#">ビューティ（ヘア・ネイル・眉）</Link></li>
            <li><Link href="#">フォトスタジオ</Link></li>
          </ul>
        </div>

        <div className="ft-col">
          <h5>ふたりへについて</h5>
          <ul>
            <li><Link href="#">このサービスについて</Link></li>
            <li><Link href="#">口コミの信頼性</Link></li>
            <li><Link href="#">コラム</Link></li>
            <li><Link href="#">掲載のご相談</Link></li>
          </ul>
        </div>
      </div>

      <div className="ft-bottom">
        <p>© 2025 ふたりへ. All rights reserved.</p>
        <p>プライバシーポリシー　|　利用規約</p>
      </div>
    </footer>
  );
}
