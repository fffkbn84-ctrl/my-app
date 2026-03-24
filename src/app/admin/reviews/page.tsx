"use client";

import { useState } from "react";
import { adminReviews, AdminReview } from "@/lib/mock/admin";

type ProxyFormData = {
  counselorName: string;
  agencyName: string;
  rating: number;
  body: string;
};

const initialForm: ProxyFormData = {
  counselorName: "",
  agencyName: "",
  rating: 5,
  body: "",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>(adminReviews);
  const [form, setForm] = useState<ProxyFormData>(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [filterSource, setFilterSource] = useState<"all" | "face_to_face" | "proxy">("all");

  const filtered =
    filterSource === "all"
      ? reviews
      : reviews.filter((r) => r.sourceType === filterSource);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newReview: AdminReview = {
      id: `r${Date.now()}`,
      counselorName: form.counselorName,
      agencyName: form.agencyName,
      rating: form.rating,
      body: form.body,
      sourceType: "proxy",
      userName: null,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setReviews([newReview, ...reviews]);
    setForm(initialForm);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* ページヘッダー */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-2">
            Reviews
          </p>
          <h1
            className="text-2xl text-ink"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            口コミ管理
          </h1>
          <p className="text-sm text-mid mt-1">{reviews.length} 件</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm rounded transition-colors"
          style={{
            background: "var(--accent)",
            color: "var(--white)",
          }}
        >
          + 代理掲載を追加
        </button>
      </div>

      {/* 成功メッセージ */}
      {submitted && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-sm"
          style={{
            background: "rgba(122,158,135,0.15)",
            color: "var(--green)",
            border: "1px solid rgba(122,158,135,0.3)",
          }}
        >
          代理掲載口コミを登録しました。
        </div>
      )}

      {/* 代理入力フォーム */}
      {showForm && (
        <div
          className="mb-8 rounded-lg border border-light bg-white p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <h2
              className="text-base text-ink"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              代理掲載フォーム
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{ color: "var(--muted)", borderColor: "var(--light)" }}
            >
              景表法対応 — 「代理掲載」バッジが自動付与されます
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-mid mb-1.5">
                  カウンセラー名 <span style={{ color: "var(--rose)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.counselorName}
                  onChange={(e) =>
                    setForm({ ...form, counselorName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded border border-light bg-pale focus:outline-none"
                  style={{ color: "var(--ink)" }}
                  placeholder="例: 田中 美咲"
                />
              </div>
              <div>
                <label className="block text-xs text-mid mb-1.5">
                  相談所名 <span style={{ color: "var(--rose)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.agencyName}
                  onChange={(e) =>
                    setForm({ ...form, agencyName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded border border-light bg-pale focus:outline-none"
                  style={{ color: "var(--ink)" }}
                  placeholder="例: ハーモニー結婚相談所"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-mid mb-1.5">
                評価 <span style={{ color: "var(--rose)" }}>*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    className="w-9 h-9 rounded text-sm transition-colors"
                    style={{
                      background:
                        form.rating >= n
                          ? "rgba(200,169,122,0.2)"
                          : "var(--pale)",
                      color:
                        form.rating >= n ? "var(--accent)" : "var(--muted)",
                      border: `1px solid ${form.rating >= n ? "var(--accent)" : "var(--light)"}`,
                    }}
                  >
                    {n}
                  </button>
                ))}
                <span className="self-center text-sm text-mid ml-1">
                  / 5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-mid mb-1.5">
                口コミ本文 <span style={{ color: "var(--rose)" }}>*</span>
              </label>
              <textarea
                required
                rows={4}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded border border-light bg-pale focus:outline-none resize-none"
                style={{ color: "var(--ink)" }}
                placeholder="口コミ内容を入力してください..."
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                className="px-5 py-2 text-sm rounded transition-opacity hover:opacity-80"
                style={{
                  background: "var(--accent)",
                  color: "var(--white)",
                }}
              >
                登録する
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                }}
                className="px-5 py-2 text-sm rounded border border-light text-mid hover:border-mid transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* フィルター */}
      <div className="flex gap-2 mb-5">
        {(
          [
            { value: "all", label: "すべて" },
            { value: "face_to_face", label: "面談口コミ" },
            { value: "proxy", label: "代理掲載" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterSource(opt.value)}
            className="px-3 py-1.5 text-xs rounded-full transition-colors border"
            style={{
              background:
                filterSource === opt.value ? "var(--ink)" : "var(--white)",
              color:
                filterSource === opt.value ? "var(--white)" : "var(--mid)",
              borderColor:
                filterSource === opt.value ? "var(--ink)" : "var(--light)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 口コミ一覧 */}
      <div className="space-y-3">
        {filtered.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-light p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  {review.counselorName}
                </p>
                <p className="text-xs text-mid">{review.agencyName}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {review.sourceType === "proxy" && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{
                      color: "var(--muted)",
                      borderColor: "var(--light)",
                    }}
                  >
                    代理掲載
                  </span>
                )}
                {review.sourceType === "face_to_face" && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(200,169,122,0.12)",
                      color: "var(--accent)",
                    }}
                  >
                    面談口コミ
                  </span>
                )}
                <span
                  className="text-sm"
                  style={{ color: "var(--accent)" }}
                >
                  {"★".repeat(review.rating)}
                  <span style={{ color: "var(--light)" }}>
                    {"★".repeat(5 - review.rating)}
                  </span>
                </span>
              </div>
            </div>
            <p className="text-sm text-mid leading-relaxed mb-3">
              {review.body}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">
                {review.userName ?? "匿名"} · {review.createdAt}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-mid py-8 text-center">
            口コミがありません
          </p>
        )}
      </div>
    </div>
  );
}
