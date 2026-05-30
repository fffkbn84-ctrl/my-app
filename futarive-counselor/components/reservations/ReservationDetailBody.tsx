'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logPersonalDataAccess } from '@/lib/supabase/audit'
import { describeError } from '@/lib/errors'
import type { Reservation } from '@/lib/types'
import { KINDA_TYPE_LABEL, KINDA_NOTE_WEATHER, type KindaTypeKey } from '@/lib/diagnosisLabels'
import { FRONTSITE_URL } from '@/lib/config'
import { requestRescheduleAsCounselor, approveRescheduleAsCounselor } from '@/lib/reservations'

interface SlotOption {
  id: string
  start_at: string
  end_at: string
  meeting_type: string | null
}

interface Props {
  /** どちらか一方を渡す。reservationId 優先。slotId の場合は最新予約を解決して読み込む */
  reservationId?: string
  slotId?: string
}

/**
 * 予約詳細の全部入りビュー（ページ・モーダル共通の単一ソース）。
 * - 基本情報 / 事前共有の診断 / 予約者メッセージ
 * - 面談完了（口コミトークン発行）・キャンセル
 * - 日程変更の提案（カウンセラー発）・ユーザー申請の了承
 */
export default function ReservationDetailBody({ reservationId, slotId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  // メッセージ
  const [editingMessage, setEditingMessage] = useState(false)
  const [messageDraft, setMessageDraft] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSavedFlash, setMessageSavedFlash] = useState(false)

  // 面談完了 + 口コミトークン
  const [completing, setCompleting] = useState(false)
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)
  const [completedTokenInfo, setCompletedTokenInfo] = useState<{ token: string; code: string } | null>(null)

  // キャンセル
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelReasonDraft, setCancelReasonDraft] = useState('')

  // 日程変更
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [slots, setSlots] = useState<SlotOption[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [rescheduleMessage, setRescheduleMessage] = useState('')
  const [submittingReschedule, setSubmittingReschedule] = useState(false)
  const [approving, setApproving] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const supabase = createClient()
      let data: Reservation | null = null
      if (reservationId) {
        const { data: d, error: e } = await supabase
          .from('reservations').select('*').eq('id', reservationId).maybeSingle()
        if (e) { setError('予約情報の取得に失敗しました'); setLoading(false); return }
        data = d as Reservation | null
      } else if (slotId) {
        const { data: d, error: e } = await supabase
          .from('reservations').select('*').eq('slot_id', slotId)
          .order('created_at', { ascending: false }).limit(1).maybeSingle()
        if (e) { setError('予約情報の取得に失敗しました'); setLoading(false); return }
        data = d as Reservation | null
      }
      setReservation(data)
      setLoading(false)
      if (data) logPersonalDataAccess('reservations', data.id, data.user_id ?? null)
    }
    load()
  }, [reservationId, slotId])

  function generateReviewCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let s = ''
    for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
    return `TKN-${s}`
  }

  async function handleComplete() {
    if (!reservation) return
    setCompleting(true)
    setError('')
    try {
      const supabase = createClient()
      const token = reservation.review_token ?? crypto.randomUUID()
      const code = reservation.review_code ?? generateReviewCode()
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'completed', completed_at: new Date().toISOString(), review_token: token, review_code: code })
        .eq('id', reservation.id)
      if (error) throw error
      setReservation({ ...reservation, status: 'completed', review_token: token, review_code: code })
      setCompletedTokenInfo({ token, code })
      setShowCompleteConfirm(false)
    } catch (e) {
      setError('面談完了の処理に失敗しました: ' + describeError(e))
    } finally {
      setCompleting(false)
    }
  }

  async function handleCancel() {
    if (!reservation) return
    const message = cancelReasonDraft.trim()
    if (message.length === 0) {
      setError('キャンセルの際は、予約者へのメッセージ（お詫びと理由）が必須です')
      return
    }
    setCancelling(true)
    setError('')
    try {
      const supabase = createClient()
      const nowIso = new Date().toISOString()
      // メッセージはユーザーに見える agency_message に保存。cancel_reason には内部記録として残す
      const { error: upErr } = await supabase
        .from('reservations')
        .update({
          status: 'canceled',
          canceled_at: nowIso,
          cancelled_by: 'counselor',
          cancel_reason: message,
          agency_message: message,
          agency_message_at: nowIso,
        })
        .eq('id', reservation.id)
      if (upErr) throw upErr
      if (reservation.slot_id) {
        await supabase.from('slots').update({ status: 'open' }).eq('id', reservation.slot_id)
      }
      setReservation({ ...reservation, status: 'canceled', canceled_at: nowIso, cancel_reason: message, agency_message: message, agency_message_at: nowIso })
      setShowCancelConfirm(false)
      setCancelReasonDraft('')
    } catch (e) {
      setError('キャンセル処理に失敗しました: ' + describeError(e))
    } finally {
      setCancelling(false)
    }
  }

  const handleSaveMessage = async () => {
    if (!reservation) return
    const trimmed = messageDraft.trim()
    if (trimmed.length === 0) { setError('メッセージを入力してください'); return }
    setSendingMessage(true)
    setError('')
    const supabase = createClient()
    const nowIso = new Date().toISOString()
    const { error: upErr } = await supabase
      .from('reservations').update({ agency_message: trimmed, agency_message_at: nowIso }).eq('id', reservation.id)
    setSendingMessage(false)
    if (upErr) { setError(`メッセージの送信に失敗：${describeError(upErr)}`); return }
    setReservation({ ...reservation, agency_message: trimmed, agency_message_at: nowIso })
    setEditingMessage(false)
    setMessageSavedFlash(true)
    setTimeout(() => setMessageSavedFlash(false), 2500)
  }

  const loadSlots = async () => {
    if (!reservation?.counselor_id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('slots')
      .select('id, start_at, end_at, meeting_type')
      .eq('counselor_id', reservation.counselor_id)
      .eq('status', 'open')
      .gte('start_at', new Date().toISOString())
      .order('start_at')
    setSlots((data as SlotOption[]) ?? [])
  }

  const handleOpenReschedule = async () => {
    await loadSlots()
    setSelectedSlot(null)
    setRescheduleMessage('')
    setShowRescheduleModal(true)
  }

  const handleRequestReschedule = async () => {
    if (!selectedSlot || !reservation) return
    const message = rescheduleMessage.trim()
    if (message.length === 0) {
      showToast('変更をお願いする理由・お詫びのメッセージを入力してください')
      return
    }
    const slot = slots.find(s => s.id === selectedSlot)
    if (!slot) return
    setSubmittingReschedule(true)
    const supabase = createClient()
    const result = await requestRescheduleAsCounselor(supabase, reservation.id, slot.start_at, slot.end_at)
    if (result.ok) {
      // 添えるメッセージはユーザーに見える agency_message として保存
      const nowIso = new Date().toISOString()
      await supabase.from('reservations').update({ agency_message: message, agency_message_at: nowIso }).eq('id', reservation.id)
      setSubmittingReschedule(false)
      showToast('日程変更を提案しました。ユーザーの了承をお待ちください。')
      setShowRescheduleModal(false)
      setReservation(prev => prev ? {
        ...prev,
        reschedule_status: 'requested',
        reschedule_requested_by: 'counselor',
        reschedule_proposed_start: slot.start_at,
        reschedule_proposed_end: slot.end_at,
        agency_message: message,
        agency_message_at: nowIso,
      } : prev)
    } else {
      setSubmittingReschedule(false)
      showToast(result.message)
    }
  }

  const handleApprove = async () => {
    if (!reservation) return
    setApproving(true)
    const supabase = createClient()
    const result = await approveRescheduleAsCounselor(supabase, reservation.id)
    setApproving(false)
    if (result.ok) {
      showToast('日程変更を了承しました')
      router.push(`/reservations/${result.newReservationId}`)
    } else {
      showToast(result.message)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-mid)' }}>
        <div style={{ width: 18, height: 18, border: '2px solid var(--border-mid)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
        読み込み中...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (error && !reservation) {
    return <p style={{ fontSize: 13, color: 'var(--danger)', padding: '12px 14px', background: 'var(--bg-elev)', borderRadius: 10 }}>{error}</p>
  }

  if (!reservation) {
    return <p style={{ color: 'var(--text-mid)', fontSize: 14, padding: 24 }}>予約が見つかりません</p>
  }

  const fmtDateTime = (iso: string | null) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit',
    })
  }
  const statusLabel = (s: Reservation['status']) =>
    s === 'active' ? '予約中' : s === 'canceled' ? 'キャンセル済' : '面談完了'

  const isActive = reservation.status === 'active'
  const isPendingUserRequest = reservation.reschedule_status === 'requested' && reservation.reschedule_requested_by === 'user'
  const isPendingCounselorRequest = reservation.reschedule_status === 'requested' && reservation.reschedule_requested_by === 'counselor'
  const canProposeReschedule = isActive && !reservation.reschedule_status

  const slotsByDate = slots.reduce<Record<string, SlotOption[]>>((acc, slot) => {
    const dateKey = slot.start_at.slice(0, 10)
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(slot)
    return acc
  }, {})

  const displayToken = completedTokenInfo?.token ?? reservation.review_token ?? null
  const displayCode = completedTokenInfo?.code ?? reservation.review_code ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && (
        <p style={{ fontSize: 13, color: 'var(--danger)', padding: '10px 14px', background: 'var(--bg-elev)', borderRadius: 10, margin: 0 }}>
          {error}
        </p>
      )}

      {/* ユーザーから日程変更申請バナー（最優先で目立たせる） */}
      {isPendingUserRequest && (
        <div style={{ background: '#FFF8F0', border: '1px solid var(--accent)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.3"/>
              <path d="M7 4v3.5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="7" cy="10" r=".6" fill="var(--accent)"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>ユーザーから日程変更の申請があります</span>
          </div>
          {reservation.reschedule_proposed_start && (
            <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-mid)', marginRight: 8 }}>希望日時</span>
              {new Date(reservation.reschedule_proposed_start).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
              {' '}{new Date(reservation.reschedule_proposed_start).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              {reservation.reschedule_proposed_end && ` – ${new Date(reservation.reschedule_proposed_end).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`}
            </div>
          )}
          {reservation.reschedule_expires_at && (
            <div style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 14 }}>
              了承期限：{new Date(reservation.reschedule_expires_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
            </div>
          )}
          <button onClick={handleApprove} disabled={approving} className="kc-btn kc-btn-primary">
            {approving ? '処理中...' : '日程変更を了承する'}
          </button>
        </div>
      )}

      {/* カウンセラーが提案中バナー */}
      {isPendingCounselorRequest && (
        <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
            <circle cx="7" cy="7" r="6" stroke="var(--text-mid)" strokeWidth="1.3"/>
            <path d="M7 4v3l2 2" stroke="var(--text-mid)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>日程変更をユーザーに提案中</p>
            {reservation.reschedule_proposed_start && (
              <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>
                提案日時：{new Date(reservation.reschedule_proposed_start).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
                {' '}{new Date(reservation.reschedule_proposed_start).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                {reservation.reschedule_expires_at && `（了承期限：${new Date(reservation.reschedule_expires_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}）`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ステータス + 基本情報 */}
      <div className="kc-card" style={{ padding: '20px 22px' }}>
        <div style={{ marginBottom: 14 }}>
          <span className={`kc-badge kc-badge-${reservation.status === 'active' ? 'booked' : reservation.status === 'canceled' ? 'locked' : 'open'}`}>
            {statusLabel(reservation.status)}
          </span>
          {reservation.meeting_type && (
            <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-mid)' }}>{reservation.meeting_type}</span>
          )}
        </div>
        <Field label="面談日時" value={fmtDateTime(reservation.start_at)} />
        <Field label="お名前" value={reservation.user_name || '（未入力）'} />
        <Field label="メールアドレス" value={reservation.user_email || '（未入力）'} copyable />
        {reservation.user_phone && <Field label="電話番号" value={reservation.user_phone} copyable />}
        {reservation.notes && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>事前に伝えたいこと</div>
            <div style={{ fontSize: 13, color: 'var(--text-deep)', lineHeight: 1.8, padding: '10px 12px', background: 'var(--bg-elev)', borderRadius: 10, whiteSpace: 'pre-wrap' }}>
              {reservation.notes}
            </div>
          </div>
        )}
        {reservation.status === 'canceled' && reservation.cancel_reason && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>キャンセル理由</div>
            <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-elev)', borderRadius: 10 }}>
              {reservation.cancel_reason}
            </div>
          </div>
        )}
        <div style={{ fontSize: 10, color: 'var(--text-light)', paddingTop: 12, marginTop: 12, borderTop: '1px solid var(--border)', lineHeight: 1.7 }}>
          申込日時：{fmtDateTime(reservation.created_at)}
        </div>
      </div>

      {/* 事前共有の診断 */}
      {(reservation.shared_kinda_type_key || reservation.shared_kinda_note_key) && (
        <div className="kc-card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 8, letterSpacing: '.18em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
            Shared by user · 事前共有
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', margin: '0 0 10px', lineHeight: 1.7 }}>
            予約時に「担当者に伝える」を選んだ診断結果です。面談前にざっと目を通しておくとスムーズです。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reservation.shared_kinda_type_key && (
              <KindaTypeCard typeKey={reservation.shared_kinda_type_key as KindaTypeKey} diagnosedAt={reservation.shared_kinda_type_at} />
            )}
            {reservation.shared_kinda_note_key && (
              <KindaNoteCard noteKey={reservation.shared_kinda_note_key} diagnosedAt={reservation.shared_kinda_note_at} freeText={reservation.shared_kinda_note_freetext} />
            )}
          </div>
        </div>
      )}

      {/* 予約者へのメッセージ */}
      {reservation.status === 'active' && (
        <div className="kc-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="eyebrow">予約者へのメッセージ</span>
            {messageSavedFlash && <span style={{ fontSize: 10, color: 'var(--success, #7A9E87)' }}>送信しました</span>}
          </div>
          {!editingMessage && reservation.agency_message ? (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-deep)', lineHeight: 1.8, padding: '10px 12px', background: 'rgba(168,136,88,.08)', borderLeft: '3px solid var(--accent)', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                {reservation.agency_message}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{fmtDateTime(reservation.agency_message_at)} に送信済み</span>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={() => { setMessageDraft(reservation.agency_message ?? ''); setEditingMessage(true) }}>編集</button>
              </div>
            </div>
          ) : editingMessage ? (
            <div>
              <textarea
                value={messageDraft}
                onChange={e => setMessageDraft(e.target.value)}
                placeholder="例：ご質問の件、当日詳しくお話しします。お見合いの場所はこちらでご案内いたしますね。"
                style={{ width: '100%', minHeight: 100, padding: '10px 12px', fontSize: 13, lineHeight: 1.8, fontFamily: 'inherit', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--card)', color: 'var(--text-deep)', resize: 'vertical' }}
                maxLength={500}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={() => { setEditingMessage(false); setMessageDraft('') }} disabled={sendingMessage}>キャンセル</button>
                <button type="button" className="kc-btn kc-btn-primary kc-btn-sm" onClick={handleSaveMessage} disabled={sendingMessage || messageDraft.trim().length === 0}>
                  {sendingMessage ? '送信中…' : reservation.agency_message ? '更新する' : '送信する'}
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.7 }}>
                送信したメッセージは予約者のマイページに表示されます（最大500字）。後から編集可能です。
              </p>
            </div>
          ) : (
            <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={() => { setMessageDraft(''); setEditingMessage(true) }} style={{ width: '100%' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 4a1 1 0 011-1h8a1 1 0 011 1v5a1 1 0 01-1 1H6l-3 2v-2H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              予約者へメッセージを送る
            </button>
          )}
        </div>
      )}

      {/* 口コミトークン */}
      {displayToken && displayCode && (
        <div style={{ padding: '14px 16px', background: 'rgba(122,158,135,.1)', border: '1px solid rgba(122,158,135,.4)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--success)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '.16em', marginBottom: 8, fontWeight: 600 }}>
            ✓ {completedTokenInfo ? '面談完了 · 口コミトークンを発行しました' : '口コミ受付 URL（発行済み）'}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-deep)', lineHeight: 1.7, margin: '0 0 10px' }}>
            下記のリンクまたは認証コードを <b>{reservation.user_name}</b> 様にお送りください。これがあれば「面談済み口コミ」として投稿できます。
          </p>
          <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4 }}>口コミ受付 URL</div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, padding: '6px 10px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 8, wordBreak: 'break-all', userSelect: 'all' }}>
            {`${FRONTSITE_URL}/reviews/new?token=${displayToken}`}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4 }}>認証コード（手動入力用）</div>
          <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, padding: '6px 10px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, letterSpacing: '.1em', userSelect: 'all' }}>
            {displayCode}
          </div>
        </div>
      )}

      {/* 日程変更を提案 */}
      {canProposeReschedule && (
        <div className="kc-card" style={{ padding: '20px 22px' }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>日程変更（カウンセラー都合）</p>
          <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'rgba(192,122,110,.06)', border: '1px solid rgba(192,122,110,.35)', borderRadius: 10, marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M8 1.5L15 14H1L8 1.5Z" stroke="#C07A6E" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M8 6v3.4" stroke="#C07A6E" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="8" cy="11.4" r=".7" fill="#C07A6E"/>
            </svg>
            <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.8, margin: 0 }}>
              日程変更は原則、<b>ユーザーからの申請にお応えする</b>運用です。
              ユーザーはこの日時に予定を空けて待っています。
              カウンセラー都合での変更は、<b>どうしても必要な場合のみ</b>行ってください。
              お願いする際は、必ず理由とお詫びのひとことを添えます。
            </p>
          </div>
          <button onClick={handleOpenReschedule} className="kc-btn kc-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            どうしても必要な場合：日程変更をお願いする
          </button>
        </div>
      )}

      {/* 完了確認 */}
      {showCompleteConfirm && (
        <div style={{ padding: '14px 16px', background: 'var(--bg-elev)', border: '1px solid var(--accent-dim)', borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-deep)', margin: '0 0 12px', lineHeight: 1.7 }}>
            この面談を完了とマークしますか？<br/>
            <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>完了すると自動で口コミ用 URL が発行され、ご本人にお送りいただけます。</span>
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="kc-btn kc-btn-ghost kc-btn-sm" onClick={() => setShowCompleteConfirm(false)} disabled={completing}>やめる</button>
            <button className="kc-btn kc-btn-primary kc-btn-sm" onClick={handleComplete} disabled={completing}>{completing ? '処理中…' : '面談完了にする'}</button>
          </div>
        </div>
      )}

      {/* キャンセル確認 */}
      {showCancelConfirm && (
        <div style={{ padding: '14px 16px', background: 'rgba(192,122,110,.06)', border: '1px solid rgba(192,122,110,.4)', borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-deep)', margin: '0 0 10px', lineHeight: 1.7 }}>
            この予約をキャンセルしますか？<br/>
            <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>キャンセル後は予約枠が再度ご利用可能になります。ユーザーは予定を空けて待っているため、お詫びと理由を必ずお伝えください。</span>
          </p>
          <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4 }}>予約者へのメッセージ（必須・お詫びと理由。ユーザーに送信されます）</div>
          <textarea
            value={cancelReasonDraft}
            onChange={(e) => setCancelReasonDraft(e.target.value)}
            placeholder="例: 大変申し訳ありません。やむを得ない事情によりお約束した面談を実施できなくなりました。ご迷惑をおかけし誠に申し訳ございません。"
            rows={3}
            maxLength={500}
            style={{ width: '100%', fontSize: 12, padding: '8px 10px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, resize: 'vertical', fontFamily: 'inherit', marginBottom: 10, color: 'var(--text-deep)' }}
            disabled={cancelling}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="kc-btn kc-btn-ghost kc-btn-sm" onClick={() => { setShowCancelConfirm(false); setCancelReasonDraft('') }} disabled={cancelling}>やめる</button>
            <button className="kc-btn kc-btn-danger kc-btn-sm" onClick={handleCancel} disabled={cancelling || cancelReasonDraft.trim().length === 0}>{cancelling ? '処理中…' : 'キャンセルする'}</button>
          </div>
        </div>
      )}

      {/* アクション */}
      {reservation.status === 'active' && !completedTokenInfo && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="kc-btn kc-btn-primary"
            onClick={() => setShowCompleteConfirm(true)}
            disabled={completing || showCompleteConfirm || cancelling || showCancelConfirm}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7l3 3 5-6" />
            </svg>
            面談完了にする
          </button>
          <button
            className="kc-btn kc-btn-ghost"
            onClick={() => setShowCancelConfirm(true)}
            disabled={completing || showCompleteConfirm || cancelling || showCancelConfirm}
            style={{ color: '#C07A6E', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            予約をキャンセル
          </button>
        </div>
      )}

      {/* 日程変更モーダル（空き枠ピッカー） */}
      {showRescheduleModal && (
        <div className="kc-overlay">
          <div className="kc-modal" style={{ maxWidth: 400, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 className="kc-modal-title" style={{ margin: 0 }}>日程変更を提案</h2>
              <button onClick={() => setShowRescheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.8, marginBottom: 14, padding: '10px 12px', background: 'rgba(192,122,110,.06)', border: '1px solid rgba(192,122,110,.35)', borderRadius: 8 }}>
              <b>本当に必要ですか？</b> ユーザーは元の日時に予定を空けて待っています。
              新しい候補を選び、変更をお願いする理由とお詫びを必ず添えてください。ユーザーの了承後に確定します。
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {slots.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-mid)', textAlign: 'center', padding: '24px 0' }}>現在、空き枠がありません</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {Object.entries(slotsByDate).map(([dateKey, daySlots]) => {
                    const dateLabel = new Date(dateKey + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })
                    return (
                      <div key={dateKey}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, letterSpacing: '.04em' }}>{dateLabel}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {daySlots.map(slot => {
                            const startTime = new Date(slot.start_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
                            const endTime = new Date(slot.end_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
                            const isSelected = selectedSlot === slot.id
                            return (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`, background: isSelected ? '#FFF8F0' : 'var(--card)', cursor: 'pointer', transition: 'all .15s', width: '100%', textAlign: 'left' }}
                              >
                                <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--accent)' : 'var(--text)' }}>
                                  {startTime} – {endTime}
                                </span>
                                {slot.meeting_type && (
                                  <span style={{ fontSize: 11, color: 'var(--text-mid)', background: 'var(--bg-elev)', borderRadius: 6, padding: '2px 8px' }}>{slot.meeting_type}</span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            {slots.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-mid)', marginBottom: 6 }}>
                  変更をお願いする理由・お詫びのメッセージ（必須・ユーザーに送信されます）
                </label>
                <textarea
                  value={rescheduleMessage}
                  onChange={e => setRescheduleMessage(e.target.value)}
                  placeholder="例：大変申し訳ありません。やむを得ない事情でこの日時の対応が難しくなりました。お手数ですが、ご都合のよい候補をお選びいただけますと幸いです。"
                  rows={3}
                  maxLength={500}
                  style={{ width: '100%', fontSize: 13, lineHeight: 1.7, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--card)', color: 'var(--text-deep)', resize: 'vertical', fontFamily: 'inherit' }}
                />
                <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowRescheduleModal(false)} className="kc-btn kc-btn-ghost" style={{ flex: 1 }}>やめる</button>
                  <button onClick={handleRequestReschedule} disabled={!selectedSlot || rescheduleMessage.trim().length === 0 || submittingReschedule} className="kc-btn kc-btn-primary" style={{ flex: 1 }}>
                    {submittingReschedule ? '送信中...' : '変更をお願いする'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}

function Field({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* noop */ }
  }
  return (
    <div style={{ padding: '7px 0' }}>
      <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, fontSize: 14, color: 'var(--text-deep)', lineHeight: 1.6, wordBreak: 'break-all' }}>{value}</div>
        {copyable && (
          <button onClick={handleCopy} className="kc-btn kc-btn-ghost kc-btn-sm" style={{ flexShrink: 0 }} aria-label={`${label}をコピー`}>
            {copied ? '✓' : 'コピー'}
          </button>
        )}
      </div>
    </div>
  )
}

function formatJpDate(iso: string | null): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} 受診`
  } catch { return '' }
}

function KindaTypeCard({ typeKey, diagnosedAt }: { typeKey: KindaTypeKey; diagnosedAt: string | null }) {
  const t = KINDA_TYPE_LABEL[typeKey]
  if (!t) return null
  return (
    <div style={{ padding: '12px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: 'var(--text-light)', letterSpacing: '.06em', fontFamily: 'DM Sans, sans-serif' }}>Kinda type</span>
        <span style={{ background: t.bg, color: 'white', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontFamily: 'Shippori Mincho, serif', fontWeight: 500 }}>{t.name}</span>
        {diagnosedAt && <span style={{ fontSize: 10, color: 'var(--text-light)', marginLeft: 'auto' }}>{formatJpDate(diagnosedAt)}</span>}
      </div>
      <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.75, margin: '0 0 8px' }}>{t.description}</p>
      <p style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.75, padding: '8px 10px', background: 'rgba(168,136,88,.08)', borderLeft: '2px solid var(--accent)', borderRadius: 6, margin: 0 }}>
        <span style={{ fontWeight: 500, color: 'var(--accent)' }}>担当者へ：</span>{t.advice}
      </p>
    </div>
  )
}

function KindaNoteCard({ noteKey, diagnosedAt, freeText }: { noteKey: string; diagnosedAt: string | null; freeText?: string | null }) {
  const label = KINDA_NOTE_WEATHER[noteKey]
  const imageUrl = `/images/w_${noteKey === 'dissonance_wind' ? 'uneasy_wind' : noteKey}.webp`
  return (
    <div style={{ padding: '12px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          width={56}
          height={56}
          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)', letterSpacing: '.06em', fontFamily: 'DM Sans, sans-serif' }}>Kinda note</span>
            <span style={{ background: '#D4A090', color: 'white', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontFamily: 'Shippori Mincho, serif', fontWeight: 500 }}>{label ?? noteKey}</span>
          </div>
          {diagnosedAt && <p style={{ fontSize: 10, color: 'var(--text-light)', margin: 0, lineHeight: 1.6 }}>{formatJpDate(diagnosedAt)} · 今の気持ちの天気として共有</p>}
          <p style={{ fontSize: 10, color: 'var(--text-mid)', margin: '4px 0 0', lineHeight: 1.6 }}>※ 面談中はこの「いまの気持ち」を起点に話を進めると、ユーザー満足度が上がりやすいです。</p>
        </div>
      </div>
      {freeText && (
        <div style={{ padding: '10px 12px 12px', background: 'rgba(212,160,144,.08)', borderLeft: '3px solid #D4A090', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: '#B8806E', letterSpacing: '.18em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, marginBottom: 6 }}>Your words · ご本人の言葉</div>
          <p style={{ fontSize: 13, color: 'var(--text-deep)', lineHeight: 1.85, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'Shippori Mincho, serif' }}>{freeText}</p>
          <p style={{ fontSize: 10, color: 'var(--text-mid)', margin: '8px 0 0', lineHeight: 1.6 }}>※ ご本人が「カウンセラーに伝える」と判断した自身の言葉です。必ず目を通してから面談に臨んでください。</p>
        </div>
      )}
    </div>
  )
}
