"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";

// ─── Types ──────────────────────────────────────────────────────────────────
type Phase = "q0" | "pre" | "waiting" | "active_sub" | "omiai" | "kousai" | "multiple";

interface Option {
  id: string;
  label: string;
}

interface Question {
  id: string;
  label: string;
  text: string;
  type: "single" | "multi" | "text";
  options?: Option[];
  required: boolean;
}

interface QuizState {
  phase: Phase;
  qIndex: number;
  answers: Record<string, string[]>;
  freeTexts: Record<string, string>;
}

// ─── Q0 選択肢 ──────────────────────────────────────────────────────────────
const Q0_OPTIONS = [
  { id: "pre",     label: "まだ相談所に入っていない",               sub: "入会前でも使えます" },
  { id: "waiting", label: "入会したけど、まだお見合いが始まっていない", sub: "活動準備中の方へ" },
  { id: "active",  label: "活動中（お見合いや交際をしている）",       sub: "今の気持ちを整理しよう" },
];

// ─── active_sub 選択肢 ───────────────────────────────────────────────────────
const ACTIVE_SUB_OPTIONS = [
  { id: "omiai",    label: "お見合いをした（初めて会った）",    sub: "お見合いの気持ちを整理しよう" },
  { id: "kousai",   label: "交際中（2回以上会っている）",       sub: "今の関係について整理する" },
  { id: "multiple", label: "複数人と同時に迷っている",           sub: "迷いや気持ちを整理する" },
];

// ─── pre ルート（入会前）4問 ─────────────────────────────────────────────────
const PRE_QUESTIONS: Question[] = [
  {
    id: "pre_q1", label: "Q1",
    text: "相談所に興味を持ったきっかけは？",
    type: "single", required: true,
    options: [
      { id: "a", label: "自然な出会いがなかなかない" },
      { id: "b", label: "真剣に活動したいと思った" },
      { id: "c", label: "友人や知人に勧められた" },
      { id: "d", label: "なんとなく気になって" },
    ],
  },
  {
    id: "pre_q2", label: "Q2",
    text: "踏み出せていない理由は？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "料金や仕組みがよくわからない" },
      { id: "b", label: "自分に合うカウンセラーがいるか不安" },
      { id: "c", label: "本当に相手が見つかるか自信がない" },
      { id: "d", label: "どんな人が活動しているか想像できない" },
      { id: "e", label: "相談所に入ることへの抵抗感がある" },
      { id: "f", label: "特にない、もう少し情報を集めたい" },
    ],
  },
  {
    id: "pre_q3", label: "Q3",
    text: "一緒にいる人と、どんな時間を過ごしたい？",
    type: "single", required: true,
    options: [
      { id: "a", label: "日常をそのまま共有できる人がいる" },
      { id: "b", label: "話を聞いてくれる人がそばにいる" },
      { id: "c", label: "一緒に新しいことに挑戦したい" },
      { id: "d", label: "特別な日も普通の日も、一緒にいたい" },
    ],
  },
  {
    id: "pre_q4", label: "Q4",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text", required: false,
  },
];

// ─── waiting ルート（お見合い前）4問 ────────────────────────────────────────
const WAITING_QUESTIONS: Question[] = [
  {
    id: "wait_q1", label: "Q1",
    text: "入会してからどのくらい経つ？",
    type: "single", required: true,
    options: [
      { id: "a", label: "1ヶ月以内" },
      { id: "b", label: "1〜3ヶ月" },
      { id: "c", label: "3〜6ヶ月" },
      { id: "d", label: "半年以上" },
    ],
  },
  {
    id: "wait_q2", label: "Q2",
    text: "今の気持ちに近いのは？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "焦りはあるけど、何をすればいいかわからない" },
      { id: "b", label: "カウンセラーに相談したいけど言い出せない" },
      { id: "c", label: "自分のプロフィールや条件に問題があるのか気になる" },
      { id: "d", label: "このまま続けていいのか迷い始めている" },
      { id: "e", label: "活動自体は続けたい、でも不安" },
    ],
  },
  {
    id: "wait_q3", label: "Q3",
    text: "カウンセラーに相談できていない理由は？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "言い返されたり、責められそうで怖い" },
      { id: "b", label: "自分に問題があると思うと言い出せない" },
      { id: "c", label: "何を言えばいいかわからない" },
      { id: "d", label: "気を遣ってしまって本音が言えない" },
      { id: "e", label: "相談してもどうせ変わらないと思っている" },
    ],
  },
  {
    id: "wait_q4", label: "Q4",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text", required: false,
  },
];

