"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";

import {
  getWeatherDescription,
  type RouteKey,
  type WeatherKey,
} from "../data/weatherDescriptions";
import { getTypeContent, type TypeContent } from "../data/typeContent";
import { decideTypeForRoute } from "../lib/decideType";
import { saveKindaNoteHistory } from "../lib/storage";
import { buildMemoText } from "../lib/buildMemo";
import { getQuestionsForRoute } from "../data/questions";
import WeatherIcon from "../components/WeatherIcon";
import ShareCard from "../components/ShareCard";

const VALID_ROUTES: RouteKey[] = [
  "pre",
  "waiting",
  "omiai",
  "date1",
  "kousai",
  "multiple",
];

type StoredAnswers = {
  phase: RouteKey;
  answers: Record<string, string[]>;
  freeTexts: Record<string, string>;
};

type Props = {
  /** Server component から URL の ?route= を渡す */
  initialRoute: string | null;
};

export default function ResultContent({ initialRoute }: Props) {
  const router = useRouter();

  // ─── 状態 ────────────────────────────────────────
  const [stored, setStored] = useState<StoredAnswers | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const savedRef = useRef(false);

  // ─── localStorage 読み込み ──────────────────────
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem("kinda-note-answers");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAnswers;
        setStored(parsed);
      }
    } catch {
      // 無視
    }
  }, []);

  // ─── ルートと天気の決定 ─────────────────────────
  const route: RouteKey = useMemo(() => {
    if (initialRoute && (VALID_ROUTES as string[]).includes(initialRoute)) {
      return initialRoute as RouteKey;
    }
    return stored?.phase ?? "omiai";
  }, [initialRoute, stored]);

  const weather: WeatherKey = useMemo(() => {
    if (!stored) return defaultWeatherForRoute(route);
    return decideTypeForRoute(route, stored.answers);
  }, [route, stored]);

  const typeContent = getTypeContent(weather);
  const weatherDesc = getWeatherDescription(weather);

  // ─── 履歴保存 + 完了イベント送信（1回だけ） ─────
  useEffect(() => {
    if (!hydrated || !stored || !typeContent || savedRef.current) return;
    savedRef.current = true;

    saveKindaNoteHistory({
      route,
      result_type: typeContent.fullName,
      weather,
      answers: { answers: stored.answers, freeTexts: stored.freeTexts },
    });

    trackEvent("kinda_note_complete", {
      weather_type: weather,
      route,
    });
  }, [hydrated, stored, typeContent, weather, route]);

  // typeContent が見つからないことは原則ないが、安全弁として
  if (!typeContent) {
    return (
      <FallbackError
        message="結果データが見つかりませんでした。"
        onRetry={() => router.push("/kinda-note/quiz")}
      />
    );
  }

  // ─── 派生値 ──────────────────────────────────────
  // hydrated 前は answers が空のため layer2/3 はゼロ件、selected ラベルもゼロ件で
  // SSR 出力とクライアント初期描画が一致する（ハイドレーション安全）。
  // useEffect で localStorage を読み込んだ後、再レンダリングで埋まる。
  const answers = stored?.answers ?? {};
  const freeTexts = stored?.freeTexts ?? {};
  const visibleLayer2 = hydrated
    ? typeContent.layer2.filter(
        (e) => !e.when || e.when(answers, freeTexts)
      )
    : [];
  const visibleLayer3 = hydrated
    ? typeContent.layer3.filter(
        (e) => !e.when || e.when(answers, freeTexts)
      )
    : [];

  const isPre = route === "pre";
  const isActiveRoute = !isPre;

  // ─── メモコピー ─────────────────────────────────
  async function handleCopy() {
    if (!typeContent) return;
    const text = buildMemoText({
      fullName: typeContent.fullName,
      route,
      answers,
      freeTexts,
    });
    try {
      await navigator.clipboard.writeText(text);
      setToast("コピーしました。カウンセラーに貼って伝えられます。");
      trackEvent("kinda_note_share", { method: "copy", weather_type: weather });
      window.setTimeout(() => setToast(null), 2800);
    } catch {
      setToast("コピーに失敗しました。お手数ですが、選択して手動でコピーしてください。");
      window.setTimeout(() => setToast(null), 3500);
    }
  }

  // ─── 画像保存 ───────────────────────────────────
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
      a.download = `kinda-note-${weather}-${ts}.png`;
      a.click();
      setToast("画像を保存しました。iPhoneは長押しで保存もできます。");
      trackEvent("kinda_note_share", { method: "image", weather_type: weather });
      window.setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("画像の生成に失敗しました。少し時間をおいてもう一度お試しください。");
      window.setTimeout(() => setToast(null), 3500);
    } finally {
      setSaving(false);
    }
  }

  // ─── ShareCard に渡す選択ラベル一覧 ─────────────
  const selectedLabels = useMemo(() => {
    const out: string[] = [];
    const qs = getQuestionsForRoute(route);
    for (const q of qs) {
      if (q.type === "text") continue;
      const ids = answers[q.id] ?? [];
      for (const id of ids) {
        const label = q.options?.[id];
        if (label) out.push(label);
      }
    }
    return out;
  }, [route, answers]);

  const firstFreeText = useMemo(() => {
    const qs = getQuestionsForRoute(route);
    for (const q of qs) {
      if (q.type === "text") {
        const t = (freeTexts[q.id] ?? "").trim();
        if (t.length > 0) return t;
      }
    }
    return "";
  }, [route, freeTexts]);

  // ─── レンダリング ────────────────────────────────
  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <Header onBack={() => router.push("/kinda-note")} />

      <main
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "20px 24px 80px",
        }}
      >
        {/* ヒーロー */}
        <Hero type={typeContent} weatherDesc={weatherDesc} />

        {/* 第1層（常に表示） */}
        <Section>
          <Eyebrow>今のあなたは</Eyebrow>
          <BodyText>{typeContent.layer1}</BodyText>
        </Section>

        {/* 展開ボタン */}
        {(visibleLayer2.length > 0 ||
          visibleLayer3.length > 0 ||
          typeContent.encourage) && (
          <ExpandToggle expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        )}

        {expanded && (
          <>
            {visibleLayer2.length > 0 && (
              <Section>
                <Eyebrow>気持ちの整理</Eyebrow>
                {visibleLayer2.map((e, i) => (
                  <ConditionalBlock key={i} label={e.label} body={e.body} accent={typeContent.color} />
                ))}
              </Section>
            )}

            {visibleLayer3.length > 0 && (
              <Section>
                <Eyebrow>あなたの組み合わせから</Eyebrow>
                {visibleLayer3.map((e, i) => (
                  <ConditionalBlock key={i} label={e.label} body={e.body} accent={typeContent.color} />
                ))}
              </Section>
            )}

            {/* encourage は pre のみ */}
            {isPre && typeContent.encourage && (
              <EncourageCard text={typeContent.encourage} accent={typeContent.color} />
            )}
          </>
        )}

        {/* consultTexts（活動中ルートのみ・常に表示） */}
        {isActiveRoute && typeContent.consultTexts && typeContent.consultTexts.length > 0 && (
          <Section>
            <Eyebrow>カウンセラーに伝えるなら</Eyebrow>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {typeContent.consultTexts.map((t, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.9,
                    color: "#3A2E26",
                    paddingLeft: 14,
                    borderLeft: `3px solid ${typeContent.color}`,
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Kinda story 誘導カード（ポジティブ系3タイプ限定） */}
        {typeContent.storyCard && <StoryCard />}

        {/* メイン CTA */}
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          {isPre ? (
            <PreButtons />
          ) : (
            <ActiveButtons
              onCopy={handleCopy}
              onSaveImage={handleSaveImage}
              saving={saving}
            />
          )}
          <RestartButton />
        </div>

        {/* 活動中ルートのみ：他の機能も見てみる */}
        {isActiveRoute && <SubLinks />}
      </main>

      {/* オフスクリーン ShareCard（画像保存用）
          ShareCard 内で new Date() を使うため、SSR と client で値が
          ズレてハイドレーション警告が出る。クライアント側でのみ描画する。 */}
      {hydrated && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: -10000,
            top: 0,
            pointerEvents: "none",
          }}
        >
          <ShareCard
            ref={shareCardRef}
            type={typeContent}
            weather={weatherDesc}
            selectedLabels={selectedLabels}
            freeText={firstFreeText}
          />
        </div>
      )}

      {/* トースト */}
      {toast && <Toast text={toast} />}
    </div>
  );
}

