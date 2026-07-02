/* ────────────────────────────────────────────────────────────
   Kinda voices（カウンセラー取材記事）モックデータ
   将来 Supabase の voices テーブルから取得する想定。
   記事の基本設計・8セクション構成は CLAUDE.md §11 を正とする。
   新規記事は VOICES 配列にオブジェクトを 1 件足す（published: true で公開）。
──────────────────────────────────────────────────────────── */

export interface VoiceSection {
  /** 見出し（§11 の 4〜6 に相当。原体験／担当してきた人／空気感・働き方） */
  heading: string;
  paragraphs: string[];
  /** 取材写真（/images/voices/ 配下の WebP。任意） */
  images?: string[];
}

export interface Voice {
  /** URL スラッグ（英語 kebab-case） */
  slug: string;
  /** false の間は一覧・詳細・sitemap のどこにも出ない（下書き） */
  published: boolean;
  /** SEO: 相談所名＋カウンセラー名＋地域名を title に含める（§11） */
  title: string;
  /** リード文（200字以内・核心を先に） */
  lead: string;
  /** 実データ（src/lib/data.ts の COUNSELORS）との紐付け。0 なら紐付けなし */
  counselorId: number;
  counselorName: string;
  agencyName: string;
  area: string;
  publishedAt: string;
  updatedAt?: string;
  /** ヘッダー画像（WebP）。未指定はクレイ調グラデにフォールバック */
  heroImage?: string;
  /** プロフィールサマリー（箱組み） */
  profile: { label: string; value: string }[];
  /** 本文セクション（原体験→担当してきた人→空気感、の順を推奨） */
  sections: VoiceSection[];
  /** 印象に残っているひとこと（引用ブロック・SNS拡散設計） */
  pullQuote: string;
  /** クロージング段落 */
  closing: string[];
  /** CTA 文言。省略時は「◯◯さんの話を、直接聞いてみる。」（緊急感・比較禁止） */
  ctaLabel?: string;
  /** 質問形 Q&A（任意・FAQPage 構造化データ） */
  faq?: { q: string; a: string }[];
  tags: string[];
}

export const VOICES: Voice[] = [
  /*
   * ▼ 記事の雛形（published: false のまま置いてある書式サンプル。公開記事ではない）
   * 実記事を作る時はこの形をコピーし、取材内容で置き換えて published: true にする。
   */
  {
    slug: "sample-format",
    published: false,
    title: "（相談所名）（カウンセラー名）さん取材｜（地域）で伴走する人の話",
    lead: "リード文。200字以内で、この人のいちばんの核心を先に書く。",
    counselorId: 0,
    counselorName: "（名前）",
    agencyName: "（相談所名）",
    area: "（地域）",
    publishedAt: "2026-01-01",
    profile: [
      { label: "経験", value: "◯年" },
      { label: "担当エリア", value: "◯◯" },
      { label: "得意な伴走", value: "◯◯な人" },
    ],
    sections: [
      { heading: "この仕事を選んだ理由", paragraphs: ["原体験を書く。"] },
      { heading: "どんな人を担当してきたか", paragraphs: ["担当層・エピソード。"] },
      { heading: "相談所の空気感・働き方", paragraphs: ["空気感を現象描写で。"] },
    ],
    pullQuote: "業界の常識をそっと外すようなひとことを、ここに。",
    closing: ["クロージング。励まさない・断言しない・現象描写にとどめる。"],
    tags: ["カウンセラー", "取材"],
  },
];

export function getVoiceBySlug(slug: string): Voice | undefined {
  return VOICES.find((v) => v.published && v.slug === slug);
}

export function getPublishedVoices(): Voice[] {
  return VOICES.filter((v) => v.published).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

/** ヘッダー画像のフォールバック（クレイ調・ウォームベージュ系） */
export const VOICE_FALLBACK_GRADIENT =
  "linear-gradient(135deg,#E8C9B8,#D4A090)";
