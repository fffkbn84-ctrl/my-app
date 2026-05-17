"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BookingUserInfo } from "@/types/booking";
import { useAuth } from "@/lib/auth/AuthProvider";
import { DIAGNOSIS_TYPES, type DiagnosisTypeId } from "@/lib/diagnosis";
import { WEATHER_DESCRIPTIONS, type WeatherKey } from "@/app/kinda-note/data/weatherDescriptions";

type LatestDiagnosis = {
  type?: { result_key: DiagnosisTypeId; created_at: string };
  note?: { result_key: WeatherKey; created_at: string };
};

function isTypeKey(k: string): k is DiagnosisTypeId {
  return k === "A" || k === "B" || k === "C" || k === "D";
}

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
  /**
   * 選択中の slot に事前指定された面談形式があれば渡す。
   * 渡されると面談形式の radio はその選択肢でロックされる
   *（022_slots_meeting_type 対応）
   */
  lockedMeetingFormat?: "対面" | "オンライン" | null;
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

export default function Step3Form({ userInfo, onChange, onNext, onBack, lockedMeetingFormat }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof BookingUserInfo, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const { user, supabase } = useAuth();
  const [latest, setLatest] = useState<LatestDiagnosis>({});
  const [latestLoaded, setLatestLoaded] = useState(false);

  const update = (field: keyof BookingUserInfo, value: string) => {
    const next = { ...userInfo, [field]: value };
    onChange(next);
    if (submitted) setErrors(validate(next));
  };

  // 共有トグルの一括更新（複数フィールドを同時に変更するため update() を経由しない）
  const updateShared = (patch: Partial<BookingUserInfo>) => {
    const next = { ...userInfo, ...patch };
    onChange(next);
  };

  // ログイン済みなら直近の Kinda type / note 結果を取得（共有候補の提示用）
  useEffect(() => {
    if (!user || !supabase) {
      setLatestLoaded(true);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("diagnosis_results")
        .select("kind, result_key, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (!active) return;
      type Row = { kind: string; result_key: string; created_at: string };
      const rows = (data as Row[]) ?? [];
      const typeRow = rows.find((r) => r.kind === "type" && isTypeKey(r.result_key));
      const noteRow = rows.find((r) => r.kind === "note" && r.result_key in WEATHER_DESCRIPTIONS);
      const next: LatestDiagnosis = {};
      if (typeRow && isTypeKey(typeRow.result_key)) {
        next.type = { result_key: typeRow.result_key, created_at: typeRow.created_at };
      }
      if (noteRow) {
        next.note = { result_key: noteRow.result_key as WeatherKey, created_at: noteRow.created_at };
      }
      setLatest(next);
      setLatestLoaded(true);

      // 初期値：自動で共有 ON（ユーザーはトグルで OFF にできる）
      // すでにユーザーが操作している場合は上書きしない
      const patch: Partial<BookingUserInfo> = {};
      if (next.type && userInfo.sharedKindaTypeKey === undefined) {
        patch.sharedKindaTypeKey = next.type.result_key;
        patch.sharedKindaTypeAt = next.type.created_at;
      }
      if (next.note && userInfo.sharedKindaNoteKey === undefined) {
        patch.sharedKindaNoteKey = next.note.result_key;
        patch.sharedKindaNoteAt = next.note.created_at;
      }
      if (Object.keys(patch).length > 0) {
        onChange({ ...userInfo, ...patch });
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, supabase]);

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

      {/* 面談形式（slot に事前指定があればロック表示） */}
      <div className="bk-form-group">
        <label className="bk-form-label">面談形式<span>*</span></label>
        {lockedMeetingFormat ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 18px",
              background: "var(--pale)",
              border: "1px solid var(--light)",
              borderRadius: 10,
              fontSize: 14,
              color: "var(--ink)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="var(--accent)" opacity=".15" />
              <path d="M4.5 8.2l2.4 2.4 5-5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {lockedMeetingFormat === "対面"
              ? "対面（カウンセラーオフィス）"
              : "オンライン（Zoom）"}
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>
              この枠は{lockedMeetingFormat}専用です
            </span>
          </div>
        ) : (
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
        )}
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

      {/* 024 — Kinda type / Kinda note の結果共有トグル
         事前に問診票が手に入る・カウンセラーが準備して臨めるようにする */}
      {latestLoaded && (latest.type || latest.note) && (
        <div className="bk-form-group">
          <label className="bk-form-label">担当者に伝える（任意）</label>
          <div
            style={{
              padding: "14px 16px",
              background: "var(--pale)",
              border: "1px solid var(--light)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <p style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.8, margin: 0 }}>
              事前に共有しておくと、担当者が当日の面談前に目を通して準備してくれます。
              いつでもオフにできます。
            </p>

            {latest.type && (
              <SharedToggleRow
                label="Kinda type の結果"
                resultBadge={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        background: DIAGNOSIS_TYPES[latest.type.result_key].gradient,
                        color: "white",
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontFamily: "var(--font-mincho)",
                      }}
                    >
                      {DIAGNOSIS_TYPES[latest.type.result_key].name}
                    </span>
                  </span>
                }
                checked={!!userInfo.sharedKindaTypeKey}
                onToggle={(on) => {
                  updateShared(
                    on
                      ? {
                          sharedKindaTypeKey: latest.type!.result_key,
                          sharedKindaTypeAt: latest.type!.created_at,
                        }
                      : { sharedKindaTypeKey: null, sharedKindaTypeAt: null },
                  );
                }}
              />
            )}

            {latest.note && (
              <SharedToggleRow
                label="Kinda note の結果"
                resultBadge={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        background: "#D4A090",
                        color: "white",
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontFamily: "var(--font-mincho)",
                      }}
                    >
                      {WEATHER_DESCRIPTIONS[latest.note.result_key].name_ja}
                    </span>
                  </span>
                }
                checked={!!userInfo.sharedKindaNoteKey}
                onToggle={(on) => {
                  updateShared(
                    on
                      ? {
                          sharedKindaNoteKey: latest.note!.result_key,
                          sharedKindaNoteAt: latest.note!.created_at,
                        }
                      : { sharedKindaNoteKey: null, sharedKindaNoteAt: null },
                  );
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* 未受診ユーザーへの誘導（ログイン済みかつ どちらも受診歴なし） */}
      {latestLoaded && user && !latest.type && !latest.note && (
        <div className="bk-form-group">
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(212,160,144,.06)",
              border: "1px dashed rgba(212,160,144,.4)",
              borderRadius: 12,
              fontSize: 12,
              color: "var(--mid)",
              lineHeight: 1.85,
            }}
          >
            事前に <Link href="/kinda-type" style={{ color: "#5A7FAF", textDecoration: "underline" }}>Kinda type</Link>{" "}
            や{" "}
            <Link href="/kinda-note" style={{ color: "#D4A090", textDecoration: "underline" }}>Kinda note</Link>{" "}
            を受けておくと、結果をそのまま担当者に共有できます（任意）。
          </div>
        </div>
      )}

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

/* 共有トグル 1 行（チェックボックス + ラベル + 結果バッジ） */
function SharedToggleRow({
  label,
  resultBadge,
  checked,
  onToggle,
}: {
  label: string;
  resultBadge: React.ReactNode;
  checked: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        padding: "6px 0",
        userSelect: "none",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
        style={{
          width: 18,
          height: 18,
          accentColor: "var(--accent)",
          flexShrink: 0,
          margin: 0,
        }}
      />
      <span style={{ fontSize: 13, color: "var(--ink)", flex: 1 }}>{label}</span>
      {resultBadge}
    </label>
  );
}
