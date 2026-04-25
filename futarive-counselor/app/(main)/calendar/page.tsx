'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Counselor, Slot, Agency } from '@/lib/types'
import MonthGrid from '@/components/calendar/MonthGrid'
import SlotDetailPanel from '@/components/calendar/SlotDetailPanel'
import SlotForm from '@/components/calendar/SlotForm'

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

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(
    today.toISOString().slice(0, 10)
  )
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [agency, setAgency] = useState<Agency | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [addingSlot, setAddingSlot] = useState(false)
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string, durationMs = 2500) => { setToast(msg); setTimeout(() => setToast(''), durationMs) }

  const loadSlots = useCallback(async (c: Counselor, y: number, m: number) => {
    const supabase = createClient()
    const from = `${y}-${String(m + 1).padStart(2, '0')}-01`
    const lastDay = new Date(y, m + 1, 0).getDate()
    const to = `${y}-${String(m + 1).padStart(2, '0')}-${lastDay}`
    const { data } = await supabase
      .from('slots')
      .select('*')
      .eq('counselor_id', c.id)
      .gte('start_at', from)
      .lte('start_at', to + 'T23:59:59')
      .order('start_at')
    setSlots((data as Slot[]) ?? [])
  }, [])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1) 自分がカウンセラー本人として持っている行
      let c: Counselor | null = null
      const { data: own } = await supabase
        .from('counselors').select('*').eq('owner_user_id', user.id).maybeSingle()
      if (own) c = own as Counselor

      // 2) なければ、自分がオーナーの相談所に所属する最初のカウンセラー
      if (!c) {
        const { data: agencies } = await supabase
          .from('agencies').select('id').eq('owner_user_id', user.id)
        const agencyIds = ((agencies as { id: string }[] | null) ?? []).map(a => a.id)
        if (agencyIds.length > 0) {
          const { data: rows } = await supabase
            .from('counselors').select('*')
            .in('agency_id', agencyIds)
            .order('created_at', { ascending: true })
            .limit(1)
          if (rows && rows[0]) c = rows[0] as Counselor
        }
      }

      if (c) {
        setCounselor(c)
        await loadSlots(c, year, month)
        // 所属相談所もロード（営業時間・定休日を取得）
        if (c.agency_id) {
          const { data: ag } = await supabase
            .from('agencies').select('*').eq('id', c.agency_id).maybeSingle()
          if (ag) setAgency(ag as Agency)
        }
      }
      setLoading(false)
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (counselor) loadSlots(counselor, year, month)
  }, [counselor, year, month, loadSlots])

  // Realtime購読
  useEffect(() => {
    if (!counselor) return
    const supabase = createClient()
    const channel = supabase
      .channel('slots-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slots', filter: `counselor_id=eq.${counselor.id}` }, () => {
        loadSlots(counselor, year, month)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [counselor, year, month, loadSlots])

  const handleAddSlot = async (startTime: string, endTime: string) => {
    if (!counselor) { showToast('カウンセラー情報が読み込めていません', 5000); return }
    if (startTime >= endTime) { showToast('終了時刻は開始時刻より後にしてください', 4000); return }
    setAddingSlot(true)
    const supabase = createClient()
    const payload = {
      counselor_id: counselor.id,
      start_at: startTime,
      end_at: endTime,
      status: 'open' as const,
    }
    console.log('[slot add] payload', payload)
    const { data: inserted, error } = await supabase.from('slots').insert(payload).select().maybeSingle()

    setAddingSlot(false)
    if (error) {
      console.error('[slot add] full error object', error)
      const code = error.code ? `[${error.code}] ` : ''
      showToast(`追加失敗：${code}${describeError(error)}`, 7000)
      return
    }
    if (!inserted) {
      console.warn('[slot add] no row returned (possibly RLS read block)')
      showToast('追加できたか確認できませんでした。一覧を再読み込みします', 5000)
      if (counselor) await loadSlots(counselor, year, month)
      setShowForm(false)
      return
    }
    setSlots(prev => [...prev, inserted as Slot].sort((a, b) => a.start_at.localeCompare(b.start_at)))
    setShowForm(false)
    showToast('予約枠を追加しました')
  }

  const handleStatusChange = async (slotId: string, status: Slot['status']) => {
    const supabase = createClient()
    await supabase.from('slots').update({ status }).eq('id', slotId)
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status } : s))
  }

  const handleDelete = async (slotId: string) => {
    const supabase = createClient()
    await supabase.from('slots').delete().eq('id', slotId)
    setSlots(prev => prev.filter(s => s.id !== slotId))
    showToast('予約枠を削除しました')
  }

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const selectedSlots = selectedDate
    ? slots.filter(s => {
        const dt = new Date(s.start_at)
        const local = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
        return local === selectedDate
      })
    : []

  // 選択日の曜日が定休日か
  const isClosedDay = (() => {
    if (!selectedDate || !agency?.closed_weekdays || agency.closed_weekdays.length === 0) return false
    const [y, m, d] = selectedDate.split('-').map(Number)
    const dow = new Date(y, m - 1, d).getDay() // 0=日 ... 6=土
    return agency.closed_weekdays.includes(dow)
  })()

  // 面談可能時間帯で agency 設定の所要時間スロットを一括生成
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

    // 既存のその日のスロット（重複回避）
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

  const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

  return (
    <div style={{ padding: '28px 24px', maxWidth: 700, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>CALENDAR</div>
      <h1 className="page-title" style={{ marginBottom: 12 }}>予約枠管理</h1>
      {agency?.business_hours_text && (
        <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 18, lineHeight: 1.7 }}>
          営業時間：{agency.business_hours_text}
        </p>
      )}

      <div className="kc-card cal-wrap" style={{ padding: 20 }}>
        {/* カレンダーヘッダー */}
        <div className="cal-header">
          <div className="cal-header-nav">
            <button onClick={prevMonth} className="kc-btn kc-btn-ghost kc-btn-sm" aria-label="前月">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="cal-header-month">
              {year}年 {MONTH_NAMES[month]}
            </span>
            <button onClick={nextMonth} className="kc-btn kc-btn-ghost kc-btn-sm" aria-label="翌月">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <button
            className="kc-btn kc-btn-ghost kc-btn-sm"
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()) }}
          >
            今月
          </button>
        </div>

        {/* 凡例 */}
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

        {/* 一括操作ボタン（凡例の下に独立配置） */}
        <div className="cal-actions">
          <button
            className="kc-btn kc-btn-ghost kc-btn-sm"
            onClick={() => { if (selectedDate) setShowForm(true) }}
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

        <MonthGrid
          year={year}
          month={month}
          slots={slots}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          closedWeekdays={agency?.closed_weekdays}
        />
      </div>

      {/* 選択日のスロット詳細 */}
      {selectedDate && (
        <SlotDetailPanel
          date={selectedDate}
          slots={selectedSlots}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAddNew={() => setShowForm(true)}
        />
      )}

      {/* 枠追加モーダル */}
      {showForm && selectedDate && (
        <div className="kc-overlay">
          <div className="kc-modal" style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 className="kc-modal-title" style={{ margin: 0 }}>予約枠を追加</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <SlotForm
              date={selectedDate}
              onAdd={handleAddSlot}
              onClose={() => setShowForm(false)}
              loading={addingSlot}
              consultationStart={agency?.consultation_start_time}
              consultationEnd={agency?.consultation_end_time}
              slotMinutes={agency?.default_slot_minutes ?? 60}
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
