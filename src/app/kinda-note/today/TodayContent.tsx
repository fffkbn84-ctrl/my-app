"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import ShareBar from "@/components/share/ShareBar";
import { trackEvent } from "@/lib/analytics";
import PolaroidWeatherCard from "../components/PolaroidWeatherCard";
import ShareCard from "../components/ShareCard";
import {
  DAILY_QUESTIONS,
  PASSING_NOTE,
  SKIP_SIZE_FEELINGS,
  decideDailyWeather,
  getCardWeather,
  getDailyLabel,
  getDailyTodayOne,
  type CardWeatherKey,
} from "../data/daily";
import {
  loadKindaNoteHistory,
  saveKindaNoteHistory,
  type KindaNoteHistoryItem,
} from "../lib/storage";

/**
 * Kinda note「今日の天気」（毎日モード・入口の主役）。
 * 3問（気持ち／大きさ／いまの自分）＋任意の一言 → 天気。仕様は docs/specs/kinda-note-daily-weather.md
 * 回答は端末の履歴（kinda_note_history）にだけ残す。段階の note と同じ履歴に積むので、
 * 「これまでの天気」は両方を日付順に並べる。
 */

const INK = "#3A2E26";
const SUB = "#7A6A5A";
const FAINT = "#B0A090";
const ACCENT = "#D4A090";

type Answers = { feeling?: string; size?: string; want?: string };

