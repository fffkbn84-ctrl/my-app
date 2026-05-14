/**
 * src/lib/columns.ts
 *
 * コラム記事のデータ取得ユーティリティ。
 * 現在はMDXファイルから取得。
 * 将来Supabaseに移行する際はこのファイルの中身だけ差し替える。
 * ページコンポーネントのインターフェースは変わらない。
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const COLUMNS_DIR = path.join(process.cwd(), "content/columns");

export type ColumnFAQ = {
  q: string;
  a: string;
};

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorInitial: string;
  authorColor: string;
  publishedAt: string;
  /** SEO 用：最終更新日（未指定なら publishedAt を流用） */
  updatedAt?: string;
  readTime: number;
  thumbnail: string;
  tags: string[];
  featured: boolean;
  /** 冒頭に置く 40-60 字の結論（Atomic Answers / AI 引用最適化） */
  atomicAnswer?: string;
  /** FAQPage schema 用の Q&A（3-5 件推奨） */
  faq?: ColumnFAQ[];
  /** 紐づく天気タイプ（/note/weather/[slug] と双方向リンク） */
  weatherKey?: string;
};

export type Column = ColumnMeta & {
  content: string;
};

function readFrontmatter(filepath: string, slug: string): ColumnMeta & { content?: string } {
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    author: data.author ?? "",
    authorInitial: data.authorInitial ?? "",
    authorColor: data.authorColor ?? "#C8A97A",
    publishedAt: data.publishedAt ?? "",
    updatedAt: data.updatedAt ?? undefined,
    readTime: data.readTime ?? 0,
    thumbnail: data.thumbnail ?? "",
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    atomicAnswer: data.atomicAnswer ?? undefined,
    faq: Array.isArray(data.faq) ? data.faq : undefined,
    weatherKey: data.weatherKey ?? undefined,
    content,
  };
}

/**
 * 全記事のメタデータ一覧を publishedAt 降順で返す
 */
export async function getAllColumns(): Promise<ColumnMeta[]> {
  const files = fs.readdirSync(COLUMNS_DIR).filter((f) => f.endsWith(".mdx"));

  const columns = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const meta = readFrontmatter(path.join(COLUMNS_DIR, filename), slug);
    // 一覧では content は不要
    const { content: _content, ...rest } = meta;
    void _content;
    return rest;
  });

  return columns.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * 特定記事のメタデータ + MDX本文を返す
 */
export async function getColumnBySlug(slug: string): Promise<Column> {
  const filepath = path.join(COLUMNS_DIR, `${slug}.mdx`);
  const meta = readFrontmatter(filepath, slug);
  return {
    ...meta,
    content: meta.content ?? "",
  };
}

/**
 * featured: true の記事一覧を返す
 */
export async function getFeaturedColumns(): Promise<ColumnMeta[]> {
  const all = await getAllColumns();
  return all.filter((c) => c.featured);
}

/**
 * weatherKey から該当コラムを返す（/note/weather/[slug] からの逆引き）
 */
export async function getColumnByWeatherKey(
  weatherKey: string,
): Promise<ColumnMeta | undefined> {
  const all = await getAllColumns();
  return all.find((c) => c.weatherKey === weatherKey);
}
