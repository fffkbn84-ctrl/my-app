"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────────────────
   空き日付を今日から動的生成（後でSupabase に差し替え）
──────────────────────────────────────────────────────────── */
function generateAvailableDates(): Set<string> {
  const dates = new Set<string>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 明日から90日間で、火・水・木・金・土曜を空き枠として生成（約60%）
  for (let i = 1; i <= 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay(); // 0=日, 6=土
    if (dow === 0) continue; // 日曜は除く
    // seedで間引き（全部埋めるとリアルじゃないので）
    const seed = d.getDate() + d.getMonth() * 31;
    if (seed % 5 === 0) continue;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.add(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}

const AVAILABLE_DATES = generateAvailableDates();

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function formatYM(year: number, month: number) {
  return `${year}年${month + 1}月`;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

/* ────────────────────────────────────────────────────────────
   Props
──────────────────────────────────────────────────────────── */
interface Props {
  counselorId: string;
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

/* ────────────────────────────────────────────────────────────
   Step1Calendar
──────────────────────────────────────────────────────────── */
export default function Step1Calendar({ selectedDate, onSelect }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  // 6行分のセル
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <h2
        className="text-xl md:text-2xl text-ink mb-2"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        面談日を選んでください
      </h2>
      <p className="text-sm text-muted mb-8">空き枠がある日付が選択できます</p>

      {/* カレンダーナビ */}
      <div className="bg-white rounded-2xl border border-light overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-light">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-pale transition-colors duration-150"
            aria-label="前の月"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h3
            className="text-base text-ink"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            {formatYM(viewYear, viewMonth)}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-pale transition-colors duration-150"
            aria-label="次の月"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 border-b border-light">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={wd}
              className={`py-2 text-center text-xs font-medium ${
                i === 0 ? "text-rose" : i === 6 ? "text-blue" : "text-muted"
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="h-12" />;

            const key = toKey(viewYear, viewMonth, day);
            const past = isPast(day);
            const available = AVAILABLE_DATES.has(key);
            const selected = selectedDate === key;
            const weekday = (firstDay + day - 1) % 7;
            const isSun = weekday === 0;
            const isSat = weekday === 6;

            const canSelect = available && !past;

            return (
              <button
                key={key}
                onClick={() => canSelect && onSelect(key)}
                disabled={!canSelect}
                className={`h-12 flex flex-col items-center justify-center gap-0.5 text-sm transition-all duration-150 relative
                  ${selected
                    ? "bg-accent text-white"
                    : canSelect
                    ? "hover:bg-pale cursor-pointer"
                    : "cursor-default"
                  }
                  ${past || !available ? "opacity-30" : ""}
                `}
              >
                <span
                  className={
                    !selected && isSun ? "text-rose" :
                    !selected && isSat ? "text-blue" :
                    !selected ? "text-ink" : ""
                  }
                >
                  {day}
                </span>
                {/* 空き枠ドット */}
                {available && !past && !selected && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-5 mt-4 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent" />
          空き枠あり
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-light" />
          空き枠なし
        </div>
      </div>
    </div>
  );
}
