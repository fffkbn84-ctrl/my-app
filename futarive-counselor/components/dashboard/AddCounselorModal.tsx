'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Agency, Counselor } from '@/lib/types'

interface Props {
  agencies: Agency[]
  onClose: () => void
  onCreated?: () => void
}

type View = 'list' | 'invite'

export default function AddCounselorModal({ agencies, onClose, onCreated }: Props) {
  const [view, setView] = useState<View>('list')
  const [name, setName] = useState('')
  const [agencyId, setAgencyId] = useState(agencies[0]?.id ?? '')
  const [creating, setCreating] = useState(false)
  const [invite, setInvite] = useState<{ url: string; name: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState<Counselor[]>([])
  const [loadingPending, setLoadingPending] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!agencyId && agencies[0]) setAgencyId(agencies[0].id)
  }, [agencies, agencyId])

  // 未claim の招待を読み込む
  useEffect(() => {
    const load = async () => {
      if (agencies.length === 0) { setLoadingPending(false); return }
      const supabase = createClient()
      const { data } = await supabase
        .from('counselors')
        .select('*')
        .in('agency_id', agencies.map(a => a.id))
        .is('owner_user_id', null)
        .not('invite_token', 'is', null)
        .order('created_at', { ascending: false })
      const list = (data as Counselor[]) ?? []
      setPending(list)
      setLoadingPending(false)
      // 既存が無ければフォームを最初から開いておく
      if (list.length === 0) setShowForm(true)
    }
    load()
  }, [agencies])

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
    setInvite({ url, name: name.trim() })
    setView('invite')
    onCreated?.()
  }

  const handleShowExisting = (c: Counselor) => {
    if (!c.invite_token) return
    const url = `${window.location.origin}/claim?token=${c.invite_token}`
    setInvite({ url, name: c.name })
    setView('invite')
  }

  const handleDelete = async (c: Counselor) => {
    const ok = window.confirm(`${c.name} さんの招待を削除しますか？\n\nこの招待は無効になります。`)
    if (!ok) return
    setDeletingId(c.id)
    const supabase = createClient()
    const { error: delErr } = await supabase.from('counselors').delete().eq('id', c.id)
    setDeletingId(null)
    if (delErr) {
      setError(describeError(delErr) || '削除に失敗しました')
      return
    }
    setPending(prev => prev.filter(p => p.id !== c.id))
    onCreated?.()
  }

  const handleCopy = async () => {
    if (!invite) return
    try {
      await navigator.clipboard.writeText(invite.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('コピーに失敗しました。手動でコピーしてください')
    }
  }

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  return (
    <div className="kc-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="kc-modal" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>カウンセラーを追加</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }} aria-label="閉じる">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {view === 'invite' && invite ? (
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
                  招待URL
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                このURLを<strong>{invite.name}</strong>さんに共有してください。<br/>
                URLを開いてメール登録すると、自分でプロフィールを編集できます。
              </p>
            </div>

            {/* LINE 注意書き */}
            <div style={{
              padding: '10px 12px',
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 11,
              color: 'var(--text-mid)',
              lineHeight: 1.7,
              marginBottom: 12,
            }}>
              <strong style={{ color: 'var(--text-deep)' }}>⚠ LINE で送る場合の注意</strong><br/>
              LINE のアプリ内ブラウザでは登録に失敗することがあります。受け取った方には<strong>「Safari / Chrome で開いてください」</strong>と一言添えるか、メールで送ることをおすすめします。
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
              {invite.url}
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
              ※ このURLは一度使うと無効になります。同じ人に再送する場合はこの画面から再表示できます（一覧画面で確認できます）。
            </p>
          </div>
        ) : (
          <>
            {/* 未claim 招待リスト */}
            {!loadingPending && pending.length > 0 && (
              <div style={{
                padding: '12px 14px',
                background: 'var(--accent-pale)',
                border: '1px solid var(--accent-dim)',
                borderRadius: 12,
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="var(--accent-deep)" strokeWidth="1.4"/>
                    <path d="M7 4v3.5M7 9.5v.01" stroke="var(--accent-deep)" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-deep)' }}>
                    まだ登録が完了していない招待が {pending.length} 件あります
                  </span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 10 }}>
                  同じ人に新しい招待を発行する前に、URLを再送できます。
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pending.map(c => (
                    <div key={c.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'var(--card-warm)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-deep)', fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 2 }}>
                          発行 {fmtDate(c.created_at)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="kc-btn kc-btn-sm"
                        onClick={() => handleShowExisting(c)}
                        style={{ flexShrink: 0 }}
                      >
                        URLを再表示
                      </button>
                      <button
                        type="button"
                        className="kc-btn kc-btn-ghost kc-btn-sm"
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                        style={{ flexShrink: 0, color: 'var(--danger)' }}
                        aria-label={`${c.name} の招待を削除`}
                      >
                        {deletingId === c.id ? '...' : '削除'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 新規追加フォーム */}
            {showForm ? (
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
                    placeholder="例：田中花子"
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
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="kc-btn kc-btn-ghost" onClick={onClose}>
                  閉じる
                </button>
                <button type="button" className="kc-btn kc-btn-primary" onClick={() => setShowForm(true)}>
                  別の方を新規追加
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
