import fs from "fs";
import path from "path";
import matter from "gray-matter";

const STORIES_DIR = path.join(process.cwd(), "content/story");

export type StoryFAQ = {
  q: string;
  a: string;
};

export type StoryMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  area: string;
  pseudonym: string;
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