// ─── サブコンポーネント ──────────────────────────────────────────────────────

function Header({ onBack }: { onBack: () => void }) {
  return (
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
        onClick={onBack}
        aria-label="戻る"
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
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="#3A2E26" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  );
}

function Hero({
  type,
  weatherDesc,
}: {
  type: TypeContent;
  weatherDesc: ReturnType<typeof getWeatherDescription>;
}) {
  return (
    <section style={{ paddingTop: 28, paddingBottom: 12 }}>
      {/* eyebrow */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: "0.16em",
          color: "#B0A090",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {weatherDesc.name_en}
      </div>

      {/* 天気アイコン */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <WeatherIcon weather={type.weather} size={120} color={type.color} />
      </div>

      {/* タイプ名 */}
      <h1
        style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: 30,
          fontWeight: 500,
          color: "#3A2E26",
          letterSpacing: "0.04em",
          textAlign: "center",
          lineHeight: 1.5,
          marginBottom: 14,
        }}
      >
        {type.fullName}
      </h1>

      {/* summary */}
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 19,
          fontStyle: "italic",
          textAlign: "center",
          color: "#3A2E26",
          lineHeight: 1.7,
          margin: "0 8px 16px",
        }}
      >
        {type.summary}
      </p>

      {/* 天気の解説（v3 で追加） */}
      <div
        style={{
          background: "#FDFAF7",
          borderRadius: 16,
          padding: "20px 22px",
          fontFamily: "'Georgia', serif",
          fontSize: 14,
          lineHeight: 1.9,
          color: "#3A2E26",
          letterSpacing: "0.02em",
          whiteSpace: "pre-line",
          margin: "8px 0 24px",
        }}
      >
        {weatherDesc.description}
      </div>

      {/* 区切り線 */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(to right, transparent, #EAE0D8 30%, #EAE0D8 70%, transparent)",
          marginBottom: 24,
        }}
      />
    </section>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section style={{ marginBottom: 24 }}>{children}</section>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        letterSpacing: "0.16em",
        color: "#D4A090",
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 14.5,
        lineHeight: 2,
        color: "#3A2E26",
        whiteSpace: "pre-line",
      }}
    >
      {children}
    </p>
  );
}

