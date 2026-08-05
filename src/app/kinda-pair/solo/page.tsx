"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import {
  PAIR_LAYERS,
  PAIR_STATE_LABEL,
  PAIR_TOPICS,
  topicsByLayer,
  type PairLayer,
  type PairState,
  type PairTopic,
} from "@/lib/pair/topics";
import { buildPairText, wantTopics } from "@/lib/pair/buildText";
import { clearPairSolo, loadPairSolo, savePairSolo } from "@/lib/pair/storage";
import PairShareCard from "./PairShareCard";

/**
 * Kinda pair ひとりモード。
 *
 * 注意：サーバに一切送らない。このファイルに fetch / Supabase 呼び出しを書かないこと。
 *    状態は localStorage（src/lib/pair/storage.ts）のみ。
 *
 * 画面フロー：
 *   intro → カード（1画面1トピック・28枚）→ 結果
 *   層が切り替わるところで区切り画面を1枚挟む。区切り画面と各層の終わりから
 *   「ここまでで結果を見る」で途中結果に抜けられる。
 */

// ─── 進行シーケンス（カード＋層の区切り）を組み立てる ──────────────────────
type Step =
  | { kind: "topic"; topic: PairTopic; cardIndex: number }
  | { kind: "divider"; layer: PairLayer };

const STEPS: Step[] = (() => {
  const steps: Step[] = [];
  let cardIndex = 0;
  PAIR_LAYERS.forEach((layer, li) => {
    // 最初の層は導入画面が兼ねるため区切りを挟まない
    if (li > 0) steps.push({ kind: "divider", layer: layer.key });
    for (const topic of topicsByLayer(layer.key)) {
      steps.push({ kind: "topic", topic, cardIndex });
      cardIndex += 1;
    }
  });
  return steps;
})();

const TOTAL_CARDS = PAIR_TOPICS.length;

type Phase = "intro" | "flow" | "result";

const STATE_ORDER: PairState[] = ["talked", "want", "hold"];

