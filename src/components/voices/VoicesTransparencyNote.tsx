/**
 * Kinda voices 記事末尾の透明性表記。
 *
 * 著者プロフィールカードの `/about/transparency` リンクは「Kinda が相談所から
 * 手数料を得ている」という構造の開示。ここで足りていないのは
 * 「この記事自体は買われたものではない」という記事単位の開示なので、
 * リンクは重複させず、一文だけを置く。
 *
 * 全 voices 記事に例外なく表示する。強調しないが、隠さない。
 */
export default function VoicesTransparencyNote() {
  return (
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "11px",
        fontWeight: 300,
        lineHeight: 1.9,
        color: "var(--muted)",
        margin: "0 0 24px",
        paddingLeft: "12px",
        borderLeft: "2px solid var(--light)",
      }}
    >
      この記事は取材にもとづく編集記事です。掲載にあたり、金銭の授受はありません。
    </p>
  );
}