function ConditionalBlock({
  label,
  body,
  accent,
}: {
  label?: string;
  body: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#FDFAF7",
        border: "1px solid #EAE0D8",
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 10,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 11,
            color: accent,
            fontWeight: 500,
            marginBottom: 8,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      )}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.95,
          color: "#3A2E26",
          whiteSpace: "pre-line",
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

function ExpandToggle({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        background: "transparent",
        border: "1px solid #EAE0D8",
        borderRadius: 999,
        padding: "12px 16px",
        fontSize: 13,
        color: "#7A6A5A",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 24,
      }}
    >
      <span>{expanded ? "閉じる" : "もう少し詳しく読む"}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        style={{
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition: "transform .25s",
        }}
      >
        <path d="M3 5 L7 9 L11 5" stroke="#7A6A5A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function EncourageCard({ text, accent }: { text: string; accent: string }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
        border: `1px solid ${accent}44`,
        borderRadius: 16,
        padding: "20px 22px",
        marginBottom: 24,
      }}
    >
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.9,
          color: "#3A2E26",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function StoryCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #EAE0D8",
        borderRadius: 20,
        padding: 24,
        marginTop: 32,
        marginBottom: 8,
        position: "relative",
      }}
    >
      <div
        style={{
          height: 1,
          background: "#EAE0D8",
          opacity: 0.6,
          marginTop: -24,
          marginBottom: 20,
          marginLeft: -24,
          marginRight: -24,
        }}
      />
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          fontSize: 17,
          lineHeight: 1.8,
          color: "#3A2E26",
          marginBottom: 12,
        }}
      >
        今日のあなたの物語を、誰かに残しませんか？
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.9, color: "#7A6A5A", marginBottom: 18 }}>
        書かなくてもいいし、書くなら匿名でもいい。あなたが今感じているこの気持ちは、これから始める誰かの「自分もこうなりたい」になるかもしれません。
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Link
          href="/kinda-story/new"
          style={storyBtnStyle}
        >
          Kinda story に書いてみる
        </Link>
        <Link
          href="/kinda-story"
          style={storyBtnStyle}
        >
          いまは見るだけ
        </Link>
      </div>
    </div>
  );
}

const storyBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#FDFAF7",
  border: "1px solid #EAE0D8",
  borderRadius: 999,
  padding: "12px 14px",
  fontSize: 13,
  color: "#3A2E26",
  textDecoration: "none",
  textAlign: "center",
  lineHeight: 1.4,
};

