'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { BillingEvent, BillingStatus } from '@/lib/types-billing'

type Row = BillingEvent & {
  user_name: string | null
  counselor_name: string | null
}

const STATUS_LABEL: Record<BillingStatus, string> = {
  pending: '保留中',
  confirmed: '確定',
  voided: '無効',
  disputed: '異議申立中',
}

const STATUS_HINT: Record<BillingStatus, string> = {
  pending: '面談時刻 +24h 経過で自動確定',
  confirmed: '請求対象',
  voided: '課金対象外',
  disputed: '運営が確認中',
}

const STATUS_COLOR: Record<BillingStatus, { bg: string; fg: string }> = {
  pending:   { bg: 'var(--accent-pale)',   fg: 'var(--accent-deep)' },
  confirmed: { bg: '#FCEFE3',              fg: '#7A4A1F' },
  voided:    { bg: '#EEEAE2',              fg: 'var(--text-mid)' },
  disputed:  { bg: '#F5E3DF',              fg: 'var(--danger)' },
}

const VOID_REASON_LABEL: Record<string, string> = {
  user_cancel_within_grace: 'ユーザー取消（24h以内）',
  agency_cancel: '相談所都合キャンセル',
  admin_resolved_dispute: '運営が異議を認定',
}

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

export default function BillingPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BillingStatus | 'all'>('all')
  const [disputeFor, setDisputeFor] = useState<Row | null>(null)
  const [disputeNote, setDisputeNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2800) }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data, error } = await supabase
        .from('billing_events')
        .select('*, reservations(user_name), counselors(name)')
        .order('created_at', { ascending: false })

      if (error) {
        showToast('読み込みに失敗しました')
        setLoading(false)
        return
      }

      const mapped: Row[] = (data ?? []).map((r: Record<string, unknown>) => ({
        ...(r as unknown as BillingEvent),
        user_name: (r.reservations as { user_name?: string } | null)?.user_name ?? null,
        counselor_name: (r.counselors as { name?: string } | null)?.name ?? null,
      }))

      setRows(mapped)
      setLoading(false)
    }
    load()
  }, [])

  const counts = useMemo(() => {
    const c: Record<BillingStatus | 'all', number> = { all: rows.length, pending: 0, confirmed: 0, voided: 0, disputed: 0 }
    rows.forEach(r => { c[r.status] += 1 })
    return c
  }, [rows])

  const totals = useMemo(() => {
    const confirmed = rows.filter(r => r.status === 'confirmed').reduce((a, r) => a + r.amount_jpy, 0)
    const paid      = rows.filter(r => r.status === 'confirmed' && r.paid_at).reduce((a, r) => a + r.amount_jpy, 0)
    const unpaid    = rows.filter(r => r.status === 'confirmed' && !r.paid_at).reduce((a, r) => a + r.amount_jpy, 0)
    const pending   = rows.filter(r => r.status === 'pending').reduce((a, r) => a + r.amount_jpy, 0)
    return { confirmed, paid, unpaid, pending }
  }, [rows])

  const filtered = filter === 'all' ? rows : rows.filter(r => r.status === filter)

  const submitDispute = async () => {
    if (!disputeFor) return
    if (disputeNote.trim().length < 5) { showToast('理由を5文字以上入力してください'); return }

    setSubmitting(true)
    const supabase = createClient()
    const { data, error } = await supabase.rpc('submit_billing_dispute', {
      p_event_id: disputeFor.id,
      p_note: disputeNote.trim(),
    })
    setSubmitting(false)

    if (error) { showToast(error.message); return }
    const updated = data as BillingEvent
    setRows(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r))
    setDisputeFor(null)
    setDisputeNote('')
    showToast('異議を送信しました')
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

  return (
    <div style={{ padding: '28px 24px', maxWidth: 980, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>BILLING</div>
      <h1 className="page-title">Kinda 請求履歴</h1>

      <div style={{
        marginTop: 14,
        marginBottom: 18,
        padding: '14px 16px',
        background: 'var(--card-warm, #F7F4EF)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 10,
      }}>
        <div style={{ fontSize: 13, color: 'var(--text-deep)', lineHeight: 1.7 }}>
          Kinda は予約成立ごとに <strong>¥5,000 の集客代行費（送客料）</strong>をいただいています。
          このページでは過去の請求履歴と保留中の見込み額を確認できます。
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
          ※ 予約成立から24時間以内のユーザー取消は <strong>無料</strong>です。それ以降の取消・当日キャンセルは確定（請求対象）となります。初期費用・月額費用は不要で、成果報酬のみ。
          <br />
          ※ ユーザーが来られないなど、当日に面談を実施できなかった場合は、確認のうえ<strong>請求いたしません</strong>。お手数ですが{' '}
          <a href="mailto:hello@kinda.jp" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>お問い合わせ</a>
          {' '}よりご連絡ください。
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12, marginBottom: 20,
      }}>
        <SumCard label="今月の確定請求額" value={yen(totals.confirmed)} accent />
        <SumCard label="うち支払い済み" value={yen(totals.paid)} />
        <SumCard label="お支払い待ち" value={yen(totals.unpaid)} />
        <SumCard label="保留中（見込み）" value={yen(totals.pending)} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {(['all', 'pending', 'confirmed', 'voided', 'disputed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="kc-btn kc-btn-sm"
            style={{
              background: filter === f ? 'var(--accent)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-mid)',
              border: '1px solid var(--border)',
            }}
          >
            {f === 'all' ? 'すべて' : STATUS_LABEL[f]} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="kc-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-light)', fontSize: 13 }}>
          該当する請求はありません
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => <BillingRow key={r.id} row={r} onDispute={() => { setDisputeFor(r); setDisputeNote('') }} />)}
        </div>
      )}

      {disputeFor && (
        <DisputeModal
          row={disputeFor}
          note={disputeNote}
          submitting={submitting}
          onChangeNote={setDisputeNote}
          onClose={() => { setDisputeFor(null); setDisputeNote('') }}
          onSubmit={submitDispute}
        />
      )}

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}

function SumCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="kc-card" style={{ padding: '14px 18px' }}>
      <div style={{ fontSize: 10, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 600,
        fontSize: 22,
        marginTop: 4,
        color: accent ? 'var(--accent-deep)' : 'var(--text-deep)',
      }}>{value}</div>
    </div>
  )
}

function BillingRow({ row, onDispute }: { row: Row; onDispute: () => void }) {
  const color = STATUS_COLOR[row.status]
  const canDispute = (row.status === 'pending' || row.status === 'confirmed') && !row.dispute_at
  const isPaid = row.status === 'confirmed' && !!row.paid_at

  return (
    <div className="kc-card" style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
              background: color.bg, color: color.fg,
            }}>{STATUS_LABEL[row.status]}</span>
            {isPaid && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                background: '#DCFCE7', color: '#166534',
              }}>✓ 支払い済み</span>
            )}
            {row.status === 'confirmed' && !row.paid_at && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                background: '#FEF3E2', color: '#C2410C',
              }}>お支払い待ち</span>
            )}
            <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{STATUS_HINT[row.status]}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-deep)', fontWeight: 500 }}>
            {row.counselor_name ?? '担当未設定'} ／ {row.user_name ?? '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>
            面談予定: {fmt(row.reservation_at)} ・ 予約日: {fmt(row.created_at)}
          </div>
          {isPaid && (
            <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 4 }}>
              支払い日: {fmt(row.paid_at)}
              {row.invoice_number && <> ・ 請求書番号: {row.invoice_number}</>}
            </div>
          )}
          {row.status === 'voided' && row.void_reason && (
            <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 4 }}>
              理由: {VOID_REASON_LABEL[row.void_reason] ?? row.void_reason}
            </div>
          )}
          {row.status === 'disputed' && row.dispute_note && (
            <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, padding: '6px 10px', background: 'var(--bg-elev)', borderRadius: 6 }}>
              異議内容: {row.dispute_note}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 18,
            color: row.status === 'voided' ? 'var(--text-light)' : 'var(--text-deep)',
            textDecoration: row.status === 'voided' ? 'line-through' : 'none',
          }}>{yen(row.amount_jpy)}</div>
          {canDispute && (
            <button onClick={onDispute} className="kc-btn kc-btn-ghost kc-btn-sm" style={{ marginTop: 6 }}>
              異議を申し立てる
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function DisputeModal({
  row, note, submitting, onChangeNote, onClose, onSubmit,
}: {
  row: Row
  note: string
  submitting: boolean
  onChangeNote: (v: string) => void
  onClose: () => void
  onSubmit: () => void
}) {
  return (
    <div className="kc-overlay" onClick={onClose}>
      <div className="kc-modal" onClick={e => e.stopPropagation()}>
        <div className="kc-modal-title">異議を申し立てる</div>
        <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 14 }}>
          {row.counselor_name ?? '—'} / {fmt(row.reservation_at)} の課金（{yen(row.amount_jpy)}）について、無効化を希望する理由を入力してください。<br />
          ふたりへ運営が内容を確認し、承認された場合は課金が取り消されます。
        </p>
        <label className="kc-label">理由</label>
        <textarea
          className="kc-textarea"
          value={note}
          onChange={e => onChangeNote(e.target.value)}
          rows={5}
          placeholder="例: 利用者から急病連絡が前日にあり、相談所側も振替提案で合意済みでした。"
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button onClick={onClose} className="kc-btn kc-btn-ghost" disabled={submitting}>キャンセル</button>
          <button onClick={onSubmit} className="kc-btn kc-btn-primary" disabled={submitting || note.trim().length < 5}>
            {submitting ? '送信中...' : '送信する'}
          </button>
        </div>
      </div>
    </div>
  )
}
