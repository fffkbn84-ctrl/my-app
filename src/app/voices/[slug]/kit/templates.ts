import type { VoiceMeta } from "@/lib/voices";

/**
 * 掲載後キットの告知文テンプレート。
 *
 * ⚠️ 暫定原稿です。
 * 正となる原文は `kinda-voices-publication-kit-v1.html` の PART B（B-1 / B-2 / B-3）で、
 * 本実装の時点でその資料が未受領のため、Kinda のトーン規定
 * （焦らせない・比較しない・絵文字なし・断定より寄り添い）に沿った暫定案を置いている。
 * PART B を受領したら、この配列の body を差し替えるだけで済むようにしてある。
 *
 * カウンセラー名・地域名・記事URLはサーバー側で実値に置換して出力する（相手に置換作業をさせない）。
 * ただし「（ここに〜）」の指示書きは相手が自分の言葉を書く余白なので、そのまま残す。
 */
export type AnnouncementTemplate = {
  id: string;
  label: string;
  hint: string;
  body: string;
};

export function buildTemplates(
  voice: VoiceMeta,
  articleUrl: string,
): AnnouncementTemplate[] {
  const name = voice.counselorName;
  const area = voice.area;
  const agency = voice.agencyName;

  return [
    {
      id: "b1",
      label: "B-1　短文（X など）",
      hint: "そのまま投稿できる長さです。1行だけご自身の言葉を足すと、読む人に届きやすくなります。",
      body: [
        "Kinda voices に、取材記事を掲載していただきました。",
        "普段の面談で話していることを、そのまま聞いてもらった記録です。",
        "",
        "（ここに、記事を読んでの一言を書いてください）",
        "",
        articleUrl,
      ].join("\n"),
    },
    {
      id: "b2",
      label: "B-2　長文（Instagram・Facebook など）",
      hint: "写真と一緒に投稿する場合を想定した長さです。プロフィールのリンクから読んでもらう導線にも使えます。",
      body: [
        "Kinda voices というサイトで、取材を受けました。",
        "",
        `${area}で、結婚相談所のカウンセラーをしています。`,
        "記事では、はじめて面談に来られた方に最初に聞いていることや、",
        "これまで担当してきた方のことをお話ししています。",
        "",
        "（ここに、取材を受けて感じたことを2〜3行で書いてください）",
        "",
        "相談所を「どこ」ではなく「誰と進めるか」で選べるように、",
        "という趣旨のサイトです。",
        "",
        "記事はこちらから読めます。",
        articleUrl,
      ].join("\n"),
    },
    {
      id: "b3",
      label: "B-3　お知らせ文（ブログ・メールマガジンなど）",
      hint: "ご自身のブログや会員向けのお知らせに使える、ですます調の形式です。",
      body: [
        "【お知らせ】Kinda voices に取材記事を掲載していただきました",
        "",
        "結婚相談所をカウンセラー個人の口コミで選べるサイト「Kinda」の取材記事に、",
        `${name}のインタビューを掲載していただきました。`,
        "",
        "記事では、初回面談で最初に確かめていること、これまでどのような方を",
        `担当してきたか、${agency}の普段の様子についてお話ししています。`,
        "",
        "（ここに、記事で特に読んでほしい部分や、補足したいことを書いてください）",
        "",
        "記事は下記からお読みいただけます。",
        articleUrl,
      ].join("\n"),
    },
  ];
}