// ─── omiai ルート（お見合い済み）5問 ─────────────────────────────────────────
const OMIAI_QUESTIONS: Question[] = [
  {
    id: "omiai_q1", label: "Q1",
    text: "お見合い、どうだった？",
    type: "single", required: true,
    options: [
      { id: "a", label: "楽しかった" },
      { id: "b", label: "普通だった" },
      { id: "c", label: "少し疲れた" },
      { id: "d", label: "よくわからなかった" },
    ],
  },
  {
    id: "omiai_q2", label: "Q2",
    text: "また会いたいと思う？",
    type: "single", required: true,
    options: [
      { id: "a", label: "また会いたい" },
      { id: "b", label: "もう一度なら会えそう" },
      { id: "c", label: "迷っている" },
      { id: "d", label: "あまり会いたくない" },
    ],
  },
  {
    id: "omiai_q3", label: "Q3",
    text: "会ってみてどんな印象だった？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "思ってたより話しやすかった" },
      { id: "b", label: "見た目が思ってたのと少し違った" },
      { id: "c", label: "会話がすごく盛り上がった" },
      { id: "d", label: "沈黙が気になった" },
      { id: "e", label: "ドキドキした瞬間があった" },
      { id: "f", label: "ときめきはなかったけど悪くなかった" },
      { id: "g", label: "なんとなく違う気がした" },
      { id: "h", label: "なんか良さそうだった" },
      { id: "i", label: "特に印象に残らなかった" },
    ],
  },
  {
    id: "omiai_q4", label: "Q4",
    text: "カウンセラーに話したいことは？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "相談したいことがあるけど言葉にできない" },
      { id: "b", label: "相談したいけど指摘されそうで怖い" },
      { id: "c", label: "何を相談すればいいかわからない" },
      { id: "d", label: "また会いたい気持ちを後押ししてほしい" },
      { id: "e", label: "特にない、自分で整理できてる" },
    ],
  },
  {
    id: "omiai_q5", label: "Q5",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text", required: false,
  },
];

// ─── kousai ルート（交際中）4問 ──────────────────────────────────────────────
const KOUSAI_QUESTIONS: Question[] = [
  {
    id: "kousai_q1", label: "Q1",
    text: "最近、相手とどんな時間を過ごしてる？",
    type: "single", required: true,
    options: [
      { id: "a", label: "楽しい時間が多い" },
      { id: "b", label: "普通に会ってる感じ" },
      { id: "c", label: "なんとなくぎこちない" },
      { id: "d", label: "会うのが少し億劫になってきた" },
    ],
  },
  {
    id: "kousai_q2", label: "Q2",
    text: "気になっていることは？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "価値観や習慣が違うなと感じた" },
      { id: "b", label: "会話が盛り上がらないことがある" },
      { id: "c", label: "相手の気持ちがよくわからない" },
      { id: "d", label: "自分の気持ちがよくわからない" },
      { id: "e", label: "このまま進んでいいのか不安" },
      { id: "f", label: "相手のことが好きで、次のステップに進みたい" },
      { id: "g", label: "相手が自分をどう思ってるか気になる" },
      { id: "h", label: "特にない、順調だと思う" },
    ],
  },
  {
    id: "kousai_q3", label: "Q3",
    text: "カウンセラーに話したいことは？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "相談したいことがあるけど言葉にできない" },
      { id: "b", label: "相談したいけど指摘されそうで怖い" },
      { id: "c", label: "何を相談すればいいかわからない" },
      { id: "d", label: "好きな気持ちをどう伝えるか相談したい" },
      { id: "e", label: "特にない、自分で整理できてる" },
    ],
  },
  {
    id: "kousai_q4", label: "Q4",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text", required: false,
  },
];