export default function KindaPairSoloPage() {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [states, setStates] = useState<Record<string, PairState>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [openTalked, setOpenTalked] = useState(false);
  const [openHold, setOpenHold] = useState(false);

  const shareCardRef = useRef<HTMLDivElement>(null);
  const firedLayers = useRef<Set<PairLayer>>(new Set());
  const firedComplete = useRef(false);

  // ─── 復元 ──────────────────────────────────────────────────
  useEffect(() => {
    const stored = loadPairSolo();
    if (Object.keys(stored.states).length > 0) {
      setStates(stored.states);
      // 未回答の最初のカードから再開する
      const nextIdx = STEPS.findIndex(
        (s) => s.kind === "topic" && !stored.states[s.topic.key]
      );
      setStepIndex(nextIdx === -1 ? 0 : nextIdx);
    }
    setHydrated(true);
  }, []);

  // ─── 保存（回答が変わるたび） ────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    if (Object.keys(states).length === 0) return;
    savePairSolo(states);
  }, [states, hydrated]);

  const answeredCount = useMemo(
    () => PAIR_TOPICS.filter((t) => !!states[t.key]).length,
    [states]
  );
  const hasProgress = answeredCount > 0;

  const goResult = useCallback(
    (answered: number) => {
      setPhase("result");
      if (!firedComplete.current) {
        firedComplete.current = true;
        trackEvent("pair_solo_complete", { answered });
      }
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    },
    []
  );

  // ─── 回答 ──────────────────────────────────────────────────
  function answer(topic: PairTopic, value: PairState) {
    const next = { ...states, [topic.key]: value };
    setStates(next);

    // 層の 7 枚を終えたら pair_layer_complete
    const layerTopics = topicsByLayer(topic.layer);
    const done = layerTopics.every((t) => !!next[t.key]);
    if (done && !firedLayers.current.has(topic.layer)) {
      firedLayers.current.add(topic.layer);
      trackEvent("pair_layer_complete", { layer: topic.layer });
    }

    if (stepIndex >= STEPS.length - 1) {
      goResult(PAIR_TOPICS.filter((t) => !!next[t.key]).length);
      return;
    }
    setStepIndex(stepIndex + 1);
  }

  function goBack() {
    if (stepIndex <= 0) {
      setPhase("intro");
      return;
    }
    setStepIndex(stepIndex - 1);
  }

  function start() {
    trackEvent("pair_start");
    setPhase("flow");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  function restart() {
    clearPairSolo();
    setStates({});
    setStepIndex(0);
    firedLayers.current = new Set();
    firedComplete.current = false;
    setOpenTalked(false);
    setOpenHold(false);
    setPhase("intro");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  // ─── 持ち出し ──────────────────────────────────────────────
  async function handleCopy() {
    const text = buildPairText(states);
    try {
      await navigator.clipboard.writeText(text);
      setToast("コピーしました。");
      trackEvent("pair_copy");
      window.setTimeout(() => setToast(null), 2800);
    } catch {
      setToast("コピーに失敗しました。お手数ですが、選択して手動でコピーしてください。");
      window.setTimeout(() => setToast(null), 3500);
    }
  }

  async function handleSaveImage() {
    if (!shareCardRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#FAFAF8",
        scale: 2,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16);
      a.download = `kinda-pair-${ts}.png`;
      a.click();
      setToast("画像を保存しました。iPhoneは長押しで保存もできます。");
      trackEvent("pair_image_save");
      window.setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("画像の生成に失敗しました。少し時間をおいてもう一度お試しください。");
      window.setTimeout(() => setToast(null), 3500);
    } finally {
      setSaving(false);
    }
  }

  // ─── 描画 ──────────────────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="kp-solo">
        <SectionSubHeader sectionName="Kinda pair" sectionRoot="/kinda-pair" />
        <main className="kp-solo-main" />
      </div>
    );
  }

  return (
    <div className="kp-solo">
      <SectionSubHeader sectionName="Kinda pair" sectionRoot="/kinda-pair" />

      <main className="kp-solo-main">
        {phase === "intro" && (
          <IntroView
            hasProgress={hasProgress}
            answeredCount={answeredCount}
            onStart={start}
            onResume={() => setPhase("flow")}
            onResult={() => goResult(answeredCount)}
          />
        )}

        {phase === "flow" && (
          <FlowView
            step={STEPS[stepIndex]}
            states={states}
            onAnswer={answer}
            onBack={goBack}
            onNext={() => setStepIndex(Math.min(stepIndex + 1, STEPS.length - 1))}
            onResult={() => goResult(answeredCount)}
          />
        )}

        {phase === "result" && (
          <ResultView
            states={states}
            openTalked={openTalked}
            openHold={openHold}
            setOpenTalked={setOpenTalked}
            setOpenHold={setOpenHold}
            onCopy={handleCopy}
            onSaveImage={handleSaveImage}
            saving={saving}
            onContinue={() => setPhase("flow")}
            onRestart={restart}
          />
        )}
      </main>

      {toast && <div className="kp-toast">{toast}</div>}

      {/* 画像保存用（オフスクリーン） */}
      <div style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }} aria-hidden>
        <PairShareCard
          ref={shareCardRef}
          topics={wantTopics(states).slice(0, 8)}
          talkedCount={PAIR_TOPICS.filter((t) => states[t.key] === "talked").length}
          totalCount={TOTAL_CARDS}
        />
      </div>
    </div>
  );
}

