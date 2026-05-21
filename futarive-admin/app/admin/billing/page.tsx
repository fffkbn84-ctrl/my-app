'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type BillingStatus = 'pending' | 'confirmed' | 'voided' | 'disputed'
type PaymentMethod = 'bank_transfer' | 'card' | 'other'

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
  paid_at: string | null
  invoice_number: string | null
  payment_method: PaymentMethod | null
  payment_note: string | null
  created_at: string
  updated_at: string
}

type Row = BillingEventRow & {
  agency_name: string
  counselor_name: string
  user_name: string
  user_note: string | null
  agency_message: string | null
  agency_message_at: string | null
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

type PaymentFilter = 'all' | 'unpaid' | 'paid'

export default function AdminBillingPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BillingStatus | 'all'>('all')
  const [agencyFilter, setAgencyFilter] = useState<string>('all')
  const [monthFilter, setMonthFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all')
  const [resolving, setResolving] = useState<Row | null>(null)
  const [decision, setDecision] = useState<'void' | 'confirm'>('void')
  const [adminNote, setAdminNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 支払い確認モーダル
  const [paying, setPaying] = useState<Row | null>(null)
  const [payForm, setPayForm] = useState<{
    invoice_number: string
    payment_method: PaymentMethod
    payment_note: string
  }>({ invoice_number: '', payment_method: 'bank_transfer', payment_note: '' })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('billing_events')
      .select('*, agencies(name), counselors(name), reservations(user_name, notes, agency_message, agency_message_at)')
      .order('created_at', { ascending: false })

    const mapped: Row[] = (data ?? []).map((r: Record<string, unknown>) => {
      const reservation = r.reservations as {
        user_name?: string
        notes?: string | null
        agency_message?: string | null
        agency_message_at?: string | null
      } | null
      return {
        ...(r as unknown as BillingEventRow),
        agency_name: (r.agencies as { name?: string } | null)?.name ?? '—',
        counselor_name: (r.counselors as { name?: string } | null)?.name ?? '—',
        user_name: reservation?.user_name ?? '—',
        user_note: reservation?.notes ?? null,
        agency_message: reservation?.agency_message ?? null,
        agency_message_at: reservation?.agency_message_at ?? null,
      }
    })
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
    if (paymentFilter === 'paid' && !r.paid_at) return false
    if (paymentFilter === 'unpaid' && (r.status !== 'confirmed' || r.paid_at)) return false
    return true
  }), [rows, filter, agencyFilter, monthFilter, paymentFilter])

  const stats = useMemo(() => {
    const sum = (s: BillingStatus) =>
      filtered.filter(r => r.status === s).reduce((a, r) => a + r.amount_jpy, 0)
    const paid = filtered.filter(r => r.status === 'confirmed' && r.paid_at).reduce((a, r) => a + r.amount_jpy, 0)
    const unpaid = filtered.filter(r => r.status === 'confirmed' && !r.paid_at).reduce((a, r) => a + r.amount_jpy, 0)
    return {
      confirmed: sum('confirmed'),
      pending: sum('pending'),
      paid,
      unpaid,
      disputed: filtered.filter(r => r.status === 'disputed').length,
    }
  }, [filtered])

  const byAgency = useMemo(() => {
    const m = new Map<string, { name: string; confirmed: number; paid: number; unpaid: number; pending: number; disputed: number; count: number }>()
    filtered.forEach(r => {
      const prev = m.get(r.agency_id) ?? { name: r.agency_name, confirmed: 0, paid: 0, unpaid: 0, pending: 0, disputed: 0, count: 0 }
      prev.count += 1
      if (r.status === 'confirmed') {
        prev.confirmed += r.amount_jpy
        if (r.paid_at) prev.paid += r.amount_jpy
        else prev.unpaid += r.amount_jpy
      }
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

  // 月次の請求書番号を自動生成（例: INV-2026-05-{agency_short_id}）
  const suggestInvoiceNumber = (r: Row) => {
    const d = new Date(r.confirmed_at ?? r.reservation_at)
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const shortAgency = r.agency_id.slice(0, 8)
    return `INV-${ym}-${shortAgency}`
  }

  const openPayModal = (r: Row) => {
    setPaying(r)
    setPayForm({
      invoice_number: r.invoice_number ?? suggestInvoiceNumber(r),
      payment_method: r.payment_method ?? 'bank_transfer',
      payment_note: r.payment_note ?? '',
    })
  }

  const markPaid = async () => {
    if (!paying) return
    if (!payForm.invoice_number.trim()) { alert('請求書番号を入力してください'); return }
    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.rpc('mark_billing_paid', {
      p_event_id: paying.id,
      p_invoice_number: payForm.invoice_number.trim(),
      p_payment_method: payForm.payment_method,
      p_payment_note: payForm.payment_note.trim() || null,
    })
    setSubmitting(false)
    if (error) { alert(`支払い確認に失敗しました: ${error.message}`); return }
    setPaying(null)
    await load()
  }

  const unmarkPaid = async (r: Row) => {
    if (!confirm(`「${r.agency_name} / ${yen(r.amount_jpy)}」の支払い済み状態を取り消しますか？`)) return
    const supabase = createClient()
    const { error } = await supabase.rpc('unmark_billing_paid', { p_event_id: r.id })
    if (error) { alert(`取り消しに失敗しました: ${error.message}`); return }
    await load()
  }

  // 月次請求書を発行（agency × 月）
  // - 月フィルター未指定の場合は今月を対象
  // - 該当月の confirmed events に invoice_number を一括付与（assign_monthly_invoice RPC）
  // - その後、印刷用ページを別タブで開く
  //
  // Safari popup blocker 対策:
  // async await の後に window.open() を呼ぶとユーザーアクションのコンテキストが
  // 切れて popup blocker が発火する。confirm 直後に空タブを開いておき、
  // RPC 成功後に location.href で navigate する。
  const issueMonthlyInvoice = async (targetAgencyId: string, agencyName: string) => {
    const now = new Date()
    const ym = monthFilter !== 'all' ? monthFilter : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const [year, month] = ym.split('-').map(Number)

    if (!confirm(`${agencyName} の ${year}年${month}月 分の請求書を発行します。\n（未付与の confirmed イベントに請求書番号を一括付与します）`)) return

    // ★ confirm を通った直後＝ユーザーアクションのコンテキスト内で空タブを開く
    const newTab = window.open('about:blank', '_blank')

    const invoiceNumber = `INV-${year}-${String(month).padStart(2, '0')}-${targetAgencyId.slice(0, 8)}`

    const supabase = createClient()
    const { error } = await supabase.rpc('assign_monthly_invoice', {
      p_agency_id: targetAgencyId,
      p_year: year,
      p_month: month,
      p_invoice_number: invoiceNumber,
    })
    if (error) {
      newTab?.close()
      alert(`請求書発行に失敗しました: ${error.message}`)
      return
    }

    const invoiceUrl = `/admin/billing/invoice/${targetAgencyId}/${ym}`
    if (newTab) {
      newTab.location.href = invoiceUrl
    } else {
      // popup blocker でタブが開けなかった場合は同タブで開く
      window.location.href = invoiceUrl
    }
    await load()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">課金管理</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <Stat label="確定額" value={yen(stats.confirmed)} accent />
        <Stat label="うち支払い済み" value={yen(stats.paid)} />
        <Stat label="未払い（確定）" value={yen(stats.unpaid)} warn={stats.unpaid > 0} />
        <Stat label="保留中（見込み）" value={yen(stats.pending)} muted />
        <Stat label="異議申立中" value={`${stats.disputed} 件`} warn={stats.disputed > 0} />
      </div>

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
        <select className="form-select" value={paymentFilter} onChange={e => setPaymentFilter(e.target.value as PaymentFilter)} style={{ minWidth: 140 }}>
          <option value="all">支払い状況：すべて</option>
          <option value="unpaid">未払いのみ（確定済）</option>
          <option value="paid">支払い済みのみ</option>
        </select>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>{filtered.length} 件</div>
      </div>

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
                  <th style={{ textAlign: 'right' }}>支払い済み</th>
                  <th style={{ textAlign: 'right' }}>未払い</th>
                  <th style={{ textAlign: 'right' }}>件数</th>
                  <th style={{ textAlign: 'right' }}>異議</th>
                  <th>請求書</th>
                </tr>
              </thead>
              <tbody>
                {byAgency.map(a => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{yen(a.confirmed)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--accent)' }}>{yen(a.paid)}</td>
                    <td style={{ textAlign: 'right', color: a.unpaid > 0 ? 'var(--danger)' : 'var(--muted)', fontWeight: a.unpaid > 0 ? 600 : 400 }}>
                      {yen(a.unpaid)}
                    </td>
                    <td style={{ textAlign: 'right' }}>{a.count}</td>
                    <td style={{ textAlign: 'right', color: a.disputed > 0 ? 'var(--danger)' : 'var(--muted)' }}>{a.disputed}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => issueMonthlyInvoice(a.id, a.name)}
                        disabled={a.confirmed === 0}
                        title={a.confirmed === 0 ? '確定額が無いため発行できません' : `${a.name} の請求書を発行`}
                        style={{ fontSize: 11, gap: 4 }}
                      >
                        🖨 発行
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                  <th>支払い</th>
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
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {r.status !== 'confirmed' ? (
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>
                      ) : r.paid_at ? (
                        <div>
                          <span style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: '#DCFCE7',
                            color: '#166534',
                            fontWeight: 600,
                          }}>✓ 支払い済み</span>
                          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{fmt(r.paid_at)}</div>
                          {r.invoice_number && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{r.invoice_number}</div>}
                        </div>
                      ) : (
                        <span style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 10,
                          background: '#FEE2E2',
                          color: '#991B1B',
                          fontWeight: 600,
                        }}>未払い</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {r.status === 'disputed' && (
                          <button className="btn btn-sm btn-primary" onClick={() => { setResolving(r); setDecision('void'); setAdminNote('') }}>
                            解決する
                          </button>
                        )}
                        {r.status === 'confirmed' && !r.paid_at && (
                          <button className="btn btn-sm btn-primary" onClick={() => openPayModal(r)}>
                            支払い確認
                          </button>
                        )}
                        {r.status === 'confirmed' && r.paid_at && (
                          <button className="btn btn-sm btn-ghost" onClick={() => unmarkPaid(r)} title="支払い済みを取り消す">
                            取消
                          </button>
                        )}
                        {r.status !== 'disputed' && r.status !== 'confirmed' && (
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>
                        )}
                      </div>
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
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-title">異議の解決</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.7 }}>
              <strong>{resolving.agency_name}</strong> / {resolving.counselor_name} / 利用者 {resolving.user_name}<br />
              予約日: {fmt(resolving.created_at)} ・ 面談予定: {fmt(resolving.reservation_at)} ・ 異議申立: {fmt(resolving.dispute_at)}<br />
              金額: <strong>{yen(resolving.amount_jpy)}</strong>
            </div>

            <div style={{ background: 'var(--bg)', padding: '10px 12px', borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>相談所からの異議内容</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{resolving.dispute_note ?? '（なし）'}</div>
            </div>

            {resolving.user_note && (
              <div style={{ background: '#FDF8F0', borderLeft: '3px solid var(--accent)', padding: '10px 12px', borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>利用者からの事前メッセージ</div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{resolving.user_note}</div>
              </div>
            )}

            {resolving.agency_message ? (
              <div style={{ background: '#F0F4F8', borderLeft: '3px solid #6B8FBF', padding: '10px 12px', borderRadius: 6, fontSize: 12, marginBottom: 14 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  相談所からの最後のメッセージ
                  {resolving.agency_message_at && (
                    <span style={{ fontWeight: 400, color: 'var(--muted)', marginLeft: 6 }}>（{fmt(resolving.agency_message_at)}）</span>
                  )}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{resolving.agency_message}</div>
              </div>
            ) : (
              <div style={{ background: '#FEF3E2', padding: '8px 12px', borderRadius: 6, fontSize: 11, color: '#C2410C', marginBottom: 14 }}>
                ⚠ 相談所からの連絡記録がありません
              </div>
            )}

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

      {paying && (
        <div className="modal-overlay" onClick={() => setPaying(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">支払い確認</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.7 }}>
              <strong>{paying.agency_name}</strong> / {paying.counselor_name}<br />
              面談予定: {fmt(paying.reservation_at)} ・ 金額: <strong>{yen(paying.amount_jpy)}</strong>
            </div>

            <label className="form-label">請求書番号 <span style={{ color: '#DC2626' }}>*</span></label>
            <input
              className="form-input"
              value={payForm.invoice_number}
              onChange={e => setPayForm(f => ({ ...f, invoice_number: e.target.value }))}
              placeholder="INV-YYYY-MM-..."
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, marginBottom: 14 }}>
              月次の請求書番号。同じ相談所・同じ月のイベントには同じ番号を使ってください。
            </div>

            <label className="form-label">支払い方法</label>
            <select
              className="form-select"
              value={payForm.payment_method}
              onChange={e => setPayForm(f => ({ ...f, payment_method: e.target.value as PaymentMethod }))}
              style={{ marginBottom: 14 }}
            >
              <option value="bank_transfer">銀行振込</option>
              <option value="card">クレジットカード</option>
              <option value="other">その他</option>
            </select>

            <label className="form-label">メモ（任意・運営内）</label>
            <textarea
              className="form-textarea"
              value={payForm.payment_note}
              onChange={e => setPayForm(f => ({ ...f, payment_note: e.target.value }))}
              rows={3}
              placeholder="例: 5/31 入金確認・振込手数料 ¥440 控除済み"
            />

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={() => setPaying(null)} disabled={submitting}>キャンセル</button>
              <button className="btn btn-primary" onClick={markPaid} disabled={submitting}>
                {submitting ? '処理中...' : '支払い済みにする'}
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
