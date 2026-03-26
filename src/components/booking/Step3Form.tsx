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

  const errStyle = { borderColor: "var(--rose)" };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* お名前 / フリガナ */}
      <div className="bk-form-row">
        <div className="bk-form-group">
          <label className="bk-form-label">お名前<span>*</span></label>
          <input
            type="text"
            placeholder="田中 花子"
            value={userInfo.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="bk-form-input"
            style={errors.fullName ? errStyle : undefined}
          />
          {errors.fullName && <p className="bk-form-hint" style={{ color: "var(--rose)" }}>{errors.fullName}</p>}
        </div>
        <div className="bk-form-group">
          <label className="bk-form-label">フリガナ<span>*</span></label>
          <input
            type="text"
            placeholder="タナカ ハナコ"
            value={userInfo.fullNameKana}
            onChange={(e) => update("fullNameKana", e.target.value)}
            className="bk-form-input"
            style={errors.fullNameKana ? errStyle : undefined}
          />
          {errors.fullNameKana && <p className="bk-form-hint" style={{ color: "var(--rose)" }}>{errors.fullNameKana}</p>}
        </div>
      </div>

      {/* 年齢 / 居住地 */}
      <div className="bk-form-row">
        <div className="bk-form-group">
          <label className="bk-form-label">年齢<span>*</span></label>
          <input
            type="number"
            placeholder="32"
            min="18"
            max="99"
            value={userInfo.age}
            onChange={(e) => update("age", e.target.value)}
            className="bk-form-input"
            style={errors.age ? errStyle : undefined}
          />
          {errors.age && <p className="bk-form-hint" style={{ color: "var(--rose)" }}>{errors.age}</p>}
        </div>
        <div className="bk-form-group">
          <label className="bk-form-label">居住地<span>*</span></label>
          <select
            value={userInfo.prefecture}
            onChange={(e) => update("prefecture", e.target.value)}
            className="bk-form-select"
            style={{
              ...(errors.prefecture ? errStyle : {}),
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
          {errors.prefecture && <p className="bk-form-hint" style={{ color: "var(--rose)" }}>{errors.prefecture}</p>}
        </div>
      </div>

      {/* メールアドレス */}
      <div className="bk-form-group">
        <label className="bk-form-label">メールアドレス<span>*</span></label>
        <input
          type="email"
          placeholder="hanako@example.com"
          value={userInfo.email}
          onChange={(e) => update("email", e.target.value)}
          className="bk-form-input"
          style={errors.email ? errStyle : undefined}
        />
        {errors.email
          ? <p className="bk-form-hint" style={{ color: "var(--rose)" }}>{errors.email}</p>
          : <p className="bk-form-hint">予約確認メールを送ります。</p>
        }
      </div>

      {/* 面談形式 */}
      <div className="bk-form-group">
        <label className="bk-form-label">面談形式<span>*</span></label>
        <div className="bk-form-radio-group">
          {(["対面", "オンライン"] as const).map((fmt) => {
            const selected = userInfo.meetingFormat === fmt;
            return (
              <div
                key={fmt}
                onClick={() => update("meetingFormat", fmt)}
                className={`bk-form-radio${selected ? " selected" : ""}`}
              >
                <input
                  type="radio"
                  name="meetingFormat"
                  value={fmt}
                  checked={selected}
                  onChange={() => update("meetingFormat", fmt)}
                />
                <span className="bk-form-radio-label">
                  {fmt === "対面" ? "対面（カウンセラーオフィス）" : "オンライン（Zoom）"}
                </span>
              </div>
            );
          })}
        </div>
        {errors.meetingFormat && <p className="bk-form-hint" style={{ color: "var(--rose)", marginTop: "8px" }}>{errors.meetingFormat}</p>}
      </div>

      {/* 事前に伝えたいこと */}
      <div className="bk-form-group">
        <label className="bk-form-label">事前に伝えたいこと</label>
        <textarea
          rows={4}
          placeholder="任意。事前に伝えることで、より充実した面談になります。"
          value={userInfo.message}
          onChange={(e) => update("message", e.target.value)}
          className="bk-form-textarea"
        />
      </div>

      {/* ナビボタン */}
      <div className="step-nav">
        <button type="button" onClick={onBack} className="bk-btn bk-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          戻る
        </button>
        <button type="submit" className="bk-btn bk-btn-accent bk-btn-lg">
          内容を確認する
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
