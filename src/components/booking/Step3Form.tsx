"use client";

import { useState } from "react";
import type { BookingUserInfo } from "@/types/booking";

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

interface Props {
  userInfo: BookingUserInfo;
  onChange: (info: BookingUserInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

function validate(info: BookingUserInfo): Partial<Record<keyof BookingUserInfo, string>> {
  const errors: Partial<Record<keyof BookingUserInfo, string>> = {};
  if (!info.fullName.trim()) errors.fullName = "お名前を入力してください";
  if (!info.fullNameKana.trim()) errors.fullNameKana = "フリガナを入力してください";
  else if (!/^[ァ-ヶー\s]+$/.test(info.fullNameKana)) errors.fullNameKana = "カタカナで入力してください";
  if (!info.age.trim()) errors.age = "年齢を入力してください";
  else if (!/^\d+$/.test(info.age) || Number(info.age) < 18 || Number(info.age) > 99)
    errors.age = "18〜99の数字で入力してください";
  if (!info.prefecture) errors.prefecture = "居住地を選択してください";
  if (!info.email.trim()) errors.email = "メールアドレスを入力してください";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) errors.email = "正しい形式で入力してください";
  if (!info.meetingFormat) errors.meetingFormat = "面談形式を選択してください";
  return errors;
}

/* ラベルコンポーネント */
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
    <div className="mb-5">
      <label
        className="block text-xs mb-2 tracking-[0.08em]"
        style={{ color: "var(--ink)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "var(--rose)" }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1.5" style={{ color: "var(--rose)" }}>{error}</p>
      )}
    </div>
  );
}

/* 入力フィールド共通スタイル */
const inputBase =
  "w-full py-3.5 px-[18px] rounded-[10px] text-sm outline-none transition-all duration-200 bg-white";
const inputNormal = `${inputBase} border border-[var(--light)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(200,169,122,.1)]`;
const inputError  = `${inputBase} border border-[var(--rose)] focus:border-[var(--rose)]`;

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

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* お名前 / フリガナ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="お名前" required error={errors.fullName}>
          <input
            type="text"
            placeholder="田中 花子"
            value={userInfo.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={errors.fullName ? inputError : inputNormal}
          />
        </Field>
        <Field label="フリガナ" required error={errors.fullNameKana}>
          <input
            type="text"
            placeholder="タナカ ハナコ"
            value={userInfo.fullNameKana}
            onChange={(e) => update("fullNameKana", e.target.value)}
            className={errors.fullNameKana ? inputError : inputNormal}
          />
        </Field>
      </div>

      {/* 年齢 / 居住地 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="年齢" required error={errors.age}>
          <input
            type="number"
            placeholder="32"
            min="18"
            max="99"
            value={userInfo.age}
            onChange={(e) => update("age", e.target.value)}
            className={errors.age ? inputError : inputNormal}
          />
        </Field>
        <Field label="居住地" required error={errors.prefecture}>
          <select
            value={userInfo.prefecture}
            onChange={(e) => update("prefecture", e.target.value)}
            className={`${errors.prefecture ? inputError : inputNormal} appearance-none`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23A0A0A0' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
            }}
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* メールアドレス */}
      <Field label="メールアドレス" required error={errors.email}>
        <input
          type="email"
          placeholder="hanako@example.com"
          value={userInfo.email}
          onChange={(e) => update("email", e.target.value)}
          className={errors.email ? inputError : inputNormal}
        />
        <p className="text-[11px] mt-1.5 leading-[1.7]" style={{ color: "var(--muted)" }}>
          予約確認メールを送ります。
        </p>
      </Field>

      {/* 面談形式 */}
      <Field label="面談形式" required error={errors.meetingFormat}>
        <div className="flex flex-col gap-2.5">
          {(["対面", "オンライン"] as const).map((fmt) => {
            const selected = userInfo.meetingFormat === fmt;
            return (
              <div
                key={fmt}
                onClick={() => update("meetingFormat", fmt)}
                className="flex items-center gap-3 py-3.5 px-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  border: selected
                    ? "1px solid var(--accent)"
                    : "1px solid var(--light)",
                  background: selected ? "rgba(200,169,122,0.08)" : "var(--pale)",
                }}
              >
                <input
                  type="radio"
                  name="meetingFormat"
                  value={fmt}
                  checked={selected}
                  onChange={() => update("meetingFormat", fmt)}
                  className="w-[18px] h-[18px]"
                  style={{ accentColor: "var(--accent)" }}
                />
                <span className="text-[13px]" style={{ color: "var(--ink)" }}>
                  {fmt === "対面" ? "対面（カウンセラーオフィス）" : "オンライン（Zoom）"}
                </span>
              </div>
            );
          })}
        </div>
      </Field>

      {/* 事前に伝えたいこと */}
      <Field label="事前に伝えたいこと">
        <textarea
          rows={4}
          placeholder="任意。事前に伝えることで、より充実した面談になります。"
          value={userInfo.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${inputNormal} resize-y min-h-[100px] leading-[1.8]`}
        />
      </Field>

      {/* ナビボタン */}
      <div className="pt-4 pb-8 space-y-3">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 py-5 rounded-full text-[15px] tracking-widest text-white transition-all duration-200 hover:opacity-90"
          style={{
            background: "var(--accent)",
            boxShadow: "0 6px 28px rgba(200,169,122,0.4)",
          }}
        >
          内容を確認する
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm transition-colors duration-200"
            style={{ color: "var(--muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            戻る
          </button>
        </div>
      </div>
    </form>
  );
}
