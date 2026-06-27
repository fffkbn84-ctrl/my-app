import fs from "fs";
import path from "path";
import matter from "gray-matter";

const STORIES_DIR = path.join(process.cwd(), "content/story");

export type StoryFAQ = {
  q: string;
  a: string;
};

/**
 * stage（成婚 / 交際中 / 活動中）→ 既存クレイ情景アセットの対応表。
 * mock/stories.ts の STORY_THUMBNAIL_POOL と同じアセットを使い、
 * Story のサムネ・ヒーローは stage から自動で出し分ける（個別指定不要）。
 * 英語キー（marriage / dating / active）と日本語キーの両方を受ける。
 */
export const STORY_STAGE_IMAGE: Record<string, string> = {
  marriage: "/images/story-seikon.webp",
  成婚: "/images/story-seikon.webp",
  dating: "/images/story-kosai.webp",
  交際中: "/images/story-kosai.webp",
  active: "/images/story-katsudo.webp",
  活動中: "/images/story-katsudo.webp",
};

/** stage からクレイ情景画像を解決。未知 stage は成婚アセットへフォールバック。 */
export function getStoryStageImage(stage: string): string {
  return STORY_STAGE_IMAGE[stage] ?? "/images/story-seikon.webp";
}

/** ヒーロー画像。frontmatter.heroImage を個別指定があれば優先、無ければ stage から自動。 */
export function getStoryHeroImage(story: StoryMeta): string {
  return story.heroImage || getStoryStageImage(story.stage);
}

export type StoryMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  area: string;
  pseudonym: string;
  /** 個別指定の上書き用（任意）。未指定なら stage から自動解決。 */
  heroImage: string;
  heroAlt: string;
  ogImage: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  pullQuote: string;
  consentWeb: boolean;
  consentSNS: boolean;
  consentAgency: boolean;
  consentPhoto: boolean;
  consentDate: string;
  faq?: StoryFAQ[];
};

export type Story = StoryMeta & {
  content: string;
};

function readStoryFile(filepath: string, slug: string): StoryMeta & { content?: string } {
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    stage: data.stage ?? "",
    area: data.area ?? "",
    pseudonym: data.pseudonym ?? "",
    heroImage: data.heroImage ?? "",
    heroAlt: data.heroAlt ?? "",
    ogImage: data.ogImage ?? "",
    author: data.author ?? "",
    publishedAt: data.publishedAt ?? "",
    updatedAt: data.updatedAt ?? undefined,
    pullQuote: data.pullQuote ?? "",
    consentWeb: data.consentWeb ?? false,
    consentSNS: data.consentSNS ?? false,
    consentAgency: data.consentAgency ?? false,
    consentPhoto: data.consentPhoto ?? false,
    consentDate: data.consentDate ?? "",
    faq: Array.isArray(data.faq) ? data.faq : undefined,
    content,
  };
}

export async function getAllMdxStories(): Promise<StoryMeta[]> {
  if (!fs.existsSync(STORIES_DIR)) return [];
  const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".mdx"));
  const stories = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const meta = readStoryFile(path.join(STORIES_DIR, filename), slug);
    const { content: _content, ...rest } = meta;
    void _content;
    return rest;
  });
  return stories.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getMdxStoryBySlug(slug: string): Promise<Story> {
  const filepath = path.join(STORIES_DIR, `${slug}.mdx`);
  const meta = readStoryFile(filepath, slug);
  return {
    ...meta,
    content: meta.content ?? "",
  };
}