// ─── 導入画面 ────────────────────────────────────────────────────────────────
function IntroView({
  hasProgress,
  answeredCount,
  onStart,
  onResume,
  onResult,
}: {
  hasProgress: boolean;
  answeredCount: number;
  onStart: () => void;
  onResume: () => void;
  onResult: () => void;
}) {
  return (
    <section className="kp-panel">
      <p className="kp-eyebrow">kinda pair</p>
      <h1 className="kp-solo-title">
        話したことと、
        <br />
        まだ話していないこと。
      </h1>
      <p className="kp-solo-lead">
        {TOTAL_CARDS}の話題を、1枚ずつ送ります。
        <br />
        「もう話した」「まだ」「いまは置いておく」を選ぶだけ。
        <br />
        最後に、まだ触れていない話題と、その聞き方が並びます。
      </p>

      <ul className="kp-layer-list">
        {PAIR_LAYERS.map((l) => (
          <li key={l.key} className="kp-layer-list-item">
            <span className="kp-layer-name">{l.label}</span>
            <span className="kp-layer-lead">{l.lead}</span>
          </li>
        ))}
      </ul>

      <p className="kp-solo-note">
        選んだ内容はお使いの端末の中だけに保存されます。サーバーには送信していません。
      </p>

      {hasProgress ? (
        <div className="kp-btn-col">
          <button type="button" className="kp-btn-primary" onClick={onResume}>
            つづきから（{answeredCount} / {TOTAL_CARDS}）
          </button>
          <button type="button" className="kp-btn-quiet" onClick={onResult}>
            ここまでで結果を見る
          </button>
        </div>
      ) : (
        <div className="kp-btn-col">
          <button type="button" className="kp-btn-primary" onClick={onStart}>
            はじめる
          </button>
        </div>
      )}

      <Link href="/kinda-pair/topics" className="kp-textlink">
        {TOTAL_CARDS}の話題を先にすべて見る
      </Link>
    </section>
  );
}

// ─── カード画面・区切り画面 ──────────────────────────────────────────────────
function FlowView({
  step,
  states,
  onAnswer,
  onBack,
  onNext,
  onResult,
}: {
  step: Step;
  states: Record<string, PairState>;
  onAnswer: (topic: PairTopic, value: PairState) => void;
  onBack: () => void;
  onNext: () => void;
  onResult: () => void;
}) {
  if (step.kind === "divider") {
    const layer = PAIR_LAYERS.find((l) => l.key === step.layer);
    if (!layer) return null;
    return (
      <section className="kp-panel kp-divider">
        <p className="kp-divider-mark">ここから</p>
        <h2 className="kp-divider-title">{layer.label}</h2>
        <p className="kp-divider-lead">{layer.lead}</p>
        <div className="kp-btn-col">
          <button type="button" className="kp-btn-primary" onClick={onNext}>
            つづける
          </button>
          <button type="button" className="kp-btn-quiet" onClick={onResult}>
            ここまでで結果を見る
          </button>
        </div>
        <button type="button" className="kp-btn-ghost" onClick={onBack}>
          ひとつ戻る
        </button>
      </section>
    );
  }

  const { topic, cardIndex } = step;
  const layer = PAIR_LAYERS.find((l) => l.key === topic.layer);
  const current = states[topic.key];
  const layerTopics = topicsByLayer(topic.layer);
  const isLayerLast = layerTopics[layerTopics.length - 1]?.key === topic.key;

  return (
    <section className="kp-panel">
      <div className="kp-progress">
        <button type="button" className="kp-back" onClick={onBack} aria-label="ひとつ戻る">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>戻る</span>
        </button>
        <span className="kp-progress-count">
          {cardIndex + 1} / {TOTAL_CARDS}
        </span>
      </div>

      <p className="kp-card-layer">{layer?.label}</p>
      <h2 className="kp-card-title">{topic.title}</h2>
      {topic.note && <p className="kp-card-note">{topic.note}</p>}

      <div className="kp-choices">
        {STATE_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            className={`kp-choice${current === s ? " is-selected" : ""}`}
            onClick={() => onAnswer(topic, s)}
          >
            {PAIR_STATE_LABEL[s]}
          </button>
        ))}
      </div>

      {isLayerLast && (
        <button type="button" className="kp-btn-quiet" onClick={onResult}>
          ここまでで結果を見る
        </button>
      )}
    </section>
  );
}

