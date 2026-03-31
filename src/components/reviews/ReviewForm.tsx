"use client";

import { useState, Fragment } from "react";
import type { ReviewToken, ReviewCategoryRatings } from "@/types/review";

/* ────────────────────────────────────────────────────────────
   定数
──────────────────────────────────────────────────────────── */
const CATEGORY_ITEMS: { key: keyof ReviewCategoryRatings; label: string }[] = [
  { key: "friendliness",  label: "話しやすさ" },
  { key: "noPressure",    label: "押しつけのなさ" },
  { key: "adviceQuality", label: "提案・アドバイスの質" },
  { key: "wouldReturn",   label: "また相談したいか" },
];

const GOOD_TAGS = [
  "話しやすかった",
  "急かされなかった",
  "アドバイスが具体的",
  "自分のペースを尊重してくれた",
  "知識が豊富",
  "的確なマッチング",
  "レスポンスが早い",
  "条件整理を手伝ってくれた",
];

const AFTER_STATUS_OPTIONS = [
  "入会した",
  "入会を検討中",
  "他の相談所も検討することにした",
  "入会しなかった（理由は本文に）",
];

const AGE_OPTIONS = ["非公開", "20代", "30代", "40代", "50代以上"];

const MIN_BODY = 50;

/* ────────────────────────────────────────────────────────────
   ヘルパー
──────────────────────────────────────────────────────────── */
function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/* ────────────────────────────────────────────────────────────
   SVGスター（カテゴリ評価用）
──────────────────────────────────────────────────────────── */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "var(--accent)" : "none"}
      stroke={filled ? "var(--accent)" : "var(--light)"}
      strokeWidth="1.5"
      style={{ transition: "fill .2s, stroke .2s" }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   セクションタイトル
──────────────────────────────────────────────────────────── */
function SectionTitle({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "var(--accent)",
          whiteSpace: "nowrap" as const,
        }}
      >
        {children}
        {required && (
          <span style={{ color: "var(--rose)", marginLeft: 4 }}>*</span>
        )}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: "var(--adim)",
          display: "block",
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ReviewForm
──────────────────────────────────────────────────────────── */
export default function ReviewForm({
  tokenData,
  onSubmitted,
}: {
  tokenData: ReviewToken;
  onSubmitted: () => void;
}) {
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<ReviewCategoryRatings>({
    friendliness: 0,
    noPressure: 0,
    adviceQuality: 0,
    wouldReturn: 0,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [afterStatus, setAfterStatus] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [occupation, setOccupation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bodyLength = body.trim().length;
  const isValid = overallRating > 0 && bodyLength >= MIN_BODY;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const setCatRating = (key: keyof ReviewCategoryRatings, val: number) => {
    setCategoryRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    // TODO: Supabase reviews テーブルへ INSERT
    await new Promise((r) => setTimeout(r, 1000));
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ──────────────────────────────────────────────
          カウンセラー情報カード
      ────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 24px",
          background: "white",
          border: "1px solid var(--pale)",
          borderRadius: 16,
          marginBottom: 36,
        }}
      >
        {/* アバター */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#F5E8D8,#EDD8C0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="11" r="6" fill="#C8A97A" opacity=".6" />
            <path
              d="M4 30c0-6.627 5.373-12 12-12s12 5.373 12 12"
              stroke="#C8A97A"
              strokeWidth="1.4"
              fill="none"
              opacity=".4"
            />
          </svg>
        </div>

        {/* 情報 */}
        <div>
          <p
            style={{
              fontWeight: 400,
              fontSize: 16,
              color: "var(--black)",
              fontFamily: "var(--font-mincho)",
            }}
          >
            {tokenData.counselorName} カウンセラー
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
            {tokenData.agencyName}
          </p>
          <span
            style={{
              fontSize: 11,
              color: "var(--accent)",
              background: "var(--adim)",
              padding: "3px 10px",
              borderRadius: 20,
              marginTop: 6,
              display: "inline-block",
            }}
          >
            面談日：{formatDate(tokenData.meetingDate)}
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ① 総合評価（CSS-only 星）
          DOM順序: input5,label5,input4,label4,...,input1,label1
          flex-direction:row-reverse で視覚上 1→2→3→4→5 に並ぶ
          input:checked ~ label で選択した星以降（DOM後方＝視覚上左）を塗りつぶす
      ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <label
          style={{
            fontSize: 13,
            color: "var(--ink)",
            marginBottom: 14,
            display: "block",
          }}
        >
          総合評価
          <span style={{ color: "var(--rose)", marginLeft: 4 }}>*</span>
        </label>

        <div className="star-input">
          {[5, 4, 3, 2, 1].map((star) => (
            <Fragment key={star}>
              <input
                type="radio"
                id={`overall-star-${star}`}
                name="overall-rating"
                value={star}
                onChange={() => setOverallRating(star)}
              />
              <label htmlFor={`overall-star-${star}`} title={`${star}点`}>
                ★
              </label>
            </Fragment>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ② 項目別評価
      ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <label
          style={{
            fontSize: 13,
            color: "var(--ink)",
            marginBottom: 16,
            display: "block",
          }}
        >
          項目別評価
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CATEGORY_ITEMS.map(({ key, label }) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ink)" }}>{label}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCatRating(key, star)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label={`${label} ${star}点`}
                  >
                    <StarIcon filled={star <= categoryRatings[key]} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ③ よかった点タグ
      ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <SectionTitle>よかった点</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {GOOD_TAGS.map((tag) => {
            const on = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "8px 16px",
                  border: `1px solid ${on ? "var(--accent)" : "var(--light)"}`,
                  borderRadius: 20,
                  fontSize: 12,
                  color: on ? "var(--accent)" : "var(--mid)",
                  background: on ? "var(--adim)" : "transparent",
                  cursor: "pointer",
                  transition: "all .25s",
                  userSelect: "none",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ④ 面談の感想（本文）
      ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <SectionTitle required>面談の感想</SectionTitle>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="面談を受けてみての正直な感想を教えてください。カウンセラーの印象、話しやすさ、アドバイスの内容など、次に来る方の参考になる情報を書いていただけると助かります。"
          style={{
            width: "100%",
            minHeight: 140,
            padding: "14px 16px",
            fontSize: 14,
            border: "1px solid var(--light)",
            borderRadius: 12,
            outline: "none",
            resize: "vertical",
            lineHeight: 1.8,
            color: "var(--ink)",
            background: "white",
            fontFamily: "var(--font-sans)",
            transition: "border-color .15s",
            boxSizing: "border-box",
          }}
          onFocus={(e) =>
            ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
              "rgba(200,169,122,.6)")
          }
          onBlur={(e) =>
            ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
              "var(--light)")
          }
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <p style={{ fontSize: 11, color: "var(--muted)" }}>
            最低50文字以上。個人を特定する情報は含めないでください。
          </p>
          <p
            style={{
              fontSize: 11,
              color:
                bodyLength >= MIN_BODY
                  ? "var(--green)"
                  : bodyLength > 0
                  ? "var(--muted)"
                  : "var(--muted)",
              whiteSpace: "nowrap",
              marginLeft: 8,
            }}
          >
            {bodyLength}
            {bodyLength < MIN_BODY && bodyLength > 0
              ? ` / あと${MIN_BODY - bodyLength}文字`
              : "文字"}
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ⑤ 面談後の状況
      ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <SectionTitle>面談後の状況</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AFTER_STATUS_OPTIONS.map((opt) => (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                fontSize: 14,
                color: "var(--ink)",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `1.5px solid ${
                    afterStatus === opt ? "var(--accent)" : "var(--light)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "border-color .2s",
                  background:
                    afterStatus === opt ? "var(--adim)" : "transparent",
                }}
              >
                {afterStatus === opt && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "block",
                    }}
                  />
                )}
              </span>
              <input
                type="radio"
                name="after-status"
                value={opt}
                checked={afterStatus === opt}
                onChange={() => setAfterStatus(opt)}
                style={{ display: "none" }}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ⑥ 投稿者情報（任意・匿名）
      ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <SectionTitle>投稿者情報（任意・匿名表示）</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
          className="author-row"
        >
          <style>{`
            @media (max-width: 480px) {
              .author-row { grid-template-columns: 1fr !important; }
            }
          `}</style>
          {/* 年代 */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--mid)",
                marginBottom: 6,
              }}
            >
              年代
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 13,
                border: "1px solid var(--light)",
                borderRadius: 10,
                outline: "none",
                background: "white",
                color: ageGroup ? "var(--ink)" : "var(--muted)",
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                appearance: "auto",
              }}
            >
              <option value="">選択</option>
              {AGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 職業 */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--mid)",
                marginBottom: 6,
              }}
            >
              職業
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="会社員（IT）など"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 13,
                border: "1px solid var(--light)",
                borderRadius: 10,
                outline: "none",
                background: "white",
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "rgba(200,169,122,.6)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "var(--light)")
              }
            />
          </div>
        </div>
        <p
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          名前は表示されません。「30代・会社員（IT）」のような形で表示されます。
        </p>
      </div>

      {/* ──────────────────────────────────────────────
          プライバシーノート
      ────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 20px",
          background: "var(--pale)",
          borderRadius: 10,
          fontSize: 11,
          color: "var(--muted)",
          lineHeight: 1.9,
          display: "flex",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span style={{ flexShrink: 0, marginTop: 1 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle
              cx="9"
              cy="9"
              r="7.5"
              stroke="#A0A0A0"
              strokeWidth="1.2"
            />
            <path
              d="M9 8v5M9 6v.5"
              stroke="#A0A0A0"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span>
          投稿した口コミは運営が確認後、通常1〜3営業日以内に公開されます。
          相談所側からの閲覧は可能ですが、削除依頼は受け付けていません。
          ご本人からの修正・削除申請のみ対応します。
        </span>
      </div>

      {/* ──────────────────────────────────────────────
          投稿ボタン
      ────────────────────────────────────────────── */}
      <div style={{ padding: "28px 0" }}>
        <button
          type="submit"
          disabled={!isValid || submitting}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: "var(--accent)",
            color: "white",
            fontSize: 15,
            border: "none",
            borderRadius: 50,
            cursor: isValid && !submitting ? "pointer" : "not-allowed",
            opacity: isValid && !submitting ? 1 : 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity .2s, box-shadow .2s",
            boxShadow:
              isValid && !submitting
                ? "0 6px 24px rgba(200,169,122,.3)"
                : "none",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.02em",
          }}
          onMouseOver={(e) => {
            if (isValid && !submitting)
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
          }}
          onMouseOut={(e) => {
            if (isValid && !submitting)
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
        >
          {submitting ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,.3)",
                  borderTopColor: "white",
                  display: "inline-block",
                  animation: "spin .7s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              投稿中…
            </>
          ) : (
            <>
              口コミを投稿する
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