export default function TodayContent() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..2 = 質問, 3 = 一言, 4 = 結果
  const [answers, setAnswers] = useState<Answers>({});
  const [note, setNote] = useState("");
  const [weather, setWeather] = useState<CardWeatherKey | null>(null);
  const [recent, setRecent] = useState<KindaNoteHistoryItem[]>([]);
  const [tiltAngle, setTiltAngle] = useState("rotate(0deg)");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    trackEvent("kinda_note_daily_start");
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  const isQuestion = step <= 2;
  const q = isQuestion ? DAILY_QUESTIONS[step] : null;

  function select(optionId: string) {
    if (!q) return;
    // 「何もない日」には大きさが無いので、Q2（どのくらい？）を飛ばす
    const skipSize = q.id === "feeling" && SKIP_SIZE_FEELINGS.includes(optionId);
    setAnswers((a) => {
      const next = { ...a, [q.id]: optionId };
      if (q.id === "feeling") next.size = skipSize ? undefined : a.size;
      return next;
    });
    // 選んだ色を一瞬見せてから次へ（20秒で終わる軽さを優先して「つぎへ」は押させない）
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => setStep((s) => s + (skipSize ? 2 : 1)), 260);
  }

  function back() {
    if (step === 0) {
      router.push("/kinda-note");
      return;
    }
    // Q3 から戻るとき、Q2 を飛ばしていたら Q1 へ
    const skipped = SKIP_SIZE_FEELINGS.includes(answers.feeling ?? "");
    setStep((s) => (s === 2 && skipped ? 0 : s - 1));
  }

  function finish() {
    const w = decideDailyWeather(answers.feeling ?? "unknown", answers.size ?? "little");
    // これまでの天気は、今回を保存する前に読む（今回の分を含めないため）
    const previous = loadKindaNoteHistory().slice(-6).reverse();
    const isRare = Math.random() < 0.03;
    const angle = `rotate(${(isRare ? (Math.random() * 2 - 1) * 1.8 : 0).toFixed(2)}deg)`;
    const desc = getCardWeather(w)!;
    saveKindaNoteHistory({
      route: "daily",
      result_type: `Kinda ${desc.name_ja}`,
      weather: w,
      answers: { answers, freeTexts: note.trim() ? { daily_note: note.trim() } : {} },
      meta: { isRareTilt: isRare, tiltAngle: angle },
    });
    // 計測は天気名と回数だけ（回答内容は送らない）
    trackEvent("kinda_note_daily_complete", { weather_type: w, count: previous.length + 1 });

    const params = new URLSearchParams({ weather: w });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    setShareUrl(window.location.href);
    setRecent(previous);
    setTiltAngle(angle);
    setWeather(w);
    setStep(4);
    window.scrollTo({ top: 0 });
  }

  function restart() {
    setAnswers({});
    setNote("");
    setWeather(null);
    setStep(0);
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0 });
  }

  async function saveImage() {
    if (!shareCardRef.current || saving || !weather) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#FAFAF8",
        scale: 2,
        useCORS: true,
      });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16);
      a.download = `kinda-today-${weather}-${ts}.png`;
      a.click();
      showToast("画像を保存しました。iPhoneは長押しで保存もできます。", 3000);
      trackEvent("kinda_note_share", { method: "image", weather_type: weather, route: "daily" });
    } catch {
      showToast("画像の生成に失敗しました。少し時間をおいてもう一度お試しください。", 3500);
    } finally {
      setSaving(false);
    }
  }

  function showToast(text: string, ms: number) {
    setToast(text);
    window.setTimeout(() => setToast(null), ms);
  }

  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>
      <SectionSubHeader sectionName="Kinda note" sectionRoot="/kinda-note" />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "Kinda note", href: "/kinda-note" },
          { label: "今日の天気" },
        ]}
      />

      <MiniHeader onBack={step === 4 ? () => router.push("/kinda-note") : back} />

      {step <= 3 && (
        <div className="pc-readable" style={{ padding: "14px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: FAINT, fontFamily: "'DM Sans', sans-serif" }}>
              {Math.min(step + 1, 3)} / 3
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: FAINT }}>
              {step === 3 ? "書かなくても大丈夫" : "選ぶだけ"}
            </span>
          </div>
          <div style={{ height: 4, background: "#EAE0D8", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: ACCENT,
                borderRadius: 2,
                width: `${(Math.min(step + 1, 3) / 3) * 100}%`,
                transition: "width 0.4s cubic-bezier(.16,1,.3,1)",
              }}
            />
          </div>
        </div>
      )}

      <div className="pc-readable" style={{ padding: "28px 24px 80px" }}>
        {q && (
          <>
            <h1 style={headingStyle}>{q.text}</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {q.options.map((opt) => {
                const isSel = answers[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => select(opt.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: isSel ? "#F0D8D0" : "#FDFAF7",
                      border: `1.5px solid ${isSel ? ACCENT : "#EAE0D8"}`,
                      borderRadius: 14,
                      padding: "14px 18px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      color: isSel ? "#B8806E" : INK,
                      fontSize: 14,
                      lineHeight: 1.6,
                      transition: "background 0.15s, border-color 0.15s, color 0.15s",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `2px solid ${isSel ? ACCENT : "#D8D0C8"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSel && (
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT }} />
                      )}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button onClick={back} style={ghostButtonStyle}>
              もどる
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={headingStyle}>今日のことを、ひとことだけ。</h1>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={140}
              placeholder="書かなくても大丈夫です"
              style={{
                width: "100%",
                minHeight: 110,
                background: "#FDFAF7",
                border: "1.5px solid #EAE0D8",
                borderRadius: 14,
                padding: "14px 16px",
                fontSize: 14,
                color: INK,
                lineHeight: 1.8,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: 6,
                boxSizing: "border-box",
              }}
            />
            <p style={{ fontSize: 11, color: FAINT, margin: "0 0 28px" }}>
              書いた言葉は、この端末にだけ残ります。
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={back} style={{ ...ghostButtonStyle, flex: 1 }}>
                もどる
              </button>
              <button onClick={finish} style={primaryButtonStyle}>
                天気にする
              </button>
            </div>
          </>
        )}

        {step === 4 && weather && (
          <Result
            weather={weather}
            answers={answers}
            note={note.trim()}
            recent={recent}
            tiltAngle={tiltAngle}
            shareUrl={shareUrl}
            saving={saving}
            onSaveImage={saveImage}
            onRestart={restart}
          />
        )}
      </div>

      {/* オフスクリーン ShareCard（画像保存用） */}
      {step === 4 && weather && (
        <div aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }}>
          <ShareCard
            ref={shareCardRef}
            type={{
              fullName: `今日の天気　${getCardWeather(weather)?.name_ja ?? ""}`,
              summary: getCardWeather(weather)?.description.split("\n")[0] ?? "",
              color: getCardWeather(weather)?.color ?? ACCENT,
            }}
            weather={{ key: weather, name_en: getCardWeather(weather)?.name_en ?? "" }}
            selectedLabels={[
              getDailyLabel("feeling", answers.feeling ?? ""),
              getDailyLabel("size", answers.size ?? ""),
            ].filter(Boolean)}
            freeText={note.trim()}
            tiltAngle={tiltAngle}
          />
        </div>
      )}

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 96,
            transform: "translateX(-50%)",
            background: "rgba(58,46,38,0.92)",
            color: "white",
            fontSize: 13,
            padding: "10px 16px",
            borderRadius: 999,
            zIndex: 60,
            maxWidth: "calc(100% - 32px)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── 結果 ─────────────────────────────────────────────────────────────────

function Result({
  weather,
  answers,
  note,
  recent,
  tiltAngle,
  shareUrl,
  saving,
  onSaveImage,
  onRestart,
}: {
  weather: CardWeatherKey;
  answers: Answers;
  note: string;
  recent: KindaNoteHistoryItem[];
  tiltAngle: string;
  shareUrl: string;
  saving: boolean;
  onSaveImage: () => void;
  onRestart: () => void;
}) {
  const desc = getCardWeather(weather)!;
  const accent = desc.color;
  const todayOne = getDailyTodayOne(answers.want ?? "stay");

  return (
    <>
      <p style={{ textAlign: "center", fontSize: 12, letterSpacing: "0.16em", color: FAINT, margin: 0 }}>
        今日のあなたの天気は
      </p>
      <PolaroidWeatherCard weather={weather} nameEn={desc.name_en} tiltAngle={tiltAngle} />
      <h1
        style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: 28,
          fontWeight: 500,
          color: INK,
          textAlign: "center",
          margin: "0 0 14px",
          letterSpacing: "0.06em",
        }}
      >
        {desc.name_ja}
      </h1>
      <p style={{ fontSize: 14, lineHeight: 2, color: SUB, textAlign: "center", margin: "0 0 8px", whiteSpace: "pre-line" }}>
        {desc.description}
      </p>
      {answers.size === "passing" && (
        <p style={{ fontSize: 13, color: SUB, textAlign: "center", margin: "0 0 8px" }}>{PASSING_NOTE}</p>
      )}

      {note && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.9,
            color: INK,
            margin: "20px 0 0",
            paddingLeft: 14,
            borderLeft: `3px solid ${accent}`,
            whiteSpace: "pre-wrap",
          }}
        >
          「{note}」
        </p>
      )}

      <div style={{ height: 1, background: "#EAE0D8", margin: "28px 0 24px" }} />

      {recent.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <Eyebrow>これまでの天気</Eyebrow>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {recent.map((it) => (
              <li key={it.id} style={chipStyle}>
                {fmtDate(it.created_at)} {getCardWeather(it.weather)?.name_ja ?? ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        style={{
          background: "#FDFAF7",
          border: `1px solid ${accent}55`,
          borderRadius: 16,
          padding: "18px 20px",
          marginBottom: 24,
        }}
      >
        <Eyebrow>今日、ひとつだけ</Eyebrow>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: INK, margin: 0 }}>{todayOne}</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <Eyebrow>今日の天気を残す</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onSaveImage}
            disabled={saving}
            style={{
              ...ghostButtonStyle,
              background: saving ? "#EAE0D8" : "#FDFAF7",
              color: saving ? FAINT : INK,
            }}
          >
            {saving ? "画像を生成中..." : "画像にして持っておく"}
          </button>
          <ShareBar
            title="Kinda note"
            label="今日の天気をシェアする"
            url={shareUrl || undefined}
            shareText={`今日の私は「${desc.name_ja}」でした。 #Kindaふたりへ`}
            onShare={(method) =>
              trackEvent("kinda_note_share", { method, weather_type: weather, route: "daily" })
            }
          />
        </div>
      </section>

      <p style={{ fontSize: 12.5, color: SUB, textAlign: "center", lineHeight: 1.8, margin: "0 0 20px" }}>
        明日また来ると、今日の天気と並べて見られます。
      </p>

      <button onClick={onRestart} style={{ ...ghostButtonStyle, marginBottom: 28 }}>
        もう一度、天気にする
      </button>

      {/* 段階の note（カウンセラーに渡せる整理）への入口。主役は毎日の天気、こちらは控えめに */}
      <Link
        href="/kinda-note/quiz"
        style={{
          display: "block",
          background: "#FDFAF7",
          border: "1px solid #EAE0D8",
          borderRadius: 16,
          padding: "16px 18px",
          textDecoration: "none",
        }}
      >
        <p style={{ fontSize: 13.5, color: INK, margin: "0 0 4px", fontWeight: 500 }}>
          もう少し、じっくり整理する
        </p>
        <p style={{ fontSize: 12, color: SUB, margin: 0, lineHeight: 1.7 }}>
          いまいる場所に合わせた質問で、気持ちを整理します（60秒）。誰かに相談するとき、そのまま渡せます。
        </p>
      </Link>
    </>
  );
}

// ─── 小物 ─────────────────────────────────────────────────────────────────

function MiniHeader({ onBack }: { onBack: () => void }) {
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
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span
        style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: 18,
          fontWeight: 500,
          color: INK,
          letterSpacing: "0.04em",
        }}
      >
        今日の天気
      </span>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, letterSpacing: "0.16em", color: FAINT, margin: "0 0 10px", fontWeight: 500 }}>
      {children}
    </p>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}月${d.getDate()}日`;
}

const headingStyle: React.CSSProperties = {
  fontFamily: "'Shippori Mincho', serif",
  fontSize: 20,
  fontWeight: 500,
  color: INK,
  lineHeight: 1.7,
  margin: "0 0 24px",
};

const ghostButtonStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "1.5px solid #EAE0D8",
  borderRadius: 999,
  padding: "14px",
  fontSize: 14,
  color: SUB,
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  flex: 2,
  background: ACCENT,
  border: "none",
  borderRadius: 999,
  padding: "16px",
  fontSize: 14,
  fontWeight: 500,
  color: "white",
  cursor: "pointer",
  boxShadow: "0 4px 0 #B8806E",
};

const chipStyle: React.CSSProperties = {
  fontSize: 12.5,
  color: "#5A4A3E",
  background: "#FDFAF7",
  border: "1px solid #EAE0D8",
  borderRadius: 999,
  padding: "6px 12px",
  lineHeight: 1.4,
};
