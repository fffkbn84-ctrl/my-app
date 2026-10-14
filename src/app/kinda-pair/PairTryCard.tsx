"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  PAIR_STATE_LABEL,
  PAIR_TOPICS,
  topicsByLayer,
  type PairState,
} from "@/lib/pair/topics";
import { loadPairSolo, savePairSolo } from "@/lib/pair/storage";

/**
 * /kinda-pair LP の「1枚めくれる話題カード」。
 * docs/research/2026-10-12-shohyo-tokyo-ugoki.md §4（80億分の1 を参考に・説明より先に触らせる）。
 *
 * - 出すのは第1層（ふれる）の7枚だけ。軽い話題から触ってもらう
 * - 選んだ答えは solo と同じ localStorage（kinda_pair_solo_v1）に入れる。
 *   solo を開くとこの1枚は回答済みとして続きから始まる
 * - サーバに一切送らない（fetch / Supabase を書かない）
 * - 数字・％・相性は出さない
 */

const DECK = topicsByLayer("l1");
const STATE_ORDER: PairState[] = ["talked", "want", "hold"];

const AFTER: Record<PairState, string> = {
  talked: "「もう話した」に入れておきました。",
  want: "次に会うときはこの聞き方をそのまま使えます。",
  hold: "「いまは置いておく」に入れておきました。",
};

export default function PairTryCard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [states, setStates] = useState<Record<string, PairState>>({});

  const topic = DECK[index];
  const current = states[topic.key];
  const answeredCount = PAIR_TOPICS.filter((t) => !!states[t.key]).length;
  const rest = PAIR_TOPICS.length - answeredCount;

  function flip() {
    if (flipped) return;
    // 端末の記録はめくったときに読む（solo で答えた分も選択済みで出す）
    setStates(loadPairSolo().states);
    setFlipped(true);
    trackEvent("pair_lp_card_flip", { topic: topic.key });
  }

  function answer(value: PairState) {
    const next = { ...loadPairSolo().states, [topic.key]: value };
    savePairSolo(next);
    setStates(next);
    trackEvent("pair_lp_card_answer", { topic: topic.key, state: value });
  }

  function nextCard() {
    setFlipped(false);
    setIndex((i) => (i + 1) % DECK.length);
  }

  return (
    <div className="kp-try">
      <div className={`kp-try-card${flipped ? " is-flipped" : ""}`}>
        <button
          type="button"
          className="kp-try-face kp-try-front"
          onClick={flip}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
        >
          <span className="kp-try-layer">ふれる</span>
          <span className="kp-try-title">{topic.title}</span>
          <span className="kp-try-hint">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2.5 7a4.5 4.5 0 0 1 8-2.8M11.5 7a4.5 4.5 0 0 1-8 2.8M10.5 1.8v2.6H7.9M3.5 12.2V9.6h2.6"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            タップしてめくる
          </span>
        </button>

        <div className="kp-try-face kp-try-back" aria-hidden={!flipped}>
          <span className="kp-try-layer">聞き方</span>
          <p className="kp-try-ask">{topic.ask}</p>
          <p className="kp-try-q">この話はもうしましたか？</p>
          <div className="kp-try-choices">
            {STATE_ORDER.map((s) => (
              <button
                key={s}
                type="button"
                className={`kp-choice${current === s ? " is-selected" : ""}`}
                onClick={() => answer(s)}
                tabIndex={flipped ? 0 : -1}
              >
                {PAIR_STATE_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="kp-try-after" aria-live="polite">
        {flipped && current && (
          <>
            <p className="kp-try-after-text">{AFTER[current]}</p>
            <Link href="/kinda-pair/solo" className="kp-btn-primary kp-btn-inline">
              {rest > 0 ? `残りの${rest}の話題も並べる` : "並べた結果を見る"}
            </Link>
          </>
        )}
        {flipped && (
          <button type="button" className="kp-btn-quiet" onClick={nextCard}>
            別の話題をめくる
          </button>
        )}
      </div>
    </div>
  );
}
