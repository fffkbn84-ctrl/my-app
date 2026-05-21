'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logPersonalDataAccess } from '@/lib/supabase/audit'
import { describeError } from '@/lib/errors'
import type { Reservation } from '@/lib/types'
import { KINDA_TYPE_LABEL, KINDA_NOTE_WEATHER, type KindaTypeKey } from '@/lib/diagnosisLabels'
import { FRONTSITE_URL } from '@/lib/config'

interface Props {
  slotId: string
  onClose: () => void
}

export default function ReservationDetailModal({ slotId, onClose }: Props) {
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [error, setError] = useState('')

  // 023_reservations_agency_message — メッセージ入力 / 編集 state
  const [editingMessage, setEditingMessage] = useState(false)
  const [messageDraft, setMessageDraft] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSavedFlash, setMessageSavedFlash] = useState(false)

  // 025 — 面談完了 + 口コミトークン発行（active → completed への遷移）
  const [completing, setCompleting] = useState(false)
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)
  const [completedTokenInfo, setCompletedTokenInfo] = useState<{
    token: string
    code: string
  } | null>(null)

  // 手動キャンセル（active → canceled）
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelReasonDraft, setCancelReasonDraft] = useState('')

  /** ランダムな 6 桁英数（紛らわしい O / 0 / I / 1 は除外） */
  function generateReviewCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let s = ''
    for (let i = 0; i < 6; i++) {
      s += chars[Math.floor(Math.random() * chars.length)]
    }
    return `TKN-${s}`
  }

  async function handleComplete() {
    if (!reservation) return
    setCompleting(true)
    setError('')
    try {
      const supabase = createClient()
      // 既に発行済みのトークンを使い回す（再発行で混乱を生まない）
      const token = reservation.review_token ?? crypto.randomUUID()
      const code = reservation.review_code ?? generateReviewCode()
      const { error } = await supabase
        .from('reservations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          review_token: token,
          review_code: code,
        })
        .eq('id', reservation.id)
      if (error) throw error
      setReservation({
        ...reservation,
        status: 'completed',
        review_token: token,
        review_code: code,
      })
      setCompletedTokenInfo({ token, code })
      setShowCompleteConfirm(false)
    } catch (e) {
      setError('面談完了の処理に失敗しました: ' + describeError(e))
    } finally {
      setCompleting(false)
    }
  }

  /** 手動キャンセル — 紐付く slot があれば 'open' に戻して再販可能にする */
  async function handleCancel() {
    if (!reservation) return
    setCancelling(true)
    setError('')
    try {
      const supabase = createClient()
      const reason = cancelReasonDraft.trim()
      const { error: upErr } = await supabase
        .from('reservations')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          cancel_reason: reason.length > 0 ? reason : null,
        })
        .eq('id', reservation.id)
      if (upErr) throw upErr

      // 紐付く slot を 'open' に戻して他のユーザーが取れるようにする
      if (reservation.slot_id) {
        await supabase
          .from('slots')
          .update({ status: 'open' })
          .eq('id', reservation.slot_id)
      }

      setReservation({
        ...reservation,
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        cancel_reason: reason.length > 0 ? reason : null,
      })
      setShowCancelConfirm(false)
      setCancelReasonDraft('')
    } catch (e) {
      setError('キャンセル処理に失敗しました: ' + describeError(e))
    } finally {
      setCancelling(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data, error: rvErr } = await supabase
        .from('reservations')
        .select('*')
        .eq('slot_id', slotId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (rvErr) {
        setError('予約情報の取得に失敗しました')
        setLoading(false)
        return
      }
      setReservation(data as Reservation | null)
      setLoading(false)

      // 個人情報閲覧ログ
      if (data) {
        logPersonalDataAccess('reservations', data.id, data.user_id ?? null)
      }
    }
    load()
  }, [slotId])

  const fmtDateTime = (iso: string | null) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  const statusLabel = (s: Reservation['status']) =>
    s === 'active' ? '予約中' : s === 'canceled' ? 'キャンセル済' : '面談完了'

  /** 相談所メッセージを保存（新規 or 編集） */
  const handleSaveMessage = async () => {
    if (!reservation) return
    const trimmed = messageDraft.trim()
    if (trimmed.length === 0) {
      setError('メッセージを入力してください')
      return
    }
    setSendingMessage(true)
    setError('')
    const supabase = createClient()
    const nowIso = new Date().toISOString()
    const { error: upErr } = await supabase
      .from('reservations')
      .update({ agency_message: trimmed, agency_message_at: nowIso })
      .eq('id', reservation.id)
    setSendingMessage(false)
    if (upErr) {
      setError(`メッセージの送信に失敗：${describeError(upErr)}`)
      return
    }
    setReservation({ ...reservation, agency_message: trimmed, agency_message_at: nowIso })
    setEditingMessage(false)
    setMessageSavedFlash(true)
    setTimeout(() => setMessageSavedFlash(false), 2500)
  }

  return (
    <div className="kc-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="kc-modal" style={{ maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>予約者情報</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }} aria-label="閉じる">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--text-mid)', padding: '20px 0', textAlign: 'center' }}>
            読み込み中…
          </p>
        ) : error ? (
          <p style={{ fontSize: 13, color: 'var(--danger)', padding: '12px 14px', background: 'var(--bg-elev)', borderRadius: 10 }}>
            {error}
          </p>
        ) : !reservation ? (
          <div style={{
            padding: '20px 16px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontSize: 12,
            color: 'var(--text-mid)',
            lineHeight: 1.8,
          }}>
            この予約枠は <strong>booked</strong> ですが、結びついた予約レコードが見つかりませんでした。
            <br/>
            手動でステータス変更された可能性があります。
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* ステータスバッジ */}
            <div>
              <span className={`kc-badge kc-badge-${reservation.status === 'active' ? 'booked' : reservation.status === 'canceled' ? 'locked' : 'open'}`}>
                {statusLabel(reservation.status)}
              </span>
              {reservation.meeting_type && (
                <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-mid)' }}>
                  {reservation.meeting_type}
                </span>
              )}
            </div>

            <Field label="面談日時" value={fmtDateTime(reservation.start_at)} />
            <Field label="お名前" value={reservation.user_name || '（未入力）'} />
            <Field
              label="メールアドレス"
              value={reservation.user_email || '（未入力）'}
              copyable
            />
            {reservation.user_phone && (
              <Field
                label="電話番号"
                value={reservation.user_phone}
                copyable
              />
            )}

            {/* 「事前に伝えたいこと」— ユーザーが予約フォームで書いた質問・要望
                DB の実カラムは notes（旧コードで memo を読んでいたバグの修正） */}
            {reservation.notes && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>
                  事前に伝えたいこと
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text-deep)',
                  lineHeight: 1.8,
                  padding: '10px 12px',
                  background: 'var(--bg-elev)',
                  borderRadius: 10,
                  whiteSpace: 'pre-wrap',
                }}>
                  {reservation.notes}
                </div>
              </div>
            )}

            {reservation.status === 'canceled' && reservation.cancel_reason && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>
                  キャンセル理由
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-mid)',
                  lineHeight: 1.7,
                  padding: '8px 12px',
                  background: 'var(--bg-elev)',
                  borderRadius: 10,
                }}>
                  {reservation.cancel_reason}
                </div>
              </div>
            )}

            {/* 024_reservations_shared_diagnosis — ユーザーが共有した診断結果 */}
            {(reservation.shared_kinda_type_key || reservation.shared_kinda_note_key) && (
              <div style={{
                paddingTop: 12,
                borderTop: '1px solid var(--border)',
              }}>
                <div style={{
                  fontSize: 10,
                  color: 'var(--accent)',
                  marginBottom: 8,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500,
                }}>
                  Shared by user · 事前共有
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-mid)', margin: '0 0 10px', lineHeight: 1.7 }}>
                  予約時に「担当者に伝える」を選んだ診断結果です。面談前にざっと目を通しておくとスムーズです。
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reservation.shared_kinda_type_key && (
                    <KindaTypeCard
                      typeKey={reservation.shared_kinda_type_key as KindaTypeKey}
                      diagnosedAt={reservation.shared_kinda_type_at}
                    />
                  )}
                  {reservation.shared_kinda_note_key && (
                    <KindaNoteCard
                      noteKey={reservation.shared_kinda_note_key}
                      diagnosedAt={reservation.shared_kinda_note_at}
                      freeText={reservation.shared_kinda_note_freetext}
                    />
                  )}
                </div>
              </div>
            )}

            {/* 023_reservations_agency_message — 相談所からのメッセージ */}
            {reservation.status === 'active' && (
              <div style={{
                paddingTop: 12,
                borderTop: '1px solid var(--border)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: 10, color: 'var(--text-light)', letterSpacing: '.05em' }}>
                    予約者へのメッセージ
                  </span>
                  {messageSavedFlash && (
                    <span style={{ fontSize: 10, color: 'var(--success, #7A9E87)' }}>送信しました</span>
                  )}
                </div>

                {!editingMessage && reservation.agency_message ? (
                  <div>
                    <div style={{
                      fontSize: 13,
                      color: 'var(--text-deep)',
                      lineHeight: 1.8,
                      padding: '10px 12px',
                      background: 'rgba(168,136,88,.08)',
                      borderLeft: '3px solid var(--accent)',
                      borderRadius: 8,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {reservation.agency_message}
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: 'var(--text-light)',
                      marginTop: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>{fmtDateTime(reservation.agency_message_at)} に送信済み</span>
                      <button
                        type="button"
                        className="kc-btn kc-btn-ghost kc-btn-sm"
                        onClick={() => {
                          setMessageDraft(reservation.agency_message ?? '')
                          setEditingMessage(true)
                        }}
                      >
                        編集
                      </button>
                    </div>
                  </div>
                ) : editingMessage ? (
                  <div>
                    <textarea
                      value={messageDraft}
                      onChange={e => setMessageDraft(e.target.value)}
                      placeholder="例：ご質問の件、当日詳しくお話しします。お見合いの場所はこちらでご案内いたしますね。"
                      style={{
                        width: '100%',
                        minHeight: 100,
                        padding: '10px 12px',
                        fontSize: 13,
                        lineHeight: 1.8,
                        fontFamily: 'inherit',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        background: 'var(--card)',
                        color: 'var(--text-deep)',
                        resize: 'vertical',
                      }}
                      maxLength={500}
                    />
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 8,
                      justifyContent: 'flex-end',
                    }}>
                      <button
                        type="button"
                        className="kc-btn kc-btn-ghost kc-btn-sm"
                        onClick={() => {
                          setEditingMessage(false)
                          setMessageDraft('')
                        }}
                        disabled={sendingMessage}
                      >
                        キャンセル
                      </button>
                      <button
                        type="button"
                        className="kc-btn kc-btn-primary kc-btn-sm"
                        onClick={handleSaveMessage}
                        disabled={sendingMessage || messageDraft.trim().length === 0}
                      >
                        {sendingMessage ? '送信中…' : reservation.agency_message ? '更新する' : '送信する'}
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.7 }}>
                      送信したメッセージは予約者のマイページに表示されます（最大500字）。後から編集可能です。
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="kc-btn kc-btn-ghost kc-btn-sm"
                    onClick={() => {
                      setMessageDraft('')
                      setEditingMessage(true)
                    }}
                    style={{ width: '100%' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2 4a1 1 0 011-1h8a1 1 0 011 1v5a1 1 0 01-1 1H6l-3 2v-2H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                    予約者へメッセージを送る
                  </button>
                )}
              </div>
            )}

            <div style={{
              fontSize: 10,
              color: 'var(--text-light)',
              paddingTop: 6,
              borderTop: '1px solid var(--border)',
              lineHeight: 1.7,
            }}>
              申込日時：{fmtDateTime(reservation.created_at)}
            </div>
          </div>
        )}

        {/* トークン情報を表示 — レビュー依頼 URL とコードを案内
            完了直後（completedTokenInfo）でも、過去に完了済みで再度開いた場合
            （reservation.review_token がある）でも表示する */}
        {(() => {
          const displayToken = completedTokenInfo?.token ?? reservation?.review_token ?? null
          const displayCode = completedTokenInfo?.code ?? reservation?.review_code ?? null
          if (!displayToken || !displayCode || !reservation) return null
          const justCompleted = !!completedTokenInfo
          return (
            <div style={{
              marginTop: 16,
              padding: '14px 16px',
              background: 'rgba(122,158,135,.1)',
              border: '1px solid rgba(122,158,135,.4)',
              borderRadius: 12,
            }}>
              <div style={{
                fontSize: 11,
                color: 'var(--success)',
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '.16em',
                marginBottom: 8,
                fontWeight: 600,
              }}>
                ✓ {justCompleted ? '面談完了 · 口コミトークンを発行しました' : '口コミ受付 URL（発行済み）'}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-deep)', lineHeight: 1.7, margin: '0 0 10px' }}>
                下記のリンクまたは認証コードを <b>{reservation.user_name}</b> 様にお送りください。
                これがあれば「面談済み口コミ」として投稿できます。
              </p>
              <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4 }}>口コミ受付 URL</div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: 11,
                padding: '6px 10px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                marginBottom: 8,
                wordBreak: 'break-all',
                userSelect: 'all',
              }}>
                {`${FRONTSITE_URL}/reviews/new?token=${displayToken}`}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4 }}>認証コード（手動入力用）</div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 600,
                padding: '6px 10px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                letterSpacing: '.1em',
                userSelect: 'all',
              }}>
                {displayCode}
              </div>
            </div>
          )
        })()}

        {/* 面談完了の確認ダイアログ（インライン） */}
        {showCompleteConfirm && (
          <div style={{
            marginTop: 16,
            padding: '14px 16px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 12,
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-deep)', margin: '0 0 12px', lineHeight: 1.7 }}>
              この面談を完了とマークしますか？<br/>
              <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>
                完了すると自動で口コミ用 URL が発行され、ご本人にお送りいただけます。
              </span>
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                className="kc-btn kc-btn-ghost kc-btn-sm"
                onClick={() => setShowCompleteConfirm(false)}
                disabled={completing}
              >
                やめる
              </button>
              <button
                className="kc-btn kc-btn-primary kc-btn-sm"
                onClick={handleComplete}
                disabled={completing}
              >
                {completing ? '処理中…' : '面談完了にする'}
              </button>
            </div>
          </div>
        )}

        {/* キャンセルの確認ダイアログ（インライン）— 理由入力は任意 */}
        {showCancelConfirm && (
          <div style={{
            marginTop: 16,
            padding: '14px 16px',
            background: 'rgba(192,122,110,.06)',
            border: '1px solid rgba(192,122,110,.4)',
            borderRadius: 12,
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-deep)', margin: '0 0 10px', lineHeight: 1.7 }}>
              この予約をキャンセルしますか？<br/>
              <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>
                キャンセル後は予約枠が再度ご利用可能になります。お客様への連絡は別途お願いします。
              </span>
            </p>
            <div style={{ fontSize: 10, color: 'var(--text-mid)', marginBottom: 4 }}>
              キャンセル理由（任意・内部メモ）
            </div>
            <textarea
              value={cancelReasonDraft}
              onChange={(e) => setCancelReasonDraft(e.target.value)}
              placeholder="例: お客様のご都合により / カウンセラー側都合"
              rows={2}
              maxLength={200}
              style={{
                width: '100%',
                fontSize: 12,
                padding: '8px 10px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                resize: 'vertical',
                fontFamily: 'inherit',
                marginBottom: 10,
                color: 'var(--text-deep)',
              }}
              disabled={cancelling}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                className="kc-btn kc-btn-ghost kc-btn-sm"
                onClick={() => { setShowCancelConfirm(false); setCancelReasonDraft('') }}
                disabled={cancelling}
              >
                やめる
              </button>
              <button
                className="kc-btn kc-btn-danger kc-btn-sm"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? '処理中…' : 'キャンセルする'}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, gap: 8, flexWrap: 'wrap' }}>
          {/* active 中の予約のみ「面談完了」「キャンセル」を表示。canceled / completed では非表示 */}
          {reservation?.status === 'active' && !completedTokenInfo && (
            <>
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
            </>
          )}
          {/* スペーサー（左寄せ完了/キャンセルボタンと右寄せ閉じるを両立） */}
          <div style={{ flex: 1 }} />
          <button className="kc-btn kc-btn-ghost" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
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
    } catch {
      // noop
    }
  }
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, letterSpacing: '.05em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          flex: 1,
          fontSize: 14,
          color: 'var(--text-deep)',
          lineHeight: 1.6,
          wordBreak: 'break-all',
        }}>
          {value}
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="kc-btn kc-btn-ghost kc-btn-sm"
            style={{ flexShrink: 0 }}
            aria-label={`${label}をコピー`}
          >
            {copied ? '✓' : 'コピー'}
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── 024 — 共有された Kinda type / Kinda note の表示カード ─── */

