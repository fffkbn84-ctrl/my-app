"use client";

import { useState } from "react";
import type { BookingUserInfo } from "@/types/booking";

/* ────────────────────────────────────────────────────────────
   Props
──────────────────────────────────────────────────────────── */
interface Props {
  userInfo: BookingUserInfo;
  onChange: (info: BookingUserInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

/* ────────────────────────────────────────────────────────────
   バリデーション
──────────────────────────────────────────────────────────── */
function validate(info: BookingUserInfo): Partial<Record<keyof BookingUserInfo, string>> {
  const errors: Partial<Record<keyof BookingUserInfo, string>> = {};

  if (!info.lastName.trim()) errors.lastName = "姓を入力してください";
  if (!info.firstName.trim()) errors.firstName = "名を入力してください";
  if (!info.lastNameKana.trim()) errors.lastNameKana = "姓（フリガナ）を入力してください";
  else if (!/^[ァ-ヶー]+$/.test(info.lastNameKana)) errors.lastNameKana = "カタカナで入力してください";
  if (!info.firstNameKana.trim()) errors.firstNameKana = "名（フリガナ）を入力してください";
  else if (!/^[ァ-ヶー]+$/.test(info.firstNameKana)) errors.firstNameKana = "カタカナで入力してください";
  if (!info.email.trim()) errors.email = "メールアドレスを入力してください";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) errors.email = "正しい形式で入力してください";
  if (!info.phone.trim()) errors.phone = "電話番号を入力してください";
  else if (!/^[\d\-+() ]+$/.test(info.phone)) errors.phone = "正しい形式で入力してください";
  if (!info.birthYear || !info.birthMonth || !info.birthDay) errors.birthYear = "生年月日を入力してください";
  if (!info.gender) errors.gender = "性別を選択してください";

  return errors;
}

/* ────────────────────────────────────────────────────────────
   フィールドコンポーネント
──────────────────────────────────────────────────────────── */
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-mid mb-1.5">
        {label}
        {required && <span className="text-rose ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/60 bg-white placeholder:text-muted transition-colors duration-150";

const inputErrorClass =
  "w-full px-4 py-3 text-sm border border-rose/50 rounded-xl focus:outline-none focus:border-rose/70 bg-white placeholder:text-muted transition-colors duration-150";

/* ────────────────────────────────────────────────────────────
   Step3Form
──────────────────────────────────────────────────────────── */
export default function Step3Form({ userInfo, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof BookingUserInfo, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof BookingUserInfo, value: string) => {
    const next = { ...userInfo, [field]: value };
    onChange(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(userInfo);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  };

  const years = Array.from({ length: 60 }, (_, i) => String(new Date().getFullYear() - 20 - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        時間帯を変更する
      </button>

      <h2
        className="text-xl md:text-2xl text-ink mb-1"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        ご利用者情報を入力してください
      </h2>
      <p className="text-sm text-muted mb-8">
        入力いただいた情報はカウンセラーへの連絡に使用します
      </p>

      <div className="space-y-5">
        {/* 氏名 */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="姓" required error={errors.lastName}>
            <input
              type="text"
              placeholder="山田"
              value={userInfo.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={errors.lastName ? inputErrorClass : inputClass}
            />
          </Field>
          <Field label="名" required error={errors.firstName}>
            <input
              type="text"
              placeholder="花子"
              value={userInfo.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={errors.firstName ? inputErrorClass : inputClass}
            />
          </Field>
        </div>

        {/* フリガナ */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="姓（フリガナ）" required error={errors.lastNameKana}>
            <input
              type="text"
              placeholder="ヤマダ"
              value={userInfo.lastNameKana}
              onChange={(e) => update("lastNameKana", e.target.value)}
              className={errors.lastNameKana ? inputErrorClass : inputClass}
            />
          </Field>
          <Field label="名（フリガナ）" required error={errors.firstNameKana}>
            <input
              type="text"
              placeholder="ハナコ"
              value={userInfo.firstNameKana}
              onChange={(e) => update("firstNameKana", e.target.value)}
              className={errors.firstNameKana ? inputErrorClass : inputClass}
            />
          </Field>
        </div>

        {/* メール */}
        <Field label="メールアドレス" required error={errors.email}>
          <input
            type="email"
            placeholder="hanako@example.com"
            value={userInfo.email}
            onChange={(e) => update("email", e.target.value)}
            className={errors.email ? inputErrorClass : inputClass}
          />
        </Field>

        {/* 電話 */}
        <Field label="電話番号" required error={errors.phone}>
          <input
            type="tel"
            placeholder="090-1234-5678"
            value={userInfo.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={errors.phone ? inputErrorClass : inputClass}
          />
        </Field>

        {/* 生年月日 */}
        <Field label="生年月日" required error={errors.birthYear}>
          <div className="flex items-center gap-2">
            <select
              value={userInfo.birthYear}
              onChange={(e) => update("birthYear", e.target.value)}
              className={`flex-1 px-3 py-3 text-sm border rounded-xl focus:outline-none focus:border-accent/60 bg-white transition-colors duration-150 ${
                errors.birthYear ? "border-rose/50" : "border-light"
              }`}
            >
              <option value="">年</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
              value={userInfo.birthMonth}
              onChange={(e) => update("birthMonth", e.target.value)}
              className="w-20 px-3 py-3 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/60 bg-white"
            >
              <option value="">月</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={userInfo.birthDay}
              onChange={(e) => update("birthDay", e.target.value)}
              className="w-20 px-3 py-3 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/60 bg-white"
            >
              <option value="">日</option>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </Field>

        {/* 性別 */}
        <Field label="性別" required error={errors.gender}>
          <div className="flex gap-3">
            {(["female", "male"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update("gender", g)}
                className={`flex-1 py-3 text-sm rounded-xl border transition-all duration-150 ${
                  userInfo.gender === g
                    ? "border-accent bg-accent text-white"
                    : "border-light hover:border-accent/40 text-mid"
                }`}
              >
                {g === "female" ? "女性" : "男性"}
              </button>
            ))}
          </div>
        </Field>

        {/* 質問・メモ（任意） */}
        <Field label="カウンセラーへの質問・相談内容（任意）">
          <textarea
            rows={4}
            placeholder="事前に相談したいことがあればご記入ください（任意）"
            value={userInfo.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* プライバシーポリシー */}
      <p className="text-xs text-muted mt-6 leading-relaxed">
        「次へ進む」をクリックすることで、
        <a href="/privacy" className="underline hover:text-ink">プライバシーポリシー</a>
        および
        <a href="/terms" className="underline hover:text-ink">利用規約</a>
        に同意したものとみなされます。
      </p>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 border border-light text-mid rounded-xl text-sm hover:border-ink hover:text-ink transition-all duration-200"
        >
          戻る
        </button>
        <button
          type="submit"
          className="flex-[2] py-3.5 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-opacity duration-200"
          style={{ boxShadow: "0 4px 16px rgba(200,169,122,0.3)" }}
        >
          確認画面へ
        </button>
      </div>
    </form>
  );
}
