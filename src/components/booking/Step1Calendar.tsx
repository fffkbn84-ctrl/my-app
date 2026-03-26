"use client";

import { useState } from "react";
import type { Slot } from "@/types/booking";

/* ────────────────────────────────────────────────────────────
   空き日付を今日から動的生成（後でSupabase に差し替え）
──────────────────────────────────────────────────────────── */
function generateAvailableDates(): Set<string> {
  const dates = new Set<string>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow === 0) continue;
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

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function formatYM(year: number, month: number) {
  return `${year}年${month + 1}月`;
}

/* ────────────────────────────────────────────────────────────
   時間スロット生成（後で Supabase Realtime に差し替え）
──────────────────────────────────────────────────────────── */
const MEETING_TYPES = ["対面", "対面", "対面", "オンライン", "対面", "オンライン", "対面", "対面"] as const;

function generateSlots(date: string): Slot[] {
  const times = [
    ["10:00", "11:00"],
    ["11:00", "12:00"],
    ["13:00", "14:00"],
    ["14:00", "15:00"],
    ["15:00", "16:00"],
    ["16:00", "17:00"],
    ["17:00", "18:00"],
    ["18:00", "19:00"],
  ];

  const seed = parseInt(date.replace(/-/g, "").slice(-2), 10);

  return times.map(([start, end], i) => {
    let status: Slot["status"] = "open";
    if ((seed + i) % 5 === 0) status = "booked";
    else if ((seed + i) % 7 === 0) status = "locked";
    return {
      id: `${date}-${start}`,
      date,
      startTime: start,
      endTime: end,
      status,
      meetingType: MEETING_TYPES[i % MEETING_TYPES.length],
    };
  });
}

/* ────────────────────────────────────────────────────────────
   Props
──────────────────────────────────────────────────────────── */
interface Props {
  counselorId: string;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  onNext: (date: string, slot: Slot) => void;
}

/* ────────────────────────────────────────────────────────────
   Step1DateTime — カレンダー＋時間スロット
──────────────────────────────────────────────────────────── */
export default function Step1DateTime({ selectedDate: initDate, selectedSlot: initSlot, onNext }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(initDate);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(initSlot);

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

  const isToday = (day: number) => {
    const t = new Date();
    return viewYear === t.getFullYear() && viewMonth === t.getMonth() && day === t.getDate();
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDateClick = (key: string) => {
    setSelectedDate(key);
    setSelectedSlot(null);
  };

  const slots = selectedDate ? generateSlots(selectedDate) : [];
  const canProceed = selectedDate !== null && selectedSlot !== null;

  return (
    <div>
      {/* カレンダー */}
      <div
        className="mb-6 overflow-hidden"
        style={{
          background: "white",
          border: "1px solid var(--pale)",
          borderRadius: "16px",
        }}
      >
        {/* カレンダーヘッダー */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--pale)" }}
        >
          <button
            onClick={prevMonth}
            aria-label="前の月"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ border: "1px solid var(--light)", background: "white" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ink)";
              (e.currentTarget as HTMLElement).style.background = "var(--pale)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--light)";
              (e.currentTarget as HTMLElement).style.background = "white";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span
            className="text-xl"
            style={{ fontFamily: "var(--font-serif)", color: "var(--black)" }}
          >
            {formatYM(viewYear, viewMonth)}
          </span>
          <button
            onClick={nextMonth}
            aria-label="次の月"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ border: "1px solid var(--light)", background: "white" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ink)";
              (e.currentTarget as HTMLElement).style.background = "var(--pale)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--light)";
              (e.currentTarget as HTMLElement).style.background = "white";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 曜日ラベル */}
        <div className="grid grid-cols-7 gap-1 px-5 pt-4 pb-2">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={wd}
              className="text-center text-[10px] tracking-[0.12em] py-1"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: i === 0 ? "var(--rose)" : i === 6 ? "var(--blue)" : "var(--muted)",
              }}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1 px-5 pb-5">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;

            const key = toKey(viewYear, viewMonth, day);
            const past = isPast(day);
            const available = AVAILABLE_DATES.has(key);
            const selected = selectedDate === key;
            const today = isToday(day);
            const canSelect = available && !past;
            const weekday = (firstDay + day - 1) % 7;
            const isSun = weekday === 0;
            const isSat = weekday === 6;

            let textColor = "var(--ink)";
            if (!selected) {
              if (today) textColor = "var(--accent)";
              else if (isSun) textColor = "var(--rose)";
              else if (isSat) textColor = "var(--blue)";
            }
            if (past || !available) textColor = "var(--light)";

            return (
              <button
                key={key}
                onClick={() => canSelect && handleDateClick(key)}
                disabled={!canSelect}
                className="aspect-square rounded-full flex flex-col items-center justify-center gap-0.5 text-[13px] transition-all duration-200 relative"
                style={{
                  background: selected ? "var(--black)" : "transparent",
                  color: selected ? "white" : textColor,
                  cursor: canSelect ? "pointer" : "default",
                }}
              >
                <span className={today && !selected ? "font-medium" : ""}>{day}</span>
                {/* 空き枠ドット */}
                {available && !past && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: selected ? "white" : "var(--accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 時間スロット */}
      {selectedDate && (
        <div className="mb-7">
          <p
            className="text-[13px] mb-3.5 tracking-[0.05em]"
            style={{ color: "var(--mid)" }}
          >
            空き時間を選ぶ
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {slots.map((slot) => {
              const unavailable = slot.status !== "open";
              const isSelected = selectedSlot?.id === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => !unavailable && setSelectedSlot(slot)}
                  disabled={unavailable}
                  className="py-3 px-2 text-center rounded-[10px] border transition-all duration-300"
                  style={{
                    border: isSelected
                      ? "1px solid var(--black)"
                      : unavailable
                      ? "1px solid var(--pale)"
                      : "1px solid var(--light)",
                    background: isSelected ? "var(--black)" : "white",
                    cursor: unavailable ? "default" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!unavailable && !isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                      (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!unavailable && !isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--light)";
                      (e.currentTarget as HTMLElement).style.background = "white";
                    }
                  }}
                >
                  <span
                    className="block text-[13px] mb-0.5"
                    style={{
                      color: isSelected ? "white" : unavailable ? "var(--light)" : "var(--ink)",
                    }}
                  >
                    {slot.startTime}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{
                      color: isSelected ? "rgba(255,255,255,.6)" : "var(--muted)",
                    }}
                  >
                    {unavailable ? "満席" : slot.meetingType}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 次へボタン */}
      <div className="flex justify-end pt-4 pb-8">
        <button
          onClick={() => canProceed && onNext(selectedDate!, selectedSlot!)}
          disabled={!canProceed}
          className="flex items-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-200"
          style={{
            background: canProceed ? "var(--black)" : "var(--light)",
            color: "white",
            cursor: canProceed ? "pointer" : "not-allowed",
            boxShadow: canProceed ? "0 4px 16px rgba(14,14,14,0.15)" : "none",
          }}
        >
          次へ：情報を入力
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
