"use client";

import { useEffect, useMemo, useState } from "react";
import type { Slot } from "@/types/booking";
import { getSlotsByCounselor, type SupabaseSlot } from "@/lib/data";

/* ────────────────────────────────────────────────────────────
   モック動作（mock counselor id 用フォールバック）
   - UUID のカウンセラーは Supabase の slots テーブルから読む
   - 数値 ID（1〜6, 101〜105）は従来通り疑似データを生成
──────────────────────────────────────────────────────────── */
function generateMockAvailableDates(): Set<string> {
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

const MOCK_AVAILABLE_DATES = generateMockAvailableDates();
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const MEETING_TYPES = ["対面", "対面", "対面", "オンライン", "対面", "オンライン", "対面", "対面"] as const;

function generateMockSlots(date: string): Slot[] {
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

function pad2(n: number) { return String(n).padStart(2, "0"); }
function toKey(year: number, month: number, day: number) { return `${year}-${pad2(month + 1)}-${pad2(day)}`; }
function formatYM(year: number, month: number) { return `${year}年${month + 1}月`; }

const isUuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

interface Props {
  counselorId: string;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  onNext: (date: string, slot: Slot) => void;
}

export default function Step1DateTime({ counselorId, selectedDate: initDate, selectedSlot: initSlot, onNext }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(initDate);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(initSlot);

  // Supabase 連携：UUID の counselor だけ DB から slots を取りに行く
  const useSupabase = isUuid(counselorId);
  const [supabaseSlots, setSupabaseSlots] = useState<SupabaseSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // 表示中の月が変わったら fetch（前後 1 ヶ月分まとめて取る）
  useEffect(() => {
    if (!useSupabase) return;
    let cancelled = false;
    setLoadingSlots(true);
    // 表示月の前月1日 〜 翌月末を Asia/Tokyo の境界で計算
    const fromLocal = new Date(viewYear, viewMonth - 1, 1, 0, 0, 0);
    const toLocal = new Date(viewYear, viewMonth + 2, 0, 23, 59, 59);
    getSlotsByCounselor(counselorId, fromLocal.toISOString(), toLocal.toISOString())
      .then((res) => {
        if (cancelled) return;
        setSupabaseSlots(res ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => { cancelled = true; };
  }, [counselorId, viewYear, viewMonth, useSupabase]);

  // 当日の現在時刻（Asia/Tokyo）— 過去スロットを除外する判定に使う
  const nowMs = Date.now();

  // Supabase 由来の slots を「日付 → Slot[]」に変換し、将来の open/locked のみを残す
  const slotsByDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    if (!useSupabase) return map;
    for (const s of supabaseSlots) {
      // 既に予約済みは候補から外し、今より過去のスロットも候補から外す
      // （カウンセラー画面で「過去枠を消し忘れ」でも user-side では混乱しない）
      const startMs = new Date(`${s.date}T${s.startTime}:00+09:00`).getTime();
      if (startMs < nowMs) continue;
      // 「ロック中」は他の人が予約フロー中の可能性 → ユーザー側では選べないが、
      // 表示上は「満席（仮押さえ含む）」として disable する
      const slot: Slot = {
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
        // meetingType は将来 slots テーブルにカラム追加するまで未指定（== 対面相当）
      };
      const arr = map.get(s.date) ?? [];
      arr.push(slot);
      map.set(s.date, arr);
    }
    // 各日内で時刻順
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => a.startTime.localeCompare(b.startTime));
      map.set(k, arr);
    }
    return map;
  }, [supabaseSlots, useSupabase, nowMs]);

  // 「予約可能」と判定する日付の集合（Supabase なら open が 1 つでもある日 / mock なら従来）
  const availableDates: Set<string> = useMemo(() => {
    if (!useSupabase) return MOCK_AVAILABLE_DATES;
    const s = new Set<string>();
    for (const [date, arr] of slotsByDate.entries()) {
      if (arr.some((x) => x.status === "open")) s.add(date);
    }
    return s;
  }, [slotsByDate, useSupabase]);

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

  // その日の時間スロット
  const slots: Slot[] = selectedDate
    ? useSupabase
      ? slotsByDate.get(selectedDate) ?? []
      : generateMockSlots(selectedDate)
    : [];

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
              const available = availableDates.has(key);
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
        {useSupabase && loadingSlots && (
          <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>
            空き状況を読み込み中…
          </p>
        )}
        {useSupabase && !loadingSlots && availableDates.size === 0 && (
          <p style={{ fontSize: 12, color: "var(--mid)", textAlign: "center", marginTop: 16, lineHeight: 1.8 }}>
            この月に予約可能な枠はまだ登録されていません。
            <br />
            前後の月もご確認ください。
          </p>
        )}
      </div>

      {/* 時間スロット */}
      {selectedDate && (
        <div>
          <p className="time-slots-title">空き時間を選ぶ</p>
          <div className="bk-time-slots">
            {slots.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--mid)", padding: "12px 4px" }}>
                この日の枠はありません。
              </p>
            )}
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
                  <span className="ts-type">{unavailable ? "満席" : slot.meetingType ?? "対面"}</span>
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