// ─── multiple ルート（複数人）5問 ─────────────────────────────────────────────
const MULTIPLE_QUESTIONS: Question[] = [
  {
    id: "mu_q1", label: "Q1",
    text: "今、同時に交際している人は何人？",
    type: "single", required: true,
    options: [
      { id: "a", label: "2人" },
      { id: "b", label: "3〜4人" },
      { id: "c", label: "5人以上" },
      { id: "d", label: "数えるのも疲れた" },
    ],
  },
  {
    id: "mu_q2", label: "Q2",
    text: "複数人の中で『この人かも』と思っている人はいる？",
    type: "single", required: true,
    options: [
      { id: "a", label: "いる" },
      { id: "b", label: "まだいない" },
      { id: "c", label: "わからない" },
    ],
  },
  {
    id: "mu_q3", label: "Q3",
    text: "今の気持ちに近いのは？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "誰かひとりに絞りたいけど決められない" },
      { id: "b", label: "比べてしまって罪悪感がある" },
      { id: "c", label: "同時に複数人と会い続けるのが疲れてきた" },
      { id: "d", label: "もっと合う人がいそうで踏み切れない" },
      { id: "e", label: "新しいお見合いも続いていて消耗している" },
      { id: "f", label: "婚活自体しんどくなってきた" },
      { id: "g", label: "特にしんどくはない、整理したいだけ" },
    ],
  },
  {
    id: "mu_q4", label: "Q4",
    text: "カウンセラーに話したいことは？",
    type: "multi", required: true,
    options: [
      { id: "a", label: "少し活動のペースを落としたい" },
      { id: "b", label: "絞り方のアドバイスがほしい" },
      { id: "c", label: "誰かひとりに決める背中を押してほしい" },
      { id: "d", label: "まず気持ちを聞いてもらいたい" },
      { id: "e", label: "何を相談すればいいかわからない" },
    ],
  },
  {
    id: "mu_q5", label: "Q5",
    text: "今の気持ちを、そのまま書いてみて。",
    type: "text", required: false,
  },
];

