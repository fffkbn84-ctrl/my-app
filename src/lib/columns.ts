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

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorInitial: string;
  authorColor: string;
  publishedAt: string;
  readTime: number;
  thumbnail: string;
  tags: string[];
  featured: boolean;
};

export type Column = ColumnMeta & {
  content: string;
};

/**
 * 全記事のメタデータ一覧を publishedAt 降順で返す
 */
export async function getAllColumns(): Promise<ColumnMeta[]> {
  const files = fs.readdirSync(COLUMNS_DIR).filter((f) => f.endsWith(".mdx"));

  const columns = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(COLUMNS_DIR, filename), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      category: data.category ?? "",
      author: data.author ?? "",
      authorInitial: data.authorInitial ?? "",
      authorColor: data.authorColor ?? "#C8A97A",
      publishedAt: data.publishedAt ?? "",
      readTime: data.readTime ?? 0,
      thumbnail: data.thumbnail ?? "",
      tags: data.tags ?? [],
      featured: data.featured ?? false,
    } satisfies ColumnMeta;
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
    readTime: data.readTime ?? 0,
    thumbnail: data.thumbnail ?? "",
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    content,
  };
}

/**
 * featured: true の記事一覧を返す
 */
export async function getFeaturedColumns(): Promise<ColumnMeta[]> {
  const all = await getAllColumns();
  return all.filter((c) => c.featured);
}