function formatJpDate(iso: string | null): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} 受診`
  } catch {
    return ''
  }
}

function KindaTypeCard({ typeKey, diagnosedAt }: { typeKey: KindaTypeKey; diagnosedAt: string | null }) {
  const t = KINDA_TYPE_LABEL[typeKey]
  if (!t) return null
  return (
    <div style={{
      padding: '12px 14px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10,
          color: 'var(--text-light)',
          letterSpacing: '.06em',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Kinda type
        </span>
        <span style={{
          background: t.bg,
          color: 'white',
          fontSize: 11,
          padding: '2px 10px',
          borderRadius: 20,
          fontFamily: 'Shippori Mincho, serif',
          fontWeight: 500,
        }}>
          {t.name}
        </span>
        {diagnosedAt && (
          <span style={{ fontSize: 10, color: 'var(--text-light)', marginLeft: 'auto' }}>
            {formatJpDate(diagnosedAt)}
          </span>
        )}
      </div>
      <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.75, margin: '0 0 8px' }}>
        {t.description}
      </p>
      <p style={{
        fontSize: 11,
        color: 'var(--text-mid)',
        lineHeight: 1.75,
        padding: '8px 10px',
        background: 'rgba(168,136,88,.08)',
        borderLeft: '2px solid var(--accent)',
        borderRadius: 6,
        margin: 0,
      }}>
        <span style={{ fontWeight: 500, color: 'var(--accent)' }}>担当者へ：</span>
        {t.advice}
      </p>
    </div>
  )
}

function KindaNoteCard({
  noteKey,
  diagnosedAt,
  freeText,
}: {
  noteKey: string
  diagnosedAt: string | null
  freeText?: string | null
}) {
  const label = KINDA_NOTE_WEATHER[noteKey]
  // 画像パスは user-site と同じ規則（rain_cloud だけ webp、その他も webp）
  const imageUrl = `/images/w_${noteKey === 'dissonance_wind' ? 'uneasy_wind' : noteKey}.webp`
  return (
    <div style={{
      padding: '12px 14px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
    <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center',
    }}>
      {/* 天気アイコン（user-site と同じ画像） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        width={56}
        height={56}
        style={{
          width: 56,
          height: 56,
          objectFit: 'cover',
          borderRadius: 8,
          flexShrink: 0,
          border: '1px solid var(--border)',
        }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10,
            color: 'var(--text-light)',
            letterSpacing: '.06em',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            Kinda note
          </span>
          <span style={{
            background: '#D4A090',
            color: 'white',
            fontSize: 11,
            padding: '2px 10px',
            borderRadius: 20,
            fontFamily: 'Shippori Mincho, serif',
            fontWeight: 500,
          }}>
            {label ?? noteKey}
          </span>
        </div>
        {diagnosedAt && (
          <p style={{ fontSize: 10, color: 'var(--text-light)', margin: 0, lineHeight: 1.6 }}>
            {formatJpDate(diagnosedAt)} · 今の気持ちの天気として共有
          </p>
        )}
        <p style={{ fontSize: 10, color: 'var(--text-mid)', margin: '4px 0 0', lineHeight: 1.6 }}>
          ※ 面談中はこの「いまの気持ち」を起点に話を進めると、ユーザー満足度が上がりやすいです。
        </p>
      </div>
    </div>

      {/* 025 — Kinda note の自由記述（your words）— ユーザーが「結果に含める」を ON で
         共有を選んだ場合のみ表示。最重要：これを必ず読んでから面談に臨む */}
      {freeText && (
        <div style={{
          padding: '10px 12px 12px',
          background: 'rgba(212,160,144,.08)',
          borderLeft: '3px solid #D4A090',
          borderRadius: 6,
        }}>
          <div style={{
            fontSize: 10,
            color: '#B8806E',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            marginBottom: 6,
          }}>
            Your words · ご本人の言葉
          </div>
          <p style={{
            fontSize: 13,
            color: 'var(--text-deep)',
            lineHeight: 1.85,
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'Shippori Mincho, serif',
          }}>
            {freeText}
          </p>
          <p style={{
            fontSize: 10,
            color: 'var(--text-mid)',
            margin: '8px 0 0',
            lineHeight: 1.6,
          }}>
            ※ ご本人が「カウンセラーに伝える」と判断した自身の言葉です。必ず目を通してから面談に臨んでください。
          </p>
        </div>
      )}
    </div>
  )
}