function getRouteQuestions(phase: Phase): Question[] {
  if (phase === "pre") return PRE_QUESTIONS;
  if (phase === "waiting") return WAITING_QUESTIONS;
  if (phase === "omiai") return OMIAI_QUESTIONS;
  if (phase === "kousai") return KOUSAI_QUESTIONS;
  if (phase === "multiple") return MULTIPLE_QUESTIONS;
  return [];
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function KindaNoteQuizPage() {
  const router = useRouter();

  // Q0 の選択状態（既存実装を維持）
  const [q0Selected, setQ0Selected] = useState<string | null>(null);

  // クイズフロー状態
  const [quizState, setQuizState] = useState<QuizState>({
    phase: "q0",
    qIndex: 0,
    answers: {},
    freeTexts: {},
  });
  const [history, setHistory] = useState<QuizState[]>([]);

  // active_sub の選択状態
  const [activeSubSelected, setActiveSubSelected] = useState<string | null>(null);

  // ボタン押し込み状態
  const [nextPressed, setNextPressed] = useState(false);
  const [backPressed, setBackPressed] = useState(false);

  // ─── 派生値 ──────────────────────────────────────────────────────────────
  const isQ0 = quizState.phase === "q0";
  const isActiveSub = quizState.phase === "active_sub";
  const isSelectionScreen = isQ0 || isActiveSub;
  const questions = isSelectionScreen ? [] : getRouteQuestions(quizState.phase);
  const currentQ = isSelectionScreen ? null : questions[quizState.qIndex] ?? null;
  const currentAnswers = currentQ ? (quizState.answers[currentQ.id] ?? []) : [];
  const currentText = currentQ ? (quizState.freeTexts[currentQ.id] ?? "") : "";
  const total = questions.length;
  const current = quizState.qIndex + 1;
  const remaining = total - current;
  const isLastQ = !isSelectionScreen && quizState.qIndex === total - 1;
  const canProceed = isQ0
    ? q0Selected !== null
    : isActiveSub
      ? activeSubSelected !== null
      : currentQ?.type === "text"
        ? true
        : currentAnswers.length > 0;
  const btnLabel = isLastQ ? "結果を見る" : "つぎへ";

  // ─── ハンドラ ─────────────────────────────────────────────────────────────
  function handleNext() {
    if (!canProceed) return;

    if (isQ0) {
      if (q0Selected === "active") {
        // active → active_sub サブ選択画面へ
        setHistory([{ phase: "q0", qIndex: 0, answers: {}, freeTexts: {} }]);
        setQuizState({ phase: "active_sub", qIndex: 0, answers: {}, freeTexts: {} });
        return;
      }
      // pre / waiting ルートへ遷移
      const nextState: QuizState = {
        phase: q0Selected as Phase,
        qIndex: 0,
        answers: {},
        freeTexts: {},
      };
      setHistory([{ phase: "q0", qIndex: 0, answers: {}, freeTexts: {} }]);
      setQuizState(nextState);
      return;
    }

    if (isActiveSub) {
      // omiai / kousai / multiple いずれのルートへも同じ処理
      setHistory(h => [...h, quizState]);
      setQuizState({ phase: activeSubSelected as Phase, qIndex: 0, answers: {}, freeTexts: {} });
      return;
    }

    // multiple Q2「いる」選択時 → kousai ルートに切り替え
    if (quizState.phase === "multiple" && currentQ?.id === "mu_q2" && currentAnswers[0] === "a") {
      setHistory(h => [...h, quizState]);
      setQuizState({ phase: "kousai", qIndex: 0, answers: {}, freeTexts: {} });
      return;
    }

    if (isLastQ) {
      // 回答を保存して結果ページへ
      try {
        localStorage.setItem("kinda-note-answers", JSON.stringify({
          phase: quizState.phase,
          answers: quizState.answers,
          freeTexts: quizState.freeTexts,
        }));
      } catch { /* ignore */ }
      router.push(`/kinda-note/result?route=${quizState.phase}`);
      return;
    }

    // 次の質問へ
    setHistory(h => [...h, quizState]);
    setQuizState(s => ({ ...s, qIndex: s.qIndex + 1 }));
  }

  function handleBack() {
    if (isQ0) {
      router.push("/kinda-note");
      return;
    }
    if (history.length === 0) {
      setQuizState({ phase: "q0", qIndex: 0, answers: {}, freeTexts: {} });
      return;
    }
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setQuizState(prev);
  }

  function handleOptionSelect(optionId: string) {
    if (!currentQ) return;
    if (currentQ.type === "single") {
      setQuizState(s => ({ ...s, answers: { ...s.answers, [currentQ.id]: [optionId] } }));
    } else {
      const cur = quizState.answers[currentQ.id] ?? [];
      const next = cur.includes(optionId)
        ? cur.filter((id) => id !== optionId)
        : [...cur, optionId];
      setQuizState(s => ({ ...s, answers: { ...s.answers, [currentQ.id]: next } }));
    }
  }

  function handleTextChange(text: string) {
    if (!currentQ) return;
    setQuizState(s => ({ ...s, freeTexts: { ...s.freeTexts, [currentQ.id]: text } }));
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>
      <SectionSubHeader sectionName="Kinda note" sectionRoot="/kinda-note" />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "Kinda note", href: "/kinda-note" },
          { label: "診断中" },
        ]}
      />

      {/* ミニヘッダー */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(245, 238, 230, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #EAE0D8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 56,
          padding: "0 16px",
        }}
      >
        <button
          onClick={handleBack}
          aria-label="戻る"
          onMouseDown={() => setBackPressed(true)}
          onMouseUp={() => setBackPressed(false)}
          onMouseLeave={() => setBackPressed(false)}
          onTouchStart={() => setBackPressed(true)}
          onTouchEnd={() => setBackPressed(false)}
          style={{
            position: "absolute",
            left: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            transform: backPressed ? "translateY(1px)" : "translateY(0)",
            transition: "transform 0.08s",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 4L6 10L12 16"
              stroke="#3A2E26"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 18,
            fontWeight: 500,
            color: "#3A2E26",
            letterSpacing: "0.04em",
          }}
        >
          Kinda note
        </span>
      </div>

      {/* プログレスバー（ルート質問画面のみ） */}
      {!isSelectionScreen && (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "14px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#B0A090", fontFamily: "'DM Sans', sans-serif" }}>
              {current} / {total}
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: "#B0A090", fontFamily: "'DM Sans', sans-serif" }}>
              {remaining > 0 ? `あと ${remaining} 問` : "最後の質問"}
            </span>
          </div>
          <div style={{ height: 4, background: "#EAE0D8", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "#D4A090",
                borderRadius: 2,
                width: `${(current / total) * 100}%`,
                transition: "width 0.4s cubic-bezier(.16,1,.3,1)",
              }}
            />
          </div>
        </div>
      )}

      {/* コンテンツ */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 24px 80px" }}>

        {isQ0 ? (
          /* ─── Q0 画面（既存の実装をそのまま維持） ─── */
          <>
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                letterSpacing: "0.16em",
                color: "#B0A090",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Q0
            </span>

            <h1
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 22,
                fontWeight: 500,
                color: "#3A2E26",
                lineHeight: 1.7,
                marginBottom: 28,
                letterSpacing: "0.03em",
              }}
            >
              今のあなたの状態は？
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {Q0_OPTIONS.map((opt) => {
                const isSel = q0Selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setQ0Selected(opt.id)}
                    onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(1px)"; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    onTouchStart={(e) => { e.currentTarget.style.transform = "translateY(1px)"; }}
                    onTouchEnd={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: isSel ? "#F0D8D0" : "#FDFAF7",
                      border: `1.5px solid ${isSel ? "#D4A090" : "#EAE0D8"}`,
                      borderRadius: 14,
                      padding: "16px 18px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "background 0.15s, border-color 0.15s, transform 0.08s",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${isSel ? "#D4A090" : "#D8D0C8"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border-color 0.15s",
                      }}
                    >
                      {isSel && (
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#D4A090" }} />
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: isSel ? "#B8806E" : "#3A2E26",
                          lineHeight: 1.5,
                          marginBottom: 2,
                          transition: "color 0.15s",
                        }}
                      >
                        {opt.label}
                      </p>
                      <p style={{ fontSize: 11, color: isSel ? "#C89880" : "#B0A090", transition: "color 0.15s" }}>
                        {opt.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : isActiveSub ? (
          /* ─── active_sub 画面（活動中のサブ選択） ─── */
          <>
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                letterSpacing: "0.16em",
                color: "#B0A090",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Q0-2
            </span>

            <h1
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 22,
                fontWeight: 500,
                color: "#3A2E26",
                lineHeight: 1.7,
                marginBottom: 28,
                letterSpacing: "0.03em",
              }}
            >
              今の状況を教えてください。
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {ACTIVE_SUB_OPTIONS.map((opt) => {
                const isSel = activeSubSelected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setActiveSubSelected(opt.id)}
                    onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(1px)"; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    onTouchStart={(e) => { e.currentTarget.style.transform = "translateY(1px)"; }}
                    onTouchEnd={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: isSel ? "#F0D8D0" : "#FDFAF7",
                      border: `1.5px solid ${isSel ? "#D4A090" : "#EAE0D8"}`,
                      borderRadius: 14,
                      padding: "16px 18px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "background 0.15s, border-color 0.15s, transform 0.08s",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${isSel ? "#D4A090" : "#D8D0C8"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border-color 0.15s",
                      }}
                    >
                      {isSel && (
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#D4A090" }} />
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: isSel ? "#B8806E" : "#3A2E26",
                          lineHeight: 1.5,
                          marginBottom: 2,
                          transition: "color 0.15s",
                        }}
                      >
                        {opt.label}
                      </p>
                      <p style={{ fontSize: 11, color: isSel ? "#C89880" : "#B0A090", transition: "color 0.15s" }}>
                        {opt.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* ─── ルート質問画面（pre / waiting / omiai） ─── */
          currentQ && (
            <>
              {/* 質問エリア（装飾画像プレースホルダー付き） */}
              <div style={{ position: "relative", marginBottom: 24 }}>
                {/* 右上装飾（画像がなくても崩れない） */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: -12,
                    width: 80,
                    height: 80,
                    backgroundImage: "url('/images/kinda-note-deco-1.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}
                />
                {/* 左下装飾（画像がなくても崩れない） */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: -12,
                    width: 80,
                    height: 80,
                    backgroundImage: "url('/images/kinda-note-deco-2.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}
                />

                <span
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    color: "#B0A090",
                    fontFamily: "'DM Sans', sans-serif",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {currentQ.label}
                </span>

                <h2
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#3A2E26",
                    lineHeight: 1.7,
                    marginBottom: currentQ.type === "multi" ? 8 : 0,
                  }}
                >
                  {currentQ.text}
                </h2>

                {currentQ.type === "multi" && (
                  <p style={{ fontSize: 12, color: "#B0A090" }}>複数選んでもOK</p>
                )}
              </div>

              {/* 選択肢ボタン */}
              {currentQ.options && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {currentQ.options.map((opt) => {
                    const isSel = currentAnswers.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(1px)"; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                        onTouchStart={(e) => { e.currentTarget.style.transform = "translateY(1px)"; }}
                        onTouchEnd={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: isSel ? "#F0D8D0" : "#FDFAF7",
                          border: `1.5px solid ${isSel ? "#D4A090" : "#EAE0D8"}`,
                          borderRadius: 14,
                          padding: "14px 18px",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          color: isSel ? "#B8806E" : "#3A2E26",
                          fontSize: 14,
                          lineHeight: 1.6,
                          transition: "background 0.15s, border-color 0.15s, color 0.15s, transform 0.08s",
                        }}
                      >
                        {currentQ.type === "single" ? (
                          /* ラジオアイコン */
                          <div
                            style={{
                              flexShrink: 0,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              border: `2px solid ${isSel ? "#D4A090" : "#D8D0C8"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSel && (
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D4A090" }} />
                            )}
                          </div>
                        ) : (
                          /* チェックボックスアイコン */
                          <div
                            style={{
                              flexShrink: 0,
                              width: 18,
                              height: 18,
                              borderRadius: 4,
                              border: `2px solid ${isSel ? "#D4A090" : "#D8D0C8"}`,
                              background: isSel ? "#D4A090" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSel && (
                              <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                                <path
                                  d="M1 4L4 7L10 1"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* multiple Q2「いる」選択時の切り替えバナー */}
              {quizState.phase === "multiple" && currentQ.id === "mu_q2" && currentAnswers.includes("a") && (
                <div
                  style={{
                    background: "#F0D8D0",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontSize: 13,
                    color: "#B8806E",
                    marginBottom: 16,
                  }}
                >
                  気持ちが動いてきたんだね。交際中の質問に切り替えるね。
                </div>
              )}

              {/* テキスト入力（自由記述） */}
              {currentQ.type === "text" && (
                <div style={{ marginBottom: 28 }}>
                  <textarea
                    value={currentText}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="なんとなくでいい、今どんな感じ？"
                    style={{
                      width: "100%",
                      minHeight: 120,
                      background: "#FDFAF7",
                      border: "1.5px solid #EAE0D8",
                      borderRadius: 14,
                      padding: "14px 16px",
                      fontSize: 14,
                      color: "#3A2E26",
                      lineHeight: 1.8,
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                  <p style={{ fontSize: 11, color: "#B0A090", marginTop: 6 }}>
                    書かなくてもOKです
                  </p>
                </div>
              )}
            </>
          )
        )}

        {/* ─── ナビゲーションボタン（全画面共通） ─── */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleBack}
            onMouseDown={() => setBackPressed(true)}
            onMouseUp={() => setBackPressed(false)}
            onMouseLeave={() => setBackPressed(false)}
            onTouchStart={() => setBackPressed(true)}
            onTouchEnd={() => setBackPressed(false)}
            style={{
              flex: 1,
              background: "transparent",
              border: "1.5px solid #EAE0D8",
              borderRadius: 999,
              padding: "16px",
              fontSize: 14,
              color: "#7A6A5A",
              cursor: "pointer",
              transform: backPressed ? "translateY(2px)" : "translateY(0)",
              transition: "transform 0.08s",
            }}
          >
            もどる
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            onMouseDown={() => canProceed && setNextPressed(true)}
            onMouseUp={() => setNextPressed(false)}
            onMouseLeave={() => setNextPressed(false)}
            onTouchStart={() => canProceed && setNextPressed(true)}
            onTouchEnd={() => setNextPressed(false)}
            style={{
              flex: 2,
              background: canProceed ? "#D4A090" : "#EAE0D8",
              border: "none",
              borderRadius: 999,
              padding: "16px",
              fontSize: 14,
              fontWeight: 500,
              color: canProceed ? "white" : "#B0A090",
              cursor: canProceed ? "pointer" : "not-allowed",
              boxShadow: canProceed && !nextPressed ? "0 4px 0 #B8806E" : "none",
              transform: nextPressed && canProceed ? "translateY(2px)" : "translateY(0)",
              transition: "transform 0.08s, box-shadow 0.08s",
            }}
          >
            {btnLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
