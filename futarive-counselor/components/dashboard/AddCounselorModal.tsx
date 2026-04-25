'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Agency } from '@/lib/types'

interface Props {
  agencies: Agency[]
  onClose: () => void
  onCreated?: () => void
}

export default function AddCounselorModal({ agencies, onClose, onCreated }: Props) {
  const [name, setName] = useState('')
  const [agencyId, setAgencyId] = useState(agencies[0]?.id ?? '')
  const [creating, setCreating] = useState(false)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!agencyId && agencies[0]) setAgencyId(agencies[0].id)
  }, [agencies, agencyId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('氏名を入力してください'); return }
    if (!agencyId) { setError('所属相談所を選択してください'); return }

    setCreating(true)
    const supabase = createClient()
    const inviteToken = crypto.randomUUID()
    const { data, error: insErr } = await supabase
      .from('counselors')
      .insert({
        name: name.trim(),
        agency_id: agencyId,
        owner_user_id: null,
        is_published: false,
        invite_token: inviteToken,
      })
      .select()
      .maybeSingle()

    setCreating(false)
    if (insErr || !data) {
      console.error('[invite create] error', insErr)
      setError(describeError(insErr) || '作成に失敗しました')
      return
    }

    const url = `${window.location.origin}/claim?token=${inviteToken}`
    setInviteUrl(url)
    onCreated?.()
  }

  const handleCopy = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('コピーに失敗しました。手動でコピーしてください')
    }
  }

  return (
    <div className="kc-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="kc-modal" style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>カウンセラーを追加</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }} aria-label="閉じる">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {!inviteUrl ? (
          <form onSubmit={handleCreate}>
            <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 18 }}>
              新しいカウンセラーの氏名を入力すると、専用URLが発行されます。<br/>
              そのURLを本人に渡すと、ご自身でログイン情報を作成してプロフィールを編集できます。
            </p>

            <div style={{ marginBottom: 14 }}>
              <label className="kc-label">氏名 <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                className="kc-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例：小山楓華"
                autoFocus
              />
            </div>

            {agencies.length > 1 && (
              <div style={{ marginBottom: 14 }}>
                <label className="kc-label">所属相談所</label>
                <select className="kc-select" value={agencyId} onChange={e => setAgencyId(e.target.value)}>
                  {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}

            {error && (
              <p style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 12 }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="kc-btn kc-btn-ghost" onClick={onClose}>
                キャンセル
              </button>
              <button type="submit" className="kc-btn kc-btn-primary" disabled={creating}>
                {creating ? '発行中…' : '招待URLを発行'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{
              padding: '14px 14px',
              background: 'var(--accent-pale)',
              border: '1px solid var(--accent-dim)',
              borderRadius: 12,
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-deep)' }}>
                  招待URLを発行しました
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                このURLを<strong>{name}</strong>さんに共有してください。<br/>
                URLを開いてメール登録すると、自分でプロフィールを編集できます。
              </p>
            </div>

            <div style={{
              padding: '12px 14px',
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 11,
              fontFamily: 'DM Sans, sans-serif',
              color: 'var(--text)',
              wordBreak: 'break-all',
              lineHeight: 1.6,
              marginBottom: 12,
            }}>
              {inviteUrl}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="kc-btn kc-btn-ghost" onClick={onClose}>
                閉じる
              </button>
              <button className="kc-btn kc-btn-primary" onClick={handleCopy}>
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    コピー済み
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="3" y="3" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5 3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                    URLをコピー
                  </>
                )}
              </button>
            </div>

            <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 14, lineHeight: 1.7 }}>
              ※ このURLは一度使うと無効になります。再発行が必要な場合は再度カウンセラーを追加してください。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
