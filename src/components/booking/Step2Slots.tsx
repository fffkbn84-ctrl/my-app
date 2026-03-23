"use client";

import { useState, useEffect } from "react";
import type { Slot } from "@/types/booking";

/* ────────────────────────────────────────────────────────────
   モックデータ生成（後で Supabase Realtime に差し替え）
──────────────────────────────────────────────────────────── */
function generateSlots(date: string): Slot[] {
  const times = [
    ["10:00", "11:00"],
    ["11:00", "12:00"],
    ["13:00", "14:00"],
    ["14:00", "15:00"],
    ["15:00", "16:00"],
    ["16:00", "17:00"],
    ["18:00", "19:00"],
    ["19:00", "20:00"],
  ];

  // 日付の hash で固定的に locked/booked を決める
  const seed = date.replace(/-/g, "").slice(-2);
  const seedNum = parseInt(seed, 10);

  return times.map(([start, end], i) => {
    let status: Slot["status"] = "open";
    if ((seedNum + i) % 5 === 0) status = "booked";
    else if ((seedNum + i) % 7 === 0) status = "locked";
    return { id: `${date}-${start}`, date, startTime: start, endTime: end, status };
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
}

/* ────────────────────────────────────────────────────────────
   Props
──────────────────────────────────────────────────────────── */
interface Props {
  counselorId: string;
  date: string;
  onSelect: (slot: Slot) => void;
  onBack: () => void;
}

/* ────────────────────────────────────────────────────────────
   スロットバッジ
──────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: Slot["status"] }) {
  if (status === "open") return null;
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        status === "locked"
          ? "bg-pale text-muted"
          : "bg-light/50 text-muted line-through"
      }`}
    >
      {status === "locked" ? "一時確保中" : "予約済み"}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   Step2Slots
──────────────────────────────────────────────────────────── */
export default function Step2Slots({ counselorId: _counselorId, date, onSelect, onBack }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // TODO: Supabase Realtime サブスクリプションに差し替え
    const timer = setTimeout(() => {
      setSlots(generateSlots(date));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [date]);

  const openSlots = slots.filter((s) => s.status === "open");

  const handleSelect = (slot: Slot) => {
    setSelected(slot.id);
    // 少し間を置いて次ステップへ（UX）
    setTimeout(() => onSelect(slot), 300);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        日付を変更する
      </button>

      <h2
        className="text-xl md:text-2xl text-ink mb-1"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        時間帯を選んでください
      </h2>
      <p className="text-sm text-muted mb-8">
        {formatDate(date)} ·{" "}
        {loading ? "読み込み中..." : `${openSlots.length}枠 空きあり`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-light border-t-accent animate-spin"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.map((slot) => {
              const isOpen = slot.status === "open";
              const isSelected = selected === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => isOpen && handleSelect(slot)}
                  disabled={!isOpen}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 text-left
                    ${isSelected
                      ? "border-accent bg-accent text-white shadow-lg scale-[1.02]"
                      : isOpen
                      ? "border-light hover:border-accent/50 hover:bg-pale cursor-pointer"
                      : "border-light bg-pale/50 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  <div>
                    <p className={`text-base font-medium ${isSelected ? "text-white" : "text-ink"}`}>
                      {slot.startTime} 〜 {slot.endTime}
                    </p>
                    <p className={`text-xs mt-0.5 ${isSelected ? "text-white/70" : "text-muted"}`}>
                      60分間
                    </p>
                  </div>
                  {isOpen ? (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      空き
                    </span>
                  ) : (
                    <StatusBadge status={slot.status} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Realtime 更新の説明 */}
          <div className="flex items-center gap-2 mt-6 text-xs text-muted">
            <span
              className="w-2 h-2 rounded-full bg-green animate-pulse"
            />
            空き状況はリアルタイムで更新されます
          </div>
        </>
      )}
    </div>
  );
}
