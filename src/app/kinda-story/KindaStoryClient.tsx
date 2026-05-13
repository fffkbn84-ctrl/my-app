"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Story, StoryStage, StoryAgeBand } from "@/lib/mock/stories";

type StageFilter = "すべて" | StoryStage;
type AgeFilter = "すべて" | StoryAgeBand;
type PeriodFilter = "すべて" | "〜半年" | "半年〜1年" | "1年以上";

const STAGE_OPTIONS: StageFilter[] = ["すべて", "成婚", "交際中", "活動中"];
const AGE_OPTIONS: AgeFilter[] = ["すべて", "20代", "30代前半", "30代後半", "40代", "50代", "60代"];
const PERIOD_OPTIONS: PeriodFilter[] = ["すべて", "〜半年", "半年〜1年", "1年以上"];

function inPeriod(months: number, filter: PeriodFilter): boolean {
  if (filter === "すべて") return true;
  if (filter === "〜半年") return months <= 6;
  if (filter === "半年〜1年") return months > 6 && months <= 12;
  return months > 12;
}

type Props = {
  stories: Story[];
};

export default function KindaStoryClient({ stories }: Props) {
  const [stage, setStage] = useState<StageFilter>("すべて");
  const [age, setAge] = useState<AgeFilter>("すべて");
  const [period, setPeriod] = useState<PeriodFilter>("すべて");

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      if (stage !== "すべて" && s.stage !== stage) return false;
      if (age !== "すべて" && s.ageBand !== age) return false;
      if (!inPeriod(s.periodMonths, period)) return false;
      return true;
    });
  }, [stories, stage, age, period]);

  return (
    <>
      {/* sticky フィルターバー */}
      <div className="ks-filter-bar">
        <div className="ks-filter-row" role="tablist" aria-label="状態フィルター">
          <span className="ks-filter-label">状態</span>
          {STAGE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={`ks-pill ${stage === s ? "is-active" : ""}`}
              onClick={() => setStage(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="ks-filter-row" aria-label="年代フィルター">
          <span className="ks-filter-label">年代</span>
          {AGE_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              className={`ks-pill ${age === a ? "is-active" : ""}`}
              onClick={() => setAge(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="ks-filter-row" aria-label="期間フィルター">
          <span className="ks-filter-label">期間</span>
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              className={`ks-pill ${period === p ? "is-active" : ""}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* セクション見出し */}
      <div className="ks-section-head">
        <div className="ks-section-divider" />
        <h2 className="ks-section-title">
          <em>their words</em>
        </h2>
        <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
          物語 <span style={{ color: "#5A8050" }}>{filtered.length}</span> 件
        </div>
        <div className="ks-section-divider" />
      </div>

      {/* グリッド */}
      <div className="ks-grid-wrap">
        {filtered.length === 0 ? (
          <div className="ks-empty">
            <p>該当する物語が見つかりませんでした。</p>
            <button
              type="button"
              className="ks-pill"
              onClick={() => {
                setStage("すべて");
                setAge("すべて");
                setPeriod("すべて");
              }}
            >
              フィルターをリセット
            </button>
          </div>
        ) : (
          <div className="ks-grid">
            {filtered.map((s) => (
              <Link key={s.id} href={`/kinda-story/${s.id}`} className="ks-card">
                <div className="ks-card-meta">
                  <span className="ks-card-stage">{s.stage}</span>
                  <span className="ks-card-period">{s.periodLabel}</span>
                </div>
                <p className="ks-card-quote">「{s.quote}」</p>
                <div className="ks-card-tags">
                  {s.tags.slice(0, 3).map((t) => (
                    <span key={t} className="ks-card-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="ks-card-foot">
                  <span className="ks-card-author">
                    — {s.author}（{s.age}）／{s.counselorName}
                  </span>
                  <span className="ks-card-link">
                    読む
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M2 7h10M7 2l5 5-5 5" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