function PreButtons() {
  return (
    <>
      {/* 1. Kinda type（primary、最大） */}
      <Link
        href="/kinda-type"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#D4A090",
          color: "white",
          textDecoration: "none",
          borderRadius: 999,
          padding: "18px",
          fontSize: 15,
          fontWeight: 500,
          boxShadow: "0 5px 0 #B8806E",
          letterSpacing: "0.04em",
        }}
      >
        Kinda type であなたに合うカウンセラーを
      </Link>

      {/* 2. Kinda talk（secondary） */}
      <Link href="/kinda-talk" style={secondaryStyle}>
        Kinda talk でカウンセラーを見てみる
      </Link>

      {/* 3. Kinda glow（secondary） */}
      <Link href="/kinda-glow" style={secondaryStyle}>
        Kinda glow で自分を整える時間を
      </Link>

      {/* 4. Kinda story（tertiary、小） */}
      <Link href="/kinda-story" style={tertiaryStyle}>
        Kinda story を見てみる
      </Link>
    </>
  );
}

const secondaryStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#FDFAF7",
  border: "1.5px solid #EAE0D8",
  borderRadius: 999,
  padding: "14px",
  fontSize: 14,
  color: "#3A2E26",
  textDecoration: "none",
  textAlign: "center",
  letterSpacing: "0.02em",
};

const tertiaryStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "1px solid #EAE0D8",
  borderRadius: 999,
  padding: "10px",
  fontSize: 12.5,
  color: "#7A6A5A",
  textDecoration: "none",
  textAlign: "center",
};

function ActiveButtons({
  onCopy,
  onSaveImage,
  saving,
}: {
  onCopy: () => void;
  onSaveImage: () => void;
  saving: boolean;
}) {
  return (
    <>
      <button
        onClick={onCopy}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#D4A090",
          color: "white",
          border: "none",
          borderRadius: 999,
          padding: "18px",
          fontSize: 15,
          fontWeight: 500,
          boxShadow: "0 5px 0 #B8806E",
          letterSpacing: "0.04em",
          cursor: "pointer",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="4" y="3" width="9" height="11" rx="1.5" stroke="white" strokeWidth="1.4" />
          <path d="M3 6V12.5C3 13.6 3.9 14.5 5 14.5H10" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        この気持ちを、そのまま渡す
      </button>

      <button
        onClick={onSaveImage}
        disabled={saving}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: saving ? "#EAE0D8" : "#FDFAF7",
          border: "1.5px solid #EAE0D8",
          borderRadius: 999,
          padding: "14px",
          fontSize: 14,
          color: saving ? "#B0A090" : "#3A2E26",
          cursor: saving ? "wait" : "pointer",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="11.5" cy="5.5" r="0.6" fill="currentColor" />
        </svg>
        {saving ? "画像を生成中..." : "画像にして持っておく"}
      </button>
    </>
  );
}

function RestartButton() {
  return (
    <Link
      href="/kinda-note/quiz"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        padding: "10px",
        fontSize: 13,
        color: "#A0907A",
        textDecoration: "none",
        textAlign: "center",
      }}
    >
      もう一度やってみる
    </Link>
  );
}

function SubLinks() {
  return (
    <div
      style={{
        marginTop: 32,
        paddingTop: 20,
        borderTop: "1px solid #EAE0D8",
        textAlign: "center",
        opacity: 0.85,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: "#A0907A",
          marginBottom: 12,
          letterSpacing: "0.04em",
        }}
      >
        他の機能も見てみる
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/kinda-act" style={subLinkStyle}>
          Kinda act：お見合いやデートに使いやすい場所
        </Link>
        <Link href="/kinda-glow" style={subLinkStyle}>
          Kinda glow：好きな人に会う前に、自分を整える時間
        </Link>
      </div>
    </div>
  );
}

const subLinkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 16px",
  fontSize: 13,
  color: "#3A2E26",
  textDecoration: "none",
  border: "1px solid #EAE0D8",
  borderRadius: 8,
  background: "#FDFAF7",
};

function Toast({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#3A2E26",
        color: "white",
        padding: "14px 20px",
        borderRadius: 999,
        fontSize: 13,
        boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
        zIndex: 50,
        maxWidth: "90vw",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}

function FallbackError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      style={{
        background: "#F5EEE6",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 24,
      }}
    >
      <p style={{ fontSize: 14, color: "#7A6A5A" }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          background: "#D4A090",
          color: "white",
          border: "none",
          borderRadius: 999,
          padding: "12px 28px",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        もう一度やってみる
      </button>
    </div>
  );
}

function defaultWeatherForRoute(route: RouteKey): WeatherKey {
  switch (route) {
    case "pre":
      return "flower_overcast";
    case "waiting":
      return "light_rain";
    case "omiai":
      return "angels_ladder";
    case "date1":
      return "wandering_clouds";
    case "kousai":
      return "mist";
    case "multiple":
      return "faint_sunlight";
  }
}
