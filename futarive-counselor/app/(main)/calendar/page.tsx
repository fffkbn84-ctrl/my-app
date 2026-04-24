'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Slot } from '@/lib/types'
import MonthGrid from '@/components/calendar/MonthGrid'
import SlotDetailPanel from '@/components/calendar/SlotDetailPanel'
import SlotForm from '@/components/calendar/SlotForm'

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(
    today.toISOString().slice(0, 10)
  )
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [addingSlot, setAddingSlot] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const loadSlots = useCallback(async (c: Counselor, y: number, m: number) => {
    const supabase = createClient()
    const from = `${y}-${String(m + 1).padStart(2, '0')}-01`
    const lastDay = new Date(y, m + 1, 0).getDate()
    const to = `${y}-${String(m + 1).padStart(2, '0')}-${lastDay}`
    const { data } = await supabase
      .from('slots')
      .select('*')
      .eq('counselor_id', c.id)
      .gte('start_time', from)
      .lte('start_time', to + 'T23:59:59')
      .order('start_time')
    setSlots((data as Slot[]) ?? [])
  }, [])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: c } = await supabase.from('counselors').select('*').eq('owner_user_id', user.id).maybeSingle()
      if (c) {
        setCounselor(c as Counselor)
        await loadSlots(c as Counselor, year, month)
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
    if (!counselor) { showToast('カウンセラー情報が読み込めていません'); return }
    if (startTime >= endTime) { showToast('終了時刻は開始時刻より後にしてください'); return }
    setAddingSlot(true)
    const supabase = createClient()
    const { data: inserted, error } = await supabase.from('slots').insert({
      counselor_id: counselor.id,
      start_time: startTime,
      end_time: endTime,
      status: 'open',
    }).select().maybeSingle()
    setAddingSlot(false)
    if (error) {
      console.error('[slot add] error', error)
      showToast(`追加失敗：${error.message}`)
      return
    }
    if (inserted) {
      setSlots(prev => [...prev, inserted as Slot].sort((a, b) => a.start_time.localeCompare(b.start_time)))
    }
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
    ? slots.filter(s => s.start_time.slice(0, 10) === selectedDate)
    : []

  const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

  return (
    <div style={{ padding: '28px 24px', maxWidth: 700, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>CALENDAR</div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>予約枠管理</h1>

      <div className="kc-card" style={{ padding: 20 }}>
        {/* カレンダーヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={prevMonth} className="kc-btn kc-btn-ghost kc-btn-sm" style={{ padding: '6px 10px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              color: 'var(--text-deep)',
              minWidth: 80,
              textAlign: 'center',
            }}>
              {year}年 {MONTH_NAMES[month]}
            </span>
            <button onClick={nextMonth} className="kc-btn kc-btn-ghost kc-btn-sm" style={{ padding: '6px 10px' }}>
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
        <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
          <LegendDot cls="cal-dot-open" label="空き" />
          <LegendDot cls="cal-dot-booked" label="予約済み" />
          <LegendDot cls="cal-dot-locked" label="ロック中" />
        </div>

        {/* 一括操作ボタン */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
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
        </div>

        <MonthGrid
          year={year}
          month={month}
          slots={slots}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
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
