/**
 * src/lib/voices.ts
 *
 * Kinda voices（カウンセラー個人単位の取材記事）のデータ取得ユーティリティ。
 *
 * content/columns/ とは別ディレクトリ（content/voices/）で管理する。
 * columns は編集記事、voices は実在の専門職個人の取材記事で、
 * 構造化データ（取材対象の Person が要る）・CTA（当該カウンセラー詳細への送客）・
 * 写真の扱いが異なるため、データもルートも分離している。
 *
 * 読み込み方式は src/lib/columns.ts と同じ gray-matter。
 * 将来 Supabase に移す場合もこのファイルの中身だけ差し替えれば済むようにしている。
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const VOICES_DIR = path.join(process.cwd(), "content/voices");

export type VoiceFAQ = {
  q: string;
  a: string;
};

export type VoiceMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  /** SEO 用：最終更新日（未指定なら publishedAt を流用） */
  updatedAt?: string;
  readTime: number;
  /** 一覧・記事上部の背景。CSS の background 値をそのまま入れる */
  thumbnail: string;
  /** 冒頭に置く 40-60 字の結論（Atomic Answers / AI 引用最適化） */
  atomicAnswer?: string;
  /** 20-45 字。SNS 拡散素材として引用ブロックに出す */
  pullQuote?: string;
  /** FAQPage schema 用の Q&A（2-4 問推奨） */
  faq?: VoiceFAQ[];

  /* ── 取材対象（voices 固有・ここが columns との差） ── */
  /** 表示名（例：田中 美咲） */
  counselorName: string;
  /** 相談所名 */
  agencyName: string;
  /** 地域（例：神奈川県横浜市）※SEO キーワード */
  area: string;
  /**
   * Kinda talk のカウンセラー詳細ページ（/counselors/{counselorSlug}）への参照。
   * 未掲載なら null。null のとき記事内の「詳細を見る」CTA は出さない
   * （存在しないページへのリンクを作らない）。
   */
  counselorSlug: string | null;
  /** 取材日 */
  interviewedAt?: string;

  /* ── シリーズ（同一人物の記事を複数本に分ける場合） ── */
  /** 同一人物の記事を束ねる ID（例：tanaka-misaki-2026） */
  seriesId?: string;
  /** 「前編」「中編」「後編」等 */
  partLabel?: string;

  /* ── 同意記録 ── */
  /** 写真掲載の同意 */
  consentPhoto?: boolean;
  /** 同意取得日 */
  consentDate?: string;

  /* ── 著者（＝書き手。取材対象ではない） ── */
  author: string;
  authorInitial: string;
  authorColor: string;

  /** true の間は一覧・sitemap に出さない（ページ自体は表示できる） */
  draft: boolean;
  tags: string[];
};

export type Voice = VoiceMeta & {
  content: string;
};

function readFrontmatter(
  filepath: string,
  slug: string,
): VoiceMeta & { content?: string } {
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    publishedAt: data.publishedAt ?? "",
    updatedAt: data.updatedAt ?? undefined,
    readTime: data.readTime ?? 0,
    thumbnail: data.thumbnail ?? "",
    atomicAnswer: data.atomicAnswer ?? undefined,
    pullQuote: data.pullQuote ?? undefined,
    faq: Array.isArray(data.faq) ? data.faq : undefined,

    counselorName: data.counselorName ?? "",
    agencyName: data.agencyName ?? "",
    area: data.area ?? "",
    // frontmatter で未指定・空文字・null はすべて「未掲載」として null に寄せる
    counselorSlug: data.counselorSlug ? String(data.counselorSlug) : null,
    interviewedAt: data.interviewedAt ?? undefined,

    seriesId: data.seriesId ?? undefined,
    partLabel: data.partLabel ?? undefined,

    consentPhoto: data.consentPhoto ?? undefined,
    consentDate: data.consentDate ?? undefined,

    author: data.author ?? "",
    authorInitial: data.authorInitial ?? "",
    authorColor: data.authorColor ?? "#C8A97A",

    draft: data.draft === true,
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}

/** content/voices/ が無い環境（サブアプリのビルド等）でも落ちないようにする */
function listFiles(): string[] {
  if (!fs.existsSync(VOICES_DIR)) return [];
  return fs.readdirSync(VOICES_DIR).filter((f) => f.endsWith(".mdx"));
}

/**
 * 公開判定。draft: true と、publishedAt が未来日のものは未公開扱い。
 * 未公開の記事は一覧にも sitemap にも出さないが、URL を直接叩けば表示できる
 * （掲載前にカウンセラー本人へ確認してもらう用途があるため）。
 */
export function isPublished(v: VoiceMeta): boolean {
  if (v.draft) return false;
  if (!v.publishedAt) return false;
  return new Date(v.publishedAt).getTime() <= Date.now();
}

/**
 * 全記事のメタデータ一覧を publishedAt 降順で返す（未公開を含む）。
 * 一覧表示・sitemap では getPublishedVoices() を使うこと。
 */
export async function getAllVoices(): Promise<VoiceMeta[]> {
  const voices = listFiles().map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const meta = readFrontmatter(path.join(VOICES_DIR, filename), slug);
    // 一覧では content は不要
    const { content: _content, ...rest } = meta;
    void _content;
    return rest;
  });

  return voices.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** 公開済みの記事だけを publishedAt 降順で返す */
export async function getPublishedVoices(): Promise<VoiceMeta[]> {
  const all = await getAllVoices();
  return all.filter(isPublished);
}

/** 特定記事のメタデータ + MDX 本文を返す。存在しなければ throw */
export async function getVoiceBySlug(slug: string): Promise<Voice> {
  const filepath = path.join(VOICES_DIR, `${slug}.mdx`);
  const meta = readFrontmatter(filepath, slug);
  return {
    ...meta,
    content: meta.content ?? "",
  };
}

/** 同一人物の他の記事（シリーズ）を publishedAt 昇順で返す */
export async function getSeriesVoices(
  seriesId: string | undefined,
  excludeSlug: string,
): Promise<VoiceMeta[]> {
  if (!seriesId) return [];
  const all = await getPublishedVoices();
  return all
    .filter((v) => v.seriesId === seriesId && v.slug !== excludeSlug)
    .sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
    );
}
