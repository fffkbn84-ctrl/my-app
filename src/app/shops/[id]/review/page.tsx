"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { placesHomeData } from "@/lib/mock/places-home";

/* ────────────────────────────────────────────────────────────
   定数
──────────────────────────────────────────────────────────── */
const SITUATION_OPTIONS = [
  "初デート", "2回目以降のデート", "お見合い",
  "婚活仲間との食事", "記念日", "その他",
];

const AUTHOR_OPTIONS = [
  "20代・女性", "20代・男性",
  "30代・女性", "30代・男性",
  "40代・女性", "40代・男性",
  "50代以上・女性", "50代以上・男性",
];

const MIN_BODY = 30;

/* ────────────────────────────────────────────────────────────
   星評価
──────────────────────────────────────────────────────────── */
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div className="flex items-center gap-1.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="transition-transform hover:scale-110"
        >
          <svg width="32" height="32" viewBox="0 0 24 24"
            fill={star <= display ? "var(--accent)" : "none"}
            stroke={star <= display ? "var(--accent)" : "var(--light)"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-accent ml-1">
          {["", "残念", "やや不満", "普通", "良かった", "とても良かった"][value]}
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   バリデーション
──────────────────────────────────────────────────────────── */
interface FormData {
  rating: number;
  situation: string;
  title: string;
  body: string;
  authorLabel: string;
}

interface Errors {
  rating?: string;
  situation?: string;
  title?: string;
  body?: string;
  authorLabel?: string;
}

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.rating) errors.rating = "評価を選択してください";
  if (!data.situation) errors.situation = "利用シーンを選択してください";
  if (!data.title.trim()) errors.title = "タイトルを入力してください";
  else if (data.title.length > 60) errors.title = "60文字以内で入力してください";
  if (data.body.trim().length < MIN_BODY)
    errors.body = `${MIN_BODY}文字以上入力してください（現在${data.body.trim().length}文字）`;
  if (!data.authorLabel) errors.authorLabel = "年代・性別を選択してください";
  return errors;
}

