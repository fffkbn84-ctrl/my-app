'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Counselor, Slot, Agency } from '@/lib/types'
import MonthGrid from '@/components/calendar/MonthGrid'
import WeekView from '@/components/calendar/WeekView'
import SlotDetailPanel from '@/components/calendar/SlotDetailPanel'
import SlotForm from '@/components/calendar/SlotForm'

// dashboard と共有する context localStorage キー
const SCOPE_STORAGE_KEY = 'kinda-dashboard-context'
const ALL_SENTINEL = 'ALL'
const VIEWMODE_STORAGE_KEY = 'kinda-calendar-viewmode'

type ViewMode = 'day' | 'week' | 'month'

// "YYYY-MM-DD" + "HH:mm" を端末ローカルTZ ISO 文字列に変換
function localDateTimeToIsoStr(date: string, time: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const local = new Date(y, m - 1, d, hh, mm, 0)
  const tzMin = -local.getTimezoneOffset()
  const sign = tzMin >= 0 ? '+' : '-'
  const abs = Math.abs(tzMin)
  const tzStr = `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00${tzStr}`
}

function startOfDay(d: Date): Date {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** viewMode と currentDate から、データロードと表示の起点・終点を算出 */
function computeRange(date: Date, mode: ViewMode): { start: Date; end: Date; weekStart: Date } {
  const base = startOfDay(date)
  if (mode === 'day') {
    const end = new Date(base)
    end.setDate(base.getDate() + 1)
    return { start: base, end, weekStart: base }
  }
  if (mode === 'week') {
    const sun = new Date(base)
    sun.setDate(base.getDate() - base.getDay()) // 日曜
    const end = new Date(sun)
    end.setDate(sun.getDate() + 7)
    return { start: sun, end, weekStart: sun }
  }
  // month
  const first = new Date(base.getFullYear(), base.getMonth(), 1)
  const last = new Date(base.getFullYear(), base.getMonth() + 1, 1)
  return { start: first, end: last, weekStart: first }
}

const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const DOW_LABEL = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarPage() {
  const today = new Date()
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [currentDate, setCurrentDate] = useState<Date>(startOfDay(today))
  const [slots, setSlots] = useState<Slot[]>([])
  const [needsReplyDates, setNeedsReplyDates] = useState<Set<string>>(new Set())
  const [selectedDate, setSelectedDate] = useState<string | null>(ymd(today))
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [counselorsInScope, setCounselorsInScope] = useState<Counselor[]>([])
  const [agency, setAgency] = useState<Agency | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formInitialTime, setFormInitialTime] = useState<string | null>(null)
  const [addingSlot, setAddingSlot] = useState(false)
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const [toast, setToast] = useState('')
  const router = useRouter()

  // viewMode の永続化
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEWMODE_STORAGE_KEY)
      if (stored === 'day' || stored === 'week' || stored === 'month') {
        setViewMode(stored)
      }
    } catch {}
  }, [])
  const handleViewModeChange = (next: ViewMode) => {
    setViewMode(next)
    try { localStorage.setItem(VIEWMODE_STORAGE_KEY, next) } catch {}
  }

  const range = useMemo(() => computeRange(currentDate, viewMode), [currentDate, viewMode])

  const showToast = (msg: string, durationMs = 2500) => { setToast(msg); setTimeout(() => setToast(''), durationMs) }

  /** start <= start_at < end の範囲でスロットと未返信予約を取得 */
  const loadSlots = useCallback(async (c: Counselor, start: Date, end: Date) => {
    const supabase = createClient()
    const fromIso = start.toISOString()
    const toIso = end.toISOString()
    const [slotsRes, resRes] = await Promise.all([
      supabase
        .from('slots')
        .select('*')
        .eq('counselor_id', c.id)
        .gte('start_at', fromIso)
        .lt('start_at', toIso)
        .order('start_at'),
      supabase
        .from('reservations')
        .select('start_at, notes, agency_message, status')
        .eq('counselor_id', c.id)
        .eq('status', 'active')
        .not('notes', 'is', null)
        .is('agency_message', null)
        .gte('start_at', fromIso)
        .lt('start_at', toIso),
    ])
    setSlots((slotsRes.data as Slot[]) ?? [])

    type ResRow = { start_at: string | null; notes: string | null; agency_message: string | null; status: string }
    const reservedDates = new Set<string>()
    for (const r of ((resRes.data as ResRow[] | null) ?? [])) {
      if (!r.start_at) continue
      if (!r.notes || r.notes.trim().length === 0) continue
      if (r.agency_message) continue
      reservedDates.add(ymd(new Date(r.start_at)))
    }
    setNeedsReplyDates(reservedDates)
  }, [])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const scoped: Counselor[] = []
      const { data: own } = await supabase
        .from('counselors').select('*').eq('owner_user_id', user.id)
      if (own) scoped.push(...(own as Counselor[]))

      const { data: agencies } = await supabase
        .from('agencies').select('id').eq('owner_user_id', user.id)
      const agencyIds = ((agencies as { id: string }[] | null) ?? []).map(a => a.id)
      if (agencyIds.length > 0) {
        const { data: rows } = await supabase
          .from('counselors').select('*')
          .in('agency_id', agencyIds)
          .order('created_at', { ascending: true })
        const ids = new Set(scoped.map(c => c.id))
        for (const c of (rows as Counselor[] | null) ?? []) {
          if (!ids.has(c.id)) scoped.push(c)
        }
      }
      setCounselorsInScope(scoped)

      if (scoped.length === 0) { setLoading(false); return }

      let selected: Counselor | null = null
      try {
        const stored = localStorage.getItem(SCOPE_STORAGE_KEY)
        if (stored && stored !== ALL_SENTINEL) {
          selected = scoped.find(c => c.id === stored) ?? null
        }
      } catch {}
      if (!selected) selected = scoped[0]

      setCounselor(selected)
      if (selected.agency_id) {
        const { data: ag } = await supabase
          .from('agencies').select('*').eq('id', selected.agency_id).maybeSingle()
        if (ag) setAgency(ag as Agency)
      }
      setLoading(false)
    }
    init()
  }, [])

  // counselor または範囲が変わったらリロード
  useEffect(() => {
    if (counselor) loadSlots(counselor, range.start, range.end)
  }, [counselor, range.start, range.end, loadSlots])

  // Realtime購読
  useEffect(() => {
    if (!counselor) return
    const supabase = createClient()
    const channel = supabase
      .channel('slots-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slots', filter: `counselor_id=eq.${counselor.id}` }, () => {
        loadSlots(counselor, range.start, range.end)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [counselor, range.start, range.end, loadSlots])

  const handleCounselorChange = async (id: string) => {
    const next = counselorsInScope.find(c => c.id === id) ?? null
    if (!next) return
    setCounselor(next)
    try { localStorage.setItem(SCOPE_STORAGE_KEY, id) } catch {}
    if (next.agency_id) {
      const supabase = createClient()
      const { data: ag } = await supabase
        .from('agencies').select('*').eq('id', next.agency_id).maybeSingle()
      setAgency((ag as Agency | null) ?? null)
    } else {
      setAgency(null)
    }
  }

  const handleAddSlot = async (
    startTime: string,
    endTime: string,
    meetingType: '対面' | 'オンライン' | null,
  ) => {
    if (!counselor) { showToast('カウンセラー情報が読み込めていません', 5000); return }
    if (startTime >= endTime) { showToast('終了時刻は開始時刻より後にしてください', 4000); return }
    setAddingSlot(true)
    const supabase = createClient()
    const payload = {
      counselor_id: counselor.id,
      start_at: startTime,
      end_at: endTime,
      status: 'open' as const,
      meeting_type: meetingType,
    }
    const { data: inserted, error } = await supabase.from('slots').insert(payload).select().maybeSingle()

    setAddingSlot(false)
    if (error) {
      console.error('[slot add] full error object', error)
      const code = error.code ? `[${error.code}] ` : ''
      showToast(`追加失敗：${code}${describeError(error)}`, 7000)
      return
    }
    if (!inserted) {
      showToast('追加できたか確認できませんでした。一覧を再読み込みします', 5000)
      if (counselor) await loadSlots(counselor, range.start, range.end)
      setShowForm(false)
      return
    }
    setSlots(prev => [...prev, inserted as Slot].sort((a, b) => a.start_at.localeCompare(b.start_at)))
    setShowForm(false)
    setFormInitialTime(null)
    showToast('予約枠を追加しました')
  }

  const handleStatusChange = async (slotId: string, status: Slot['status']) => {
    const supabase = createClient()
    await supabase.from('slots').update({ status }).eq('id', slotId)
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status } : s))
  }

  const handleMeetingTypeChange = async (slotId: string, meetingType: '対面' | 'オンライン' | null) => {
    const supabase = createClient()
    const { error } = await supabase.from('slots').update({ meeting_type: meetingType }).eq('id', slotId)
    if (error) {
      console.error('[slot meeting_type] error', error)
      showToast(`面談形式の変更に失敗：${describeError(error)}`, 5000)
      return
    }
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, meeting_type: meetingType } : s))
    showToast(meetingType ? `${meetingType}のみに変更しました` : '両方OKに変更しました')
  }

  const handleDelete = async (slotId: string) => {
    const supabase = createClient()
    await supabase.from('slots').delete().eq('id', slotId)
    setSlots(prev => prev.filter(s => s.id !== slotId))
    showToast('予約枠を削除しました')
  }

  /** 前へ / 次へ：viewMode に応じて1日/1週/1月単位で移動 */
  const handlePrev = () => {
    setCurrentDate(prev => {
      const next = new Date(prev)
      if (viewMode === 'day') next.setDate(prev.getDate() - 1)
      else if (viewMode === 'week') next.setDate(prev.getDate() - 7)
      else next.setMonth(prev.getMonth() - 1)
      return next
    })
  }
  const handleNext = () => {
    setCurrentDate(prev => {
      const next = new Date(prev)
      if (viewMode === 'day') next.setDate(prev.getDate() + 1)
      else if (viewMode === 'week') next.setDate(prev.getDate() + 7)
      else next.setMonth(prev.getMonth() + 1)
      return next
    })
  }
  const handleToday = () => setCurrentDate(startOfDay(new Date()))

  // 月ビュー用の年月（既存 MonthGrid の interface に合わせる）
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 月ビュー：日タップ → selectedDate
  // 週/日ビュー：スロットタップ → そのスロットの日付を selectedDate に
  const handleSlotClick = (slot: Slot) => {
    const d = new Date(slot.start_at)
    setSelectedDate(ymd(d))
    // scroll は SlotDetailPanel に任せる
  }

  // 週/日ビュー：空き時間タップ → その時刻で枠追加モーダル
  const handleAddSlotFromGrid = (dateStr: string, timeStr: string) => {
    setSelectedDate(dateStr)
    setFormInitialTime(timeStr)
    setShowForm(true)
  }

  // 選択日の slot 一覧（既存 SlotDetailPanel 用）
  const selectedSlots = selectedDate
    ? slots.filter(s => ymd(new Date(s.start_at)) === selectedDate)
    : []

  const isClosedDay = (() => {
    if (!selectedDate || !agency?.closed_weekdays || agency.closed_weekdays.length === 0) return false
    const [y, m, d] = selectedDate.split('-').map(Number)
    const dow = new Date(y, m - 1, d).getDay()
    return agency.closed_weekdays.includes(dow)
  })()

  const handleBulkGenerate = async () => {
    if (!counselor || !selectedDate) return
    const startStr = (agency?.consultation_start_time ?? '10:00').slice(0, 5)
    const endStr = (agency?.consultation_end_time ?? '19:00').slice(0, 5)
    const slotMin = agency?.default_slot_minutes ?? 60
    const [sh, sm] = startStr.split(':').map(Number)
    const [eh, em] = endStr.split(':').map(Number)
    const startMin = sh * 60 + sm
    const endMin = eh * 60 + em
    if (endMin <= startMin) { showToast('面談可能時間が不正です'); return }

    setBulkGenerating(true)
    const supabase = createClient()

    const existingStarts = new Set(
      selectedSlots.map(s => {
        const dt = new Date(s.start_at)
        return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
      })
    )

    const minutesToHHMM = (mm: number) => {
      const h = Math.floor(mm / 60)
      const m = mm % 60
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }

    const toInsert: { counselor_id: string; start_at: string; end_at: string; status: 'open' }[] = []
    for (let mm = startMin; mm + slotMin <= endMin; mm += slotMin) {
      const t = minutesToHHMM(mm)
      if (existingStarts.has(t)) continue
      toInsert.push({
        counselor_id: counselor.id,
        start_at: localDateTimeToIsoStr(selectedDate, t),
        end_at: localDateTimeToIsoStr(selectedDate, minutesToHHMM(mm + slotMin)),
        status: 'open',
      })
    }

    if (toInsert.length === 0) {
      setBulkGenerating(false)
      showToast('既にすべての枠が登録されています')
      return
    }

    const { data, error } = await supabase.from('slots').insert(toInsert).select()
    setBulkGenerating(false)
    if (error) {
      console.error('[bulk add] error', error)
      showToast(`一括生成失敗：${describeError(error)}`, 6000)
      return
    }
    if (data) {
      setSlots(prev => [...prev, ...(data as Slot[])].sort((a, b) => a.start_at.localeCompare(b.start_at)))
    }
    showToast(`${toInsert.length}件の枠を生成しました`)
  }

  // 表示ラベル（ヘッダー中央）
  const headerLabel = (() => {
    if (viewMode === 'day') {
      return `${currentDate.getMonth() + 1}月${currentDate.getDate()}日（${DOW_LABEL[currentDate.getDay()]}）`
    }
    if (viewMode === 'week') {
      const last = new Date(range.start)
      last.setDate(range.start.getDate() + 6)
      const sameMonth = range.start.getMonth() === last.getMonth()
      const startLabel = `${range.start.getMonth() + 1}月${range.start.getDate()}日`
      const endLabel = sameMonth
        ? `${last.getDate()}日`
        : `${last.getMonth() + 1}月${last.getDate()}日`
      return `${startLabel} 〜 ${endLabel}`
    }
    return `${year}年 ${MONTH_NAMES[month]}`
  })()

  // 時刻範囲（カレンダー営業時間あれば反映、なければ 8-22）
  const viewStartHour = (() => {
    const t = agency?.consultation_start_time
    if (!t) return 8
    return Math.max(0, Math.min(23, Number(t.slice(0, 2))))
  })()
  const viewEndHour = (() => {
    const t = agency?.consultation_end_time
    if (!t) return 22
    const h = Number(t.slice(0, 2))
    const m = Number(t.slice(3, 5))
    return Math.max(viewStartHour + 1, Math.min(24, m > 0 ? h + 1 : h))
  })()

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

  return (
    <div style={{ padding: '28px 24px', maxWidth: 920, paddingBottom: 80 }}>
      <h1 className="page-title" style={{ marginBottom: 12 }}>カレンダー</h1>

      {/* カウンセラー切替（複数所属の場合のみ） */}
      {counselorsInScope.length > 1 && counselor && (
        <div style={{
          marginBottom: 14,
          padding: '10px 14px',
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-light)' }}>
            カウンセラー
          </span>
          <select
            className="kc-select"
            value={counselor.id}
            onChange={e => handleCounselorChange(e.target.value)}
            style={{ flex: 1, minWidth: 160 }}
          >
            {counselorsInScope.map(c => (
              <option key={c.id} value={c.id}>{c.name} さん</option>
            ))}
          </select>
        </div>
      )}

      {agency?.business_hours_text && (
        <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 18, lineHeight: 1.7 }}>
          営業時間：{agency.business_hours_text}
        </p>
      )}

      {/* View タブ */}
      <div style={{ marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="cal-tabs" role="tablist" aria-label="表示切替">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'day'}
            className={`cal-tab${viewMode === 'day' ? ' is-active' : ''}`}
            onClick={() => handleViewModeChange('day')}
          >日</button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'week'}
            className={`cal-tab${viewMode === 'week' ? ' is-active' : ''}`}
            onClick={() => handleViewModeChange('week')}
          >週</button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'month'}
            className={`cal-tab${viewMode === 'month' ? ' is-active' : ''}`}
            onClick={() => handleViewModeChange('month')}
          >月</button>
        </div>
      </div>

      <div className="kc-card cal-wrap" style={{ padding: 20 }}>
        {/* カレンダーヘッダー：前/次/今日 + ラベル */}
        <div className="cal-header">
          <div className="cal-header-nav">
            <button onClick={handlePrev} className="kc-btn kc-btn-ghost kc-btn-sm" aria-label="前へ">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="cal-header-month" style={{ minWidth: viewMode === 'week' ? 140 : 100 }}>
              {headerLabel}
            </span>
            <button onClick={handleNext} className="kc-btn kc-btn-ghost kc-btn-sm" aria-label="次へ">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <button className="kc-btn kc-btn-ghost kc-btn-sm" onClick={handleToday}>
            {viewMode === 'day' ? '今日' : viewMode === 'week' ? '今週' : '今月'}
          </button>
        </div>

        {/* 凡例（月ビューのドット説明・週日ビューのブロック説明） */}
        <div className="cal-legend">
          <LegendDot cls="cal-dot-open" label="空き" />
          <LegendDot cls="cal-dot-booked" label="予約済み" />
          <LegendDot cls="cal-dot-locked" label="ロック中" />
        </div>

        {/* 定休日バナー */}
        {isClosedDay && (
          <div style={{
            padding: '10px 14px',
            background: 'var(--warning-pale)',
            border: '1px solid var(--warning)',
            borderRadius: 10,
            fontSize: 12,
            color: 'var(--text-deep)',
            marginBottom: 12,
            lineHeight: 1.7,
          }}>
            この日は相談所の <strong>定休日</strong> に設定されています。それでも追加する場合は下記から登録できます。
          </div>
        )}

        {/* 操作ボタン */}
        <div className="cal-actions">
          <button
            className="kc-btn kc-btn-ghost kc-btn-sm"
            onClick={() => { if (selectedDate) { setFormInitialTime(null); setShowForm(true) } }}
            disabled={!selectedDate}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            枠を追加
          </button>
          <button
            className="kc-btn kc-btn-ghost kc-btn-sm"
            onClick={handleBulkGenerate}
            disabled={!selectedDate || bulkGenerating}
            title="面談可能時間内に60分の空き枠をまとめて作成"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4h8M2 8h6M2 6h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {bulkGenerating ? '生成中…' : 'この日の枠を一括生成'}
          </button>
        </div>

        {/* ビュー本体 */}
        {viewMode === 'month' ? (
          <MonthGrid
            year={year}
            month={month}
            slots={slots}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            closedWeekdays={agency?.closed_weekdays}
            needsReplyDates={needsReplyDates}
          />
        ) : (
          <WeekView
            weekStart={range.weekStart}
            slots={slots}
            needsReplyDates={needsReplyDates}
            closedWeekdays={agency?.closed_weekdays}
            startHour={viewStartHour}
            endHour={viewEndHour}
            daysCount={viewMode === 'day' ? 1 : 7}
            onSlotClick={handleSlotClick}
            onAddSlot={handleAddSlotFromGrid}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}
      </div>

      {/* 選択日のスロット詳細 */}
      {selectedDate && (
        <SlotDetailPanel
          date={selectedDate}
          slots={selectedSlots}
          onStatusChange={handleStatusChange}
          onMeetingTypeChange={handleMeetingTypeChange}
          onDelete={handleDelete}
          onAddNew={() => { setFormInitialTime(null); setShowForm(true) }}
          onViewReservation={(slotId) => router.push(`/reservations/by-slot/${slotId}`)}
        />
      )}

      {showForm && selectedDate && (
        <div className="kc-overlay">
          <div className="kc-modal" style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 className="kc-modal-title" style={{ margin: 0 }}>予約枠を追加</h2>
              <button onClick={() => { setShowForm(false); setFormInitialTime(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <SlotForm
              date={selectedDate}
              onAdd={handleAddSlot}
              onClose={() => { setShowForm(false); setFormInitialTime(null) }}
              loading={addingSlot}
              consultationStart={agency?.consultation_start_time}
              consultationEnd={agency?.consultation_end_time}
              slotMinutes={agency?.default_slot_minutes ?? 60}
              initialStartTime={formInitialTime}
            />
          </div>
        </div>
      )}

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}

function LegendDot({ cls, label }: { cls: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div className={`cal-dot ${cls}`} />
      <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>{label}</span>
    </div>
  )
}
