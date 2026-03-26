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

function pad2(n: number) { return String(n).padStart(2, "0"); }
function toKey(year: number, month: number, day: number) { return `${year}-${pad2(month + 1)}-${pad2(day)}`; }
function formatYM(year: number, month: number) { return `${year}年${month + 1}月`; }

/* ────────────────────────────────────────────────────────────
   時間スロット生成（後で Supabase Realtime に差し替え）
──────────────────────────────────────────────────────────── */
const MEETING_TYPES = ["対面", "対面", "対面", "オンライン", "対面", "オンライン", "対面", "対面"] as const;

function generateSlots(date: string): Slot[] {
  const times = [
    ["10:00", "11:00"], ["11:00", "12:00"], ["13:00", "14:00"], ["14:00", "15:00"],
    ["15:00", "16:00"], ["16:00", "17:00"], ["17:00", "18:00"], ["18:00", "19:00"],
  ];
  const seed = parseInt(date.replace(/-/g, "").slice(-2), 10);
  return times.map(([start, end], i) => {
    let status: Slot["status"] = "open";
    if ((seed + i) % 5 === 0) status = "booked";
    else if ((seed + i) % 7 === 0) status = "locked";
    return { id: `${date}-${start}`, date, startTime: start, endTime: end, status, meetingType: MEETING_TYPES[i % MEETING_TYPES.length] };
  });
}

interface Props {
  counselorId: string;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  onNext: (date: string, slot: Slot) => void;
}

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
      <div className="calendar-wrap">
        <div className="cal-header">
          <button className="cal-nav" onClick={prevMonth} aria-label="前の月">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="cal-month">{formatYM(viewYear, viewMonth)}</span>
          <button className="cal-nav" onClick={nextMonth} aria-label="次の月">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="cal-grid">
          {/* 曜日ラベル */}
          <div className="cal-days-header">
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                className="cal-day-label"
                style={{ color: i === 0 ? "var(--rose)" : i === 6 ? "var(--blue)" : undefined }}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="cal-days">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="cal-day empty" />;

              const key = toKey(viewYear, viewMonth, day);
              const past = isPast(day);
              const available = AVAILABLE_DATES.has(key);
              const selected = selectedDate === key;
              const todayDay = isToday(day);
              const canSelect = available && !past;
              const weekday = (firstDay + day - 1) % 7;

              let cls = "cal-day";
              if (past || !available) {
                cls += " past";
              } else {
                cls += " has-slot";
                if (selected) cls += " selected";
                if (todayDay && !selected) cls += " today";
              }

              // 日曜・土曜の色（today/selected は CSS クラスが優先）
              let inlineColor: string | undefined;
              if (!selected && !past && available && !todayDay) {
                if (weekday === 0) inlineColor = "var(--rose)";
                else if (weekday === 6) inlineColor = "var(--blue)";
              }

              return (
                <button
                  key={key}
                  onClick={() => canSelect && handleDateClick(key)}
                  disabled={!canSelect}
                  className={cls}
                  style={inlineColor ? { color: inlineColor } : undefined}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 時間スロット */}
      {selectedDate && (
        <div>
          <p className="time-slots-title">空き時間を選ぶ</p>
          <div className="bk-time-slots">
            {slots.map((slot) => {
              const unavailable = slot.status !== "open";
              const isSelected = selectedSlot?.id === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => !unavailable && setSelectedSlot(slot)}
                  disabled={unavailable}
                  className={`time-slot${isSelected ? " selected" : ""}${unavailable ? " unavailable" : ""}`}
                >
                  <span className="ts-time">{slot.startTime}</span>
                  <span className="ts-type">{unavailable ? "満席" : slot.meetingType}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 次へボタン */}
      <div className="step-nav single">
        <button
          onClick={() => canProceed && onNext(selectedDate!, selectedSlot!)}
          disabled={!canProceed}
          className="bk-btn bk-btn-accent bk-btn-lg"
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