// ─── 結果画面 ────────────────────────────────────────────────────────────────
function ResultView({
  states,
  openTalked,
  openHold,
  setOpenTalked,
  setOpenHold,
  onCopy,
  onSaveImage,
  saving,
  onContinue,
  onRestart,
}: {
  states: Record<string, PairState>;
  openTalked: boolean;
  openHold: boolean;
  setOpenTalked: (v: boolean) => void;
  setOpenHold: (v: boolean) => void;
  onCopy: () => void;
  onSaveImage: () => void;
  saving: boolean;
  onContinue: () => void;
  onRestart: () => void;
}) {
  const want = PAIR_TOPICS.filter((t) => states[t.key] === "want");
  const talked = PAIR_TOPICS.filter((t) => states[t.key] === "talked");
  const hold = PAIR_TOPICS.filter((t) => states[t.key] === "hold");
  const answered = want.length + talked.length + hold.length;

  return (
    <section className="kp-panel">
      <p className="kp-eyebrow">kinda pair</p>
      <h1 className="kp-solo-title kp-solo-title--result">
        ふたりの会話は、
        <br />
        いま、ここまで来ています。
      </h1>

      {/* 層ごとの塗りバンド（％は出さない・実数のみ） */}
      <div className="kp-bands">
        {PAIR_LAYERS.map((l) => {
          const ts = topicsByLayer(l.key);
          const talkedInLayer = ts.filter((t) => states[t.key] === "talked").length;
          return (
            <div key={l.key} className="kp-band">
              <div className="kp-band-head">
                <span className="kp-band-name">{l.label}</span>
                <span className="kp-band-count">
                  {ts.length}のうち{talkedInLayer}に触れています
                </span>
              </div>
              <div className="kp-band-cells">
                {ts.map((t) => (
                  <span
                    key={t.key}
                    className={`kp-cell kp-cell--${states[t.key] ?? "none"}`}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {answered < PAIR_TOPICS.length && (
        <button type="button" className="kp-btn-quiet" onClick={onContinue}>
          残りの話題も見る（{PAIR_TOPICS.length - answered}）
        </button>
      )}

      {/* 主役：まだ話していないこと */}
      <h2 className="kp-result-h2">まだ話していないこと</h2>
      {want.length === 0 ? (
        <p className="kp-empty">いまのところ、ありません。</p>
      ) : (
        <ul className="kp-want-list">
          {want.map((t) => (
            <li key={t.key} className="kp-want-item">
              <p className="kp-want-title">{t.title}</p>
              <p className="kp-want-ask">「{t.ask}」</p>
              {t.note && <p className="kp-want-note">{t.note}</p>}
            </li>
          ))}
        </ul>
      )}

      {/* 持ち出し */}
      <div className="kp-btn-col">
        <button type="button" className="kp-btn-primary" onClick={onCopy}>
          コピーする
        </button>
        <button
          type="button"
          className="kp-btn-outline"
          onClick={onSaveImage}
          disabled={saving}
        >
          {saving ? "画像を作成中…" : "画像で保存する"}
        </button>
      </div>

      {/* 折りたたみ：ここまで話したこと */}
      <div className="kp-fold">
        <button
          type="button"
          className="kp-fold-head"
          onClick={() => setOpenTalked(!openTalked)}
          aria-expanded={openTalked}
        >
          <span>ここまで話したこと（{talked.length}）</span>
          <Chevron open={openTalked} />
        </button>
        {openTalked && (
          <ul className="kp-fold-list">
            {talked.length === 0 ? (
              <li className="kp-fold-empty">まだありません。</li>
            ) : (
              talked.map((t) => <li key={t.key}>{t.title}</li>)
            )}
          </ul>
        )}
      </div>

      {/* 折りたたみ：いまは置いておくこと（既定は件数のみ） */}
      <div className="kp-fold">
        <button
          type="button"
          className="kp-fold-head"
          onClick={() => setOpenHold(!openHold)}
          aria-expanded={openHold}
        >
          <span>いまは置いておくこと（{hold.length}）</span>
          <Chevron open={openHold} />
        </button>
        {openHold && (
          <ul className="kp-fold-list">
            {hold.length === 0 ? (
              <li className="kp-fold-empty">まだありません。</li>
            ) : (
              hold.map((t) => <li key={t.key}>{t.title}</li>)
            )}
          </ul>
        )}
      </div>

      <p className="kp-solo-note">
        選んだ内容はお使いの端末の中だけに保存されます。ブラウザの保存データを削除すると、記録も消えます。
      </p>

      <Link href="/kinda-pair/topics" className="kp-textlink">
        {PAIR_TOPICS.length}の話題と聞き方をすべて見る
      </Link>

      <button type="button" className="kp-btn-ghost" onClick={onRestart}>
        はじめからやり直す
      </button>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform .18s ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M3 5.5L7 9.5l4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