/* ────────────────────────────────────────────────────────────
   ページ
──────────────────────────────────────────────────────────── */
export default function ShopReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const shop = placesHomeData.find((s) => s.id === id);
  if (!shop) notFound();

  const [data, setData] = useState<FormData>({
    rating: 0, situation: "", title: "", body: "", authorLabel: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    const next = { ...data, [key]: value };
    setData(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    // TODO: Supabase reviews テーブルへ INSERT（source_type='shop'）
    await new Promise((r) => setTimeout(r, 1200));
    setDone(true);
  };

  const bodyLen = data.body.trim().length;
  const bodyOk  = bodyLen >= MIN_BODY;

  /* 完了画面 */
  if (done) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen bg-white">
          <div className="max-w-lg mx-auto px-6 py-20 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M6 16l7 7 13-13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl text-ink mb-3" style={{ fontFamily: "var(--font-mincho)" }}>
              口コミを投稿しました
            </h2>
            <p className="text-sm text-mid leading-relaxed mb-10">
              {shop.name} への口コミをありがとうございます。<br />
              内容確認後、1〜2営業日以内に公開されます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/shops/${id}`}
                className="px-6 py-3 border border-light text-mid rounded-full text-sm hover:border-ink hover:text-ink transition-all duration-200">
                お店のページへ戻る
              </Link>
              <Link href="/shops"
                className="px-6 py-3 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity duration-200">
                他のお店を見る
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const inputOk  = "w-full px-4 py-3 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/60 bg-white placeholder:text-muted transition-colors duration-150";
  const inputErr = "w-full px-4 py-3 text-sm border border-rose/50 rounded-xl focus:outline-none focus:border-rose/70 bg-white placeholder:text-muted transition-colors duration-150";

  return (
    <>
      <Header />

      <main className="pt-16 min-h-screen bg-white">
        <SectionSubHeader sectionName={shop.name} sectionRoot={`/shops/${id}`} />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda act", href: "/kinda-act" },
            { label: "お店一覧", href: "/shops" },
            { label: shop.name, href: `/shops/${id}` },
            { label: "口コミ投稿" },
          ]}
        />
        <div className="border-b border-light bg-pale">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <p className="text-xs tracking-[0.2em] text-accent uppercase mb-1">Review</p>
            <h1 className="text-xl text-ink" style={{ fontFamily: "var(--font-mincho)" }}>
              口コミを投稿する
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10 md:py-14">
          <form onSubmit={handleSubmit} noValidate>

            {/* お店情報バナー */}
            <div className="flex items-center gap-3 p-4 bg-pale rounded-2xl border border-light mb-8">
              <div className="w-10 h-10 rounded-xl bg-white border border-light flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l19-9-9 19-2-8-8-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted">{shop.location} · {shop.categoryLabel}</p>
                <p className="text-base text-ink" style={{ fontFamily: "var(--font-mincho)" }}>
                  {shop.name}
                </p>
              </div>
              <Link href={`/shops/${id}`} className="ml-auto text-xs text-muted hover:text-ink transition-colors">
                ← 戻る
              </Link>
            </div>

            {/* 総合評価 */}
            <section className="mb-8">
              <h3 className="text-sm text-ink mb-1">総合評価 <span className="text-rose ml-1">*</span></h3>
              <p className="text-xs text-muted mb-4">婚活・デートシーンでの満足度を星で評価してください</p>
              <div
                className={`p-5 rounded-2xl border ${errors.rating ? "border-rose/40 bg-rose/5" : "border-light bg-white"}`}
                data-error={errors.rating ? "" : undefined}
              >
                <StarInput value={data.rating} onChange={(v) => update("rating", v)} />
              </div>
              {errors.rating && <p className="text-xs text-rose mt-1.5">{errors.rating}</p>}
            </section>

            {/* 利用シーン */}
            <section className="mb-6">
              <h3 className="text-sm text-ink mb-1">利用シーン <span className="text-rose ml-1">*</span></h3>
              <p className="text-xs text-muted mb-3">どのようなシーンで利用しましたか？</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-error={errors.situation ? "" : undefined}>
                {SITUATION_OPTIONS.map((opt) => (
                  <button key={opt} type="button"
                    onClick={() => update("situation", opt)}
                    className={`py-2.5 text-xs rounded-xl border transition-all duration-150 ${
                      data.situation === opt
                        ? "border-accent bg-accent text-white"
                        : "border-light hover:border-accent/40 text-mid"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.situation && <p className="text-xs text-rose mt-1.5">{errors.situation}</p>}
            </section>

            {/* タイトル */}
            <section className="mb-6">
              <label className="block text-sm text-ink mb-1">
                タイトル <span className="text-rose ml-1">*</span>
              </label>
              <p className="text-xs text-muted mb-3">一言で感想を表してください</p>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="例：お見合いに最適な個室あり！雰囲気も最高でした"
                maxLength={60}
                className={errors.title ? inputErr : inputOk}
                data-error={errors.title ? "" : undefined}
              />
              <div className="flex justify-between mt-1">
                {errors.title ? <p className="text-xs text-rose">{errors.title}</p> : <span />}
                <p className={`text-xs ${data.title.length > 50 ? "text-rose" : "text-muted"}`}>
                  {data.title.length}/60
                </p>
              </div>
            </section>

            {/* 本文 */}
            <section className="mb-6">
              <label className="block text-sm text-ink mb-1">
                口コミ本文 <span className="text-rose ml-1">*</span>
              </label>
              <p className="text-xs text-muted mb-3">実際の体験を具体的に書いてください（{MIN_BODY}文字以上）</p>
              <textarea
                value={data.body}
                onChange={(e) => update("body", e.target.value)}
                rows={6}
                placeholder="個室の広さ、スタッフの対応、料理の内容、婚活シーンでの使いやすさなど、具体的に書いていただけると参考になります。"
                className={`${errors.body ? inputErr : inputOk} resize-none leading-relaxed`}
                data-error={errors.body ? "" : undefined}
              />
              <div className="flex justify-between mt-1">
                {errors.body ? <p className="text-xs text-rose">{errors.body}</p> : <span />}
                <p className={`text-xs ${bodyOk ? "text-green" : "text-muted"}`}>
                  {bodyLen}文字{!bodyOk && ` / あと${MIN_BODY - bodyLen}文字`}
                </p>
              </div>
            </section>

            {/* 年代・性別 */}
            <section className="mb-8">
              <label className="block text-sm text-ink mb-1">
                年代・性別 <span className="text-rose ml-1">*</span>
              </label>
              <p className="text-xs text-muted mb-3">「30代・女性」のように表示されます</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-error={errors.authorLabel ? "" : undefined}>
                {AUTHOR_OPTIONS.map((opt) => (
                  <button key={opt} type="button"
                    onClick={() => update("authorLabel", opt)}
                    className={`py-2.5 text-xs rounded-xl border transition-all duration-150 ${
                      data.authorLabel === opt
                        ? "border-accent bg-accent text-white"
                        : "border-light hover:border-accent/40 text-mid"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.authorLabel && <p className="text-xs text-rose mt-1.5">{errors.authorLabel}</p>}
            </section>

            {/* ガイドライン */}
            <div className="bg-pale rounded-xl p-4 border border-light mb-8 text-xs text-muted leading-relaxed">
              <p className="font-medium text-ink mb-1.5">投稿ガイドライン</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>実際の利用体験にもとづいた内容を書いてください</li>
                <li>個人を特定できる情報は含めないでください</li>
                <li>誹謗中傷・差別的な表現は禁止です</li>
              </ul>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ boxShadow: submitting ? "none" : "0 6px 24px rgba(200,169,122,0.3)" }}
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
        </div>
      </main>
    </>
  );
}
