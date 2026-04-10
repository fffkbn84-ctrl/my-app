'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
interface SlotRow {
  id: string
  counselor_id: string | null
  start_at: string
  end_at: string
  status: 'open' | 'locked' | 'booked'
  locked_until: string | null
  created_at: string
}

interface CounselorRow {
  id: string
  name: string
}

type SlotWithCounselor = SlotRow & { counselor_name: string }

const STATUS_OPTIONS = ['open', 'locked', 'booked'] as const

interface AddForm {
  counselorId: string
  startAt: string
  endAt: string
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

export default function SlotsPage() {
  const [slots, setSlots] = useState<SlotWithCounselor[]>([])
  const [counselors, setCounselors] = useState<CounselorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [addForm, setAddForm] = useState<AddForm>({ counselorId: '', startAt: '', endAt: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSlots()
    createClient().from('counselors').select('*').order('name').then(({ data }) => setCounselors(data ?? []))
  }, [])

  async function loadSlots() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('slots').select('*, counselors(name)').order('start_at', { ascending: false }).limit(100)
    setSlots(
      (data ?? []).map((s: Record<string, unknown>) => ({
        ...s,
        counselor_name: (s.counselors as { name?: string } | null)?.name ?? '—',
      })) as SlotWithCounselor[]
    )
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await createClient().from('slots').update({ status: status as 'open' | 'locked' | 'booked' }).eq('id', id)
    loadSlots()
  }

  function handleStartChange(v: string) {
    setAddForm(f => {
      const start = new Date(v)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const pad = (n: number) => String(n).padStart(2, '0')
      const endStr = `${end.getFullYear()}-${pad(end.getMonth()+1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`
      return { ...f, startAt: v, endAt: endStr }
    })
  }

  async function handleAdd() {
    if (!addForm.counselorId || !addForm.startAt || !addForm.endAt) return
    setSaving(true)
    await createClient().from('slots').insert({
      counselor_id: addForm.counselorId,
      start_at: new Date(addForm.startAt).toISOString(),
      end_at: new Date(addForm.endAt).toISOString(),
      status: 'open',
    })
    setSaving(false)
    setShowModal(false)
    setAddForm({ counselorId: '', startAt: '', endAt: '' })
    loadSlots()
  }

  const statusBadgeClass = (s: string) => {
    if (s === 'open') return 'badge badge-open'
    if (s === 'locked') return 'badge badge-locked'
    return 'badge badge-booked'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">スロット管理</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: 6 }}>
          <IconPlus /> スロット追加
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : slots.length === 0 ? (
          <div className="empty-state">スロットデータがありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>カウンセラー</th>
                  <th>開始日時</th>
                  <th>終了日時</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>{s.counselor_name}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(s.start_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(s.end_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <span className={statusBadgeClass(s.status)}>{s.status}</span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={s.status}
                        onChange={e => updateStatus(s.id, e.target.value)}
                        style={{ width: 'auto', minWidth: 100, fontSize: 12, padding: '4px 28px 4px 8px' }}
                      >
                        {STATUS_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">スロット追加</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">カウンセラー <span style={{ color: '#DC2626' }}>*</span></label>
                <select className="form-select" value={addForm.counselorId} onChange={e => setAddForm(f => ({ ...f, counselorId: e.target.value }))}>
                  <option value="">選択してください</option>
                  {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">開始日時 <span style={{ color: '#DC2626' }}>*</span></label>
                <input type="datetime-local" className="form-input" value={addForm.startAt} onChange={e => handleStartChange(e.target.value)} />
              </div>
              <div>
                <label className="form-label">終了日時 <span style={{ color: '#DC2626' }}>*</span></label>
                <input type="datetime-local" className="form-input" value={addForm.endAt} onChange={e => setAddForm(f => ({ ...f, endAt: e.target.value }))} />
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, fontSize: 12, color: 'var(--muted)' }}>
                ステータスは <strong>open</strong> で作成されます
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">キャンセル</button>
              <button onClick={handleAdd} className="btn btn-primary" disabled={saving || !addForm.counselorId || !addForm.startAt}>
                {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
