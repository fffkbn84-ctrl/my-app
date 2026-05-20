'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type BillingStatus = 'pending' | 'confirmed' | 'voided' | 'disputed'

interface BillingEventRow {
  id: string
  reservation_id: string
  agency_id: string
  counselor_id: string | null
  amount_jpy: number
  status: BillingStatus
  grace_until: string
  reservation_at: string
  void_reason: string | null
  confirmed_at: string | null
  voided_at: string | null
  dispute_note: string | null
  dispute_at: string | null
  admin_resolved_by: string | null
  admin_resolved_at: string | null
  admin_note: string | null
  created_at: string
  updated_at: string
}

type Row = BillingEventRow & {
  agency_name: string
  counselor_name: string
  user_name: string
}

const STATUS_LABEL: Record<BillingStatus, string> = {
  pending: '保留中',
  confirmed: '確定',
  voided: '無効',
  disputed: '異議申立中',
}

const STATUS_BADGE: Record<BillingStatus, string> = {
  pending: 'badge badge-draft',
  confirmed: 'badge badge-certified',
  voided: 'badge badge-listed',
  disputed: 'badge badge-locked',
}

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

const ymKey = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function AdminBillingPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BillingStatus | 'all'>('all')
  const [agencyFilter, setAgencyFilter] = useState<string>('all')
  const [monthFilter, setMonthFilter] = useState<string>('all')
  const [resolving, setResolving] = useState<Row | null>(null)
  const [decision, setDecision] = useState<'void' | 'confirm'>('void')
  const [adminNote, setAdminNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('billing_events')
      .select('*, agencies(name), counselors(name), reservations(user_name)')
      .order('created_at', { ascending: false })

    const mapped: Row[] = (data ?? []).map((r: Record<string, unknown>) => ({
      ...(r as unknown as BillingEventRow),
      agency_name: (r.agencies as { name?: string } | null)?.name ?? '—',
      counselor_name: (r.counselors as { name?: string } | null)?.name ?? '—',
      user_name: (r.reservations as { user_name?: string } | null)?.user_name ?? '—',
    }))
    setRows(mapped)
    setLoading(false)
  }

  const agencies = useMemo(() => {
    const m = new Map<string, string>()
    rows.forEach(r => m.set(r.agency_id, r.agency_name))
    return Array.from(m.entries())
  }, [rows])

  const months = useMemo(() => {
    const s = new Set<string>()
    rows.forEach(r => s.add(ymKey(r.created_at)))
    return Array.from(s).sort().reverse()
  }, [rows])

  const filtered = useMemo(() => rows.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (agencyFilter !== 'all' && r.agency_id !== agencyFilter) return false
    if (monthFilter !== 'all' && ymKey(r.created_at) !== monthFilter) return false
    return true
  }), [rows, filter, agencyFilter, monthFilter])

  const stats = useMemo(() => {
    const sum = (s: BillingStatus) =>
      filtered.filter(r => r.status === s).reduce((a, r) => a + r.amount_jpy, 0)
    return {
      confirmed: sum('confirmed'),
      pending: sum('pending'),
      voided: sum('voided'),
      disputed: filtered.filter(r => r.status === 'disputed').length,
    }
  }, [filtered])

  // 相談所別の確定額
  const byAgency = useMemo(() => {
    const m = new Map<string, { name: string; confirmed: number; pending: number; disputed: number; count: number }>()
    filtered.forEach(r => {
      const prev = m.get(r.agency_id) ?? { name: r.agency_name, confirmed: 0, pending: 0, disputed: 0, count: 0 }
      prev.count += 1
      if (r.status === 'confirmed') prev.confirmed += r.amount_jpy
      if (r.status === 'pending') prev.pending += r.amount_jpy
      if (r.status === 'disputed') prev.disputed += 1
      m.set(r.agency_id, prev)
    })
    return Array.from(m.entries()).map(([id, v]) => ({ id, ...v })).sort((a, b) => b.confirmed - a.confirmed)
  }, [filtered])

  const resolve = async () => {
    if (!resolving) return
    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.rpc('resolve_billing_dispute', {
      p_event_id: resolving.id,
      p_decision: decision,
      p_admin_note: adminNote,
    })
    setSubmitting(false)
    if (error) { alert(`解決に失敗しました: ${error.message}`); return }
    setResolving(null); setAdminNote(''); setDecision('void')
    await load()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">課金管理</h1>
      </div>

      {/* 統計サマリー */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <Stat label="確定額" value={yen(stats.confirmed)} accent />
        <Stat label="保留中（見込み）" value={yen(stats.pending)} />
        <Stat label="無効額" value={yen(stats.voided)} muted />
        <Stat label="異議申立中" value={`${stats.disputed} 件`} warn={stats.disputed > 0} />
      </div>

      {/* フィルター */}
      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <select className="form-select" value={filter} onChange={e => setFilter(e.target.value as BillingStatus | 'all')} style={{ minWidth: 140 }}>
          <option value="all">すべての状態</option>
          {(['pending', 'confirmed', 'voided', 'disputed'] as const).map(s => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <select className="form-select" value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)} style={{ minWidth: 200 }}>
          <option value="all">すべての相談所</option>
          {agencies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        <select className="form-select" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} style={{ minWidth: 140 }}>
          <option value="all">すべての月</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>{filtered.length} 件</div>
      </div>

      {/* 相談所別集計 */}
      {byAgency.length > 0 && (
        <div className="card" style={{ marginBottom: 20, padding: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }}>
            相談所別 集計
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>相談所</th>
                  <th style={{ textAlign: 'right' }}>確定額</th>
                  <th style={{ textAlign: 'right' }}>保留中</th>
                  <th style={{ textAlign: 'right' }}>件数</th>
                  <th style={{ textAlign: 'right' }}>異議</th>
                </tr>
              </thead>
              <tbody>
                {byAgency.map(a => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{yen(a.confirmed)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--muted)' }}>{yen(a.pending)}</td>
                    <td style={{ textAlign: 'right' }}>{a.count}</td>
                    <td style={{ textAlign: 'right', color: a.disputed > 0 ? 'var(--danger)' : 'var(--muted)' }}>{a.disputed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 明細 */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">該当する課金イベントはありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>予約日</th>
                  <th>面談予定</th>
                  <th>相談所</th>
                  <th>カウンセラー</th>
                  <th>利用者</th>
                  <th>状態</th>
                  <th style={{ textAlign: 'right' }}>金額</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{fmt(r.created_at)}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(r.reservation_at)}</td>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{r.agency_name}</td>
                    <td style={{ fontSize: 13 }}>{r.counselor_name}</td>
                    <td style={{ fontSize: 13 }}>{r.user_name}</td>
                    <td><span className={STATUS_BADGE[r.status]}>{STATUS_LABEL[r.status]}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      <span style={{
                        textDecoration: r.status === 'voided' ? 'line-through' : 'none',
                        color: r.status === 'voided' ? 'var(--muted)' : 'inherit',
                      }}>{yen(r.amount_jpy)}</span>
                    </td>
                    <td>
                      {r.status === 'disputed' ? (
                        <button className="btn btn-sm btn-primary" onClick={() => { setResolving(r); setDecision('void'); setAdminNote('') }}>
                          解決する
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {resolving && (
        <div className="modal-overlay" onClick={() => setResolving(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">異議の解決</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.7 }}>
              {resolving.agency_name} / {resolving.counselor_name}<br />
              面談予定: {fmt(resolving.reservation_at)}（{yen(resolving.amount_jpy)}）
            </div>
            <div style={{ background: 'var(--bg)', padding: '10px 12px', borderRadius: 6, fontSize: 12, marginBottom: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>相談所側の異議内容:</div>
              {resolving.dispute_note ?? '（なし）'}
            </div>

            <label className="form-label">判定</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input type="radio" name="decision" checked={decision === 'void'} onChange={() => setDecision('void')} />
                無効化（請求しない）
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input type="radio" name="decision" checked={decision === 'confirm'} onChange={() => setDecision('confirm')} />
                確定維持（請求する）
              </label>
            </div>

            <label className="form-label">運営メモ</label>
            <textarea
              className="form-textarea"
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              rows={4}
              placeholder="判断理由・相談所への通知メッセージなど"
            />

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={() => setResolving(null)} disabled={submitting}>キャンセル</button>
              <button className="btn btn-primary" onClick={resolve} disabled={submitting}>
                {submitting ? '処理中...' : '確定する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, accent, muted, warn }: { label: string; value: string; accent?: boolean; muted?: boolean; warn?: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{
        color: warn ? 'var(--danger)' : accent ? 'var(--accent)' : muted ? 'var(--muted)' : undefined,
      }}>{value}</div>
    </div>
  )
}
