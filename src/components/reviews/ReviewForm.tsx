"use client";

import { useState } from "react";
import type { ReviewToken, ReviewRatings, ReviewDraft } from "@/types/review";

/* ────────────────────────────────────────────────────────────
   評価軸
──────────────────────────────────────────────────────────── */
const RATING_AXES: { key: keyof ReviewRatings; label: string; desc: string }[] = [
  { key: "overall",      label: "総合評価",   desc: "面談全体への満足度" },
  { key: "friendliness", label: "話しやすさ", desc: "緊張せず本音で話せたか" },
  { key: "expertise",    label: "専門知識",   desc: "婚活・お見合いの知識・経験" },
  { key: "proposal",     label: "提案力",     desc: "自分に合ったアドバイスをもらえたか" },
  { key: "support",      label: "サポート",   desc: "面談後のフォローへの期待感" },
];

const AUTHOR_OPTIONS = [
  "20代・女性", "20代・男性",
  "30代・女性", "30代・男性",
  "40代・女性", "40代・男性",
  "50代以上・女性", "50代以上・男性",
];

const MIN_BODY_LENGTH = 50;

/* ────────────────────────────────────────────────────────────
   インタラクティブな星評価コンポーネント
──────────────────────────────────────────────────────────── */
function StarInput({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="transition-transform duration-100 hover:scale-110 focus:outline-none"
          aria-label={`${star}点`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= display ? "var(--accent)" : "none"}
            stroke={star <= display ? "var(--accent)" : "var(--light)"}
            strokeWidth="1.5"
            className="transition-colors duration-100"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-accent ml-1 font-medium">
          {["", "残念", "やや不満", "普通", "良かった", "とても良かった"][value]}
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   バリデーション
──────────────────────────────────────────────────────────── */
interface FormErrors {
  ratings?: string;
  title?: string;
  body?: string;
  authorLabel?: string;
}

function validate(draft: ReviewDraft): FormErrors {
  const errors: FormErrors = {};

  const allRated = Object.values(draft.ratings).every((v) => v > 0);
  if (!allRated) errors.ratings = "すべての項目を評価してください";
  if (!draft.title.trim()) errors.title = "タイトルを入力してください";
  else if (draft.title.length > 60) errors.title = "60文字以内で入力してください";
  if (draft.body.trim().length < MIN_BODY_LENGTH)
    errors.body = `${MIN_BODY_LENGTH}文字以上入力してください（現在${draft.body.trim().length}文字）`;
  if (!draft.authorLabel) errors.authorLabel = "年代・性別を選択してください";

  return errors;
}

/* ────────────────────────────────────────────────────────────
   面談日フォーマット
──────────────────────────────────────────────────────────── */
function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
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
  const [draft, setDraft] = useState<ReviewDraft>({
    token: tokenData.token,
    ratings: { overall: 0, friendliness: 0, expertise: 0, proposal: 0, support: 0 },
    title: "",
    body: "",
    authorLabel: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setRating = (key: keyof ReviewRatings, value: number) => {
    setDraft((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [key]: value },
    }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, ratings: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(draft);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // 最初のエラーまでスクロール
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    // TODO: Supabase reviews テーブルへ INSERT
    // source_type = 'face_to_face'、token を使用済みに更新
    await new Promise((r) => setTimeout(r, 1200));
    onSubmitted();
  };

  const bodyLength = draft.body.trim().length;
  const bodyOk = bodyLength >= MIN_BODY_LENGTH;

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto">
      {/* カウンセラー情報バナー */}
      <div className="flex items-center gap-4 p-5 bg-pale rounded-2xl border border-light mb-8">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base shrink-0"
          style={{ background: "var(--accent)", fontFamily: "var(--font-mincho)" }}
        >
          {tokenData.counselorName.slice(-1)}
        </div>
        <div>
          <p className="text-xs text-muted">{tokenData.agencyName}</p>
          <p className="text-base text-ink" style={{ fontFamily: "var(--font-mincho)" }}>
            {tokenData.counselorName} カウンセラーへの口コミ
          </p>
          <p className="text-xs text-muted mt-0.5">
            面談日：{formatDate(tokenData.meetingDate)}
          </p>
        </div>
      </div>

      {/* ─── 評価セクション ─── */}
      <section className="mb-8">
        <h3
          className="text-base text-ink mb-1"
          style={{ fontFamily: "var(--font-mincho)" }}
        >
          評価
        </h3>
        <p className="text-xs text-muted mb-5">各項目を星で評価してください</p>

        <div
          className={`space-y-5 p-6 rounded-2xl border transition-colors duration-200 ${
            errors.ratings ? "border-rose/40 bg-rose/5" : "border-light bg-white"
          }`}
          data-error={errors.ratings ? "" : undefined}
        >
          {RATING_AXES.map(({ key, label, desc }) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="sm:w-28 shrink-0">
                <p className="text-sm text-ink">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
              <StarInput
                value={draft.ratings[key]}
                onChange={(v) => setRating(key, v)}
                size={key === "overall" ? 32 : 26}
              />
            </div>
          ))}
        </div>

        {errors.ratings && (
          <p className="text-xs text-rose mt-2 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 7.5a.75.75 0 110-1.5.75.75 0 010 1.5zM5.25 4.5h1.5v2.25h-1.5V4.5z" />
            </svg>
            {errors.ratings}
          </p>
        )}
      </section>

      {/* ─── タイトル ─── */}
      <section className="mb-6">
        <label className="block text-sm text-ink mb-1">
          タイトル <span className="text-rose ml-1">*</span>
        </label>
        <p className="text-xs text-muted mb-3">面談の感想を一言で表してください</p>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => {
            setDraft((prev) => ({ ...prev, title: e.target.value }));
            if (submitted) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="例：初めての婚活で不安でしたが、安心して相談できました"
          maxLength={60}
          className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none transition-colors duration-150 bg-white placeholder:text-muted ${
            errors.title ? "border-rose/50 focus:border-rose/70" : "border-light focus:border-accent/60"
          }`}
          data-error={errors.title ? "" : undefined}
        />
        <div className="flex justify-between mt-1">
          {errors.title ? (
            <p className="text-xs text-rose flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 7.5a.75.75 0 110-1.5.75.75 0 010 1.5zM5.25 4.5h1.5v2.25h-1.5V4.5z" />
              </svg>
              {errors.title}
            </p>
          ) : (
            <span />
          )}
          <p className={`text-xs ${draft.title.length > 50 ? "text-rose" : "text-muted"}`}>
            {draft.title.length}/60
          </p>
        </div>
      </section>

      {/* ─── 本文 ─── */}
      <section className="mb-6">
        <label className="block text-sm text-ink mb-1">
          口コミ本文 <span className="text-rose ml-1">*</span>
        </label>
        <p className="text-xs text-muted mb-3">
          実際に面談して感じたことをできるだけ具体的に書いてください
          （{MIN_BODY_LENGTH}文字以上）
        </p>
        <textarea
          value={draft.body}
          onChange={(e) => {
            setDraft((prev) => ({ ...prev, body: e.target.value }));
            if (submitted) setErrors((prev) => ({ ...prev, body: undefined }));
          }}
          rows={7}
          placeholder={`例：面談前は緊張していましたが、${tokenData.counselorName.split(" ")[0]}さんの温かい雰囲気ですぐにリラックスできました。私の話をしっかり聞いてくれて、押しつけがましさが全くなかったのが印象的でした。`}
          className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none transition-colors duration-150 bg-white resize-none placeholder:text-muted leading-relaxed ${
            errors.body ? "border-rose/50 focus:border-rose/70" : "border-light focus:border-accent/60"
          }`}
          data-error={errors.body ? "" : undefined}
        />
        <div className="flex justify-between mt-1">
          {errors.body ? (
            <p className="text-xs text-rose flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 7.5a.75.75 0 110-1.5.75.75 0 010 1.5zM5.25 4.5h1.5v2.25h-1.5V4.5z" />
              </svg>
              {errors.body}
            </p>
          ) : (
            <span />
          )}
          <p className={`text-xs ${bodyOk ? "text-green" : "text-muted"}`}>
            {bodyLength}文字{!bodyOk && ` / あと${MIN_BODY_LENGTH - bodyLength}文字`}
          </p>
        </div>
      </section>

      {/* ─── 年代・性別（匿名表示用） ─── */}
      <section className="mb-8">
        <label className="block text-sm text-ink mb-1">
          年代・性別 <span className="text-rose ml-1">*</span>
        </label>
        <p className="text-xs text-muted mb-3">
          口コミには「30代・女性」のように表示されます（氏名は表示されません）
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-error={errors.authorLabel ? "" : undefined}>
          {AUTHOR_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setDraft((prev) => ({ ...prev, authorLabel: opt }));
                if (submitted) setErrors((prev) => ({ ...prev, authorLabel: undefined }));
              }}
              className={`py-2.5 text-xs rounded-xl border transition-all duration-150 ${
                draft.authorLabel === opt
                  ? "border-accent bg-accent text-white"
                  : "border-light hover:border-accent/40 text-mid"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.authorLabel && (
          <p className="text-xs text-rose mt-2 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 7.5a.75.75 0 110-1.5.75.75 0 010 1.5zM5.25 4.5h1.5v2.25h-1.5V4.5z" />
            </svg>
            {errors.authorLabel}
          </p>
        )}
      </section>

      {/* ─── ガイドライン ─── */}
      <div className="bg-pale rounded-xl p-4 border border-light mb-8 text-xs text-muted leading-relaxed">
        <p className="font-medium text-ink mb-2">口コミ投稿のガイドライン</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>実際の面談体験にもとづいた内容を書いてください</li>
          <li>個人を特定できる情報（氏名・連絡先など）は含めないでください</li>
          <li>誹謗中傷・差別的な表現は禁止です</li>
          <li>投稿後の編集・削除はできません（内容によっては非表示にすることがあります）</li>
        </ul>
      </div>

      {/* ─── 送信ボタン ─── */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{
          boxShadow: submitting ? "none" : "0 6px 24px rgba(200,169,122,0.3)",
        }}
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            投稿中...
          </>
        ) : (
          "口コミを投稿する"
        )}
      </button>

      <p className="text-xs text-muted text-center mt-4">
        投稿後、内容の確認を経て公開されます（通常1〜2営業日）
      </p>
    </form>
  );
}
