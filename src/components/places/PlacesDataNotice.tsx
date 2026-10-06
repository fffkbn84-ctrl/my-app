import type { PlaceHome } from "@/lib/mock/places-home";

/**
 * 一覧の下に出す、掲載データについての注意書き。
 *
 * もとは「現在掲載中のお店はすべてサンプル表示です」を /kinda-act と /kinda-glow に
 * ベタ書きしていた。掲載が全部デモだった頃は正しかったが、実在店が入ったあとも
 * 文言が残り、**実際に行って確かめた店を指して「サンプル」と言う**状態になっていた。
 * 「行って確かめた」バッジと正面から矛盾するうえ、口コミの信頼が核のサービスで
 * これを出しっぱなしにするのは致命的なので、データを見て出し分ける。
 *
 * 文言を足すときもここ1箇所を直す。ページ側にハードコードしない。
 */
export default function PlacesDataNotice({
  places,
  borderColor,
}: {
  places: PlaceHome[];
  borderColor: string;
}) {
  const demoCount = places.filter((p) => p.isDemo).length;

  let body: React.ReactNode = null;

  if (places.length === 0) {
    body = (
      <>
        このページに載せられるお店は、いまはありません。
        <br />
        Kinda ふたりへが実際に行って確かめたお店から、順に公開していきます。
      </>
    );
  } else if (demoCount === places.length) {
    body = (
      <>
        現在掲載中のお店はすべて<strong style={{ color: "var(--ink)" }}>サンプル表示</strong>です。
        <br />
        Kinda ふたりへが実際に取材した本物のお店は、これから順次公開予定です。
      </>
    );
  } else if (demoCount > 0) {
    body = (
      <>
        <strong style={{ color: "var(--ink)" }}>サンプル</strong>と付いているお店は、
        実在の店ではありません。
        <br />
        それ以外は、Kinda ふたりへが実際に行って確かめたお店です。
      </>
    );
  } else {
    // 全部が実在店なら、断り書きは要らない
    return null;
  }

  return (
    <section style={{ padding: "32px 20px 56px", background: "rgba(254,252,250,.18)" }}>
      <div
        style={{
          maxWidth: 540,
          margin: "0 auto",
          padding: "20px 24px",
          background: "rgba(255,255,255,.72)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: `1px dashed ${borderColor}`,
          borderRadius: 16,
          textAlign: "center",
          fontSize: 12,
          color: "var(--mid)",
          lineHeight: 1.85,
        }}
      >
        {body}
      </div>
    </section>
  );
}
