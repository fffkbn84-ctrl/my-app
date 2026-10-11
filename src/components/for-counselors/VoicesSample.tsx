import Image from "next/image";
import { SAMPLE_COUNSELOR } from "./sampleCounselor";

/**
 * /for-counselors の「記事イメージ」。Kinda voices の取材記事の抜粋を、ページ内にだけ出す。
 * 架空のカウンセラーで、単独 URL は作らない（2026-10-11 の判断：検索・/columns 一覧に出さない）。
 * 構成は CLAUDE.md §11 の8セクションのうち、タイトル・リード・プロフィール・本文の一部・引用・CTA。
 */
export default function VoicesSample() {
  const c = SAMPLE_COUNSELOR;
  return (
    <figure className="fc-voices" aria-label="取材記事のイメージ（架空のカウンセラー）">
      <div className="fc-voices-label">
        <span>Kinda voices · 取材レポート</span>
        <span className="fc-voices-badge">記事イメージ・架空のカウンセラーです</span>
      </div>

      <div className="fc-voices-hero">
        <Image
          src="/images/for-counselors/sample-counselor-reel.webp"
          alt=""
          fill
          sizes="(min-width: 720px) 620px, 90vw"
          className="fc-voices-hero-img"
        />
      </div>

      <div className="fc-voices-body">
        <p className="fc-voices-title">
          「迷っている時間も、前に進んでいる時間です」
          <span>
            {c.agencyName}・{c.name}さん（{c.area}）
          </span>
        </p>
        <p className="fc-voices-lead">
          はじめての面談で、{c.shortName}は自分の話を先にしないそうです。
          「何から話してもいいですよ」と伝えて、あとは待つ。
          {c.area}で{c.years}年カウンセラーを続けてきた{c.shortName}に、面談で大切にしていることを伺いました。
        </p>

        <dl className="fc-voices-profile">
          <div>
            <dt>所属</dt>
            <dd>
              {c.agencyName}（{c.area}）
            </dd>
          </div>
          <div>
            <dt>カウンセラー歴</dt>
            <dd>{c.years}年</dd>
          </div>
          <div>
            <dt>面談の形</dt>
            <dd>対面・オンライン</dd>
          </div>
        </dl>

        <p className="fc-voices-h">この仕事を選んだ理由</p>
        <p className="fc-voices-text">
          前職は人材紹介の仕事でした。条件を並べて合う人を探す毎日のなかで、
          条件の外にあるものを聞く仕事がしたくなった、と{c.shortName}は話します。
        </p>
        <p className="fc-voices-fade" aria-hidden="true">
          ……
        </p>

        <blockquote className="fc-voices-quote">
          早く決めなくていいんです。迷っている時間も、ちゃんと前に進んでいる時間なので。
        </blockquote>

        <div className="fc-voices-cta" aria-hidden="true">
          {c.shortName}の話を、直接聞いてみる。
        </div>
      </div>
      <figcaption className="fc-voices-cap">
        記事の最後から、そのままカウンセラーページへ進めます。
      </figcaption>
    </figure>
  );
}
