/**
 * JSON-LD を <script type="application/ld+json"> に安全に埋め込むための
 * シリアライザ。JSON.stringify は "<" をエスケープしないため、
 * 口コミ本文・プロフィール文など外部入力を含むデータに "</script>" が
 * 混入すると script タグを閉じられて XSS が成立する。
 * "<" を Unicode エスケープ（u003c 形式）に置換することで
 * JSON としての意味を変えずにこれを防ぐ。
 */
export function jsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
