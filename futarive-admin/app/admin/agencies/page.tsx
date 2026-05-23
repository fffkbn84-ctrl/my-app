'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
// AgencyRow type used for local typing
interface AgencyRow {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  is_demo: boolean
  created_at: string
}

interface EditForm {
  name: string
  description: string
  website_url: string
  is_demo: boolean
}

interface OnboardForm {
  agencyName: string
  agencyDescription: string
  agencyWebsite: string
  isDemo: boolean
  ownerName: string
  ownerNameKana: string
  ownerRole: string
}

interface OnboardResult {
  agencyName: string
  ownerName: string
  inviteUrl: string
  agencyId: string
  counselorId: string
}

const COUNSELOR_APP_URL =
  process.env.NEXT_PUBLIC_COUNSELOR_URL?.replace(/\/$/, '') ??
  'https://futarive-counselor.vercel.app'

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="4" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M11 4V2.5A1.5 1.5 0 0 0 9.5 1h-5A1.5 1.5 0 0 0 3 2.5v8A1.5 1.5 0 0 0 4.5 12H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<AgencyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<AgencyRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)

  // 新規相談所＋オーナー一括作成
  const [onboardOpen, setOnboardOpen] = useState(false)
  const [onboardForm, setOnboardForm] = useState<OnboardForm>({
    agencyName: '',
    agencyDescription: '',
    agencyWebsite: '',
    isDemo: false,
    ownerName: '',
    ownerNameKana: '',
    ownerRole: 'オーナー',
  })
  const [onboarding, setOnboarding] = useState(false)
  const [onboardError, setOnboardError] = useState<string | null>(null)
  const [onboardResult, setOnboardResult] = useState<OnboardResult | null>(null)
  const [urlCopied, setUrlCopied] = useState(false)

  useEffect(() => { loadAgencies() }, [])

  async function loadAgencies() {
    setLoading(true)
    const { data } = await createClient().from('agencies').select('*').order('created_at', { ascending: false })
    setAgencies(data ?? [])
    setLoading(false)
  }

  function openEdit(a: AgencyRow) {
    setEditTarget(a)
    setEditForm({
      name: a.name,
      description: a.description ?? '',
      website_url: a.website_url ?? '',
      is_demo: a.is_demo,
    })
  }

  async function toggleDemo(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('agencies').update({ is_demo: !current }).eq('id', id)
    loadAgencies()
  }

  async function handleSave() {
    if (!editTarget || !editForm) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('agencies').update({
      name: editForm.name,
      description: editForm.description || null,
      website_url: editForm.website_url || null,
      is_demo: editForm.is_demo,
    }).eq('id', editTarget.id)
    setSaving(false)
    setEditTarget(null)
    setEditForm(null)
    loadAgencies()
  }

  function resetOnboardForm() {
    setOnboardForm({
      agencyName: '',
      agencyDescription: '',
      agencyWebsite: '',
      isDemo: false,
      ownerName: '',
      ownerNameKana: '',
      ownerRole: 'オーナー',
    })
    setOnboardError(null)
  }

  function closeOnboard() {
    setOnboardOpen(false)
    resetOnboardForm()
  }

  async function handleOnboard() {
    setOnboardError(null)
    if (!onboardForm.agencyName.trim()) {
      setOnboardError('相談所名を入力してください')
      return
    }
    if (!onboardForm.ownerName.trim()) {
      setOnboardError('オーナー氏名を入力してください')
      return
    }
    setOnboarding(true)
    const supabase = createClient()

    // 1. agencies INSERT
    const { data: newAgency, error: agencyError } = await supabase
      .from('agencies')
      .insert({
        name: onboardForm.agencyName.trim(),
        description: onboardForm.agencyDescription.trim() || null,
        website_url: onboardForm.agencyWebsite.trim() || null,
        is_demo: onboardForm.isDemo,
      })
      .select('id, name')
      .single()

    if (agencyError || !newAgency) {
      setOnboarding(false)
      setOnboardError(`相談所の作成に失敗しました: ${agencyError?.message ?? 'unknown'}`)
      return
    }

    // 2. counselors INSERT（オーナー本人レコード + 招待トークン発行）
    const inviteToken =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : null

    if (!inviteToken) {
      setOnboarding(false)
      setOnboardError('招待トークンの生成に失敗しました（ブラウザが対応していません）')
      return
    }

    const { data: newCounselor, error: counselorError } = await supabase
      .from('counselors')
      .insert({
        agency_id: newAgency.id,
        name: onboardForm.ownerName.trim(),
        name_kana: onboardForm.ownerNameKana.trim() || null,
        role: onboardForm.ownerRole.trim() || 'オーナー',
        invite_token: inviteToken,
        is_demo: onboardForm.isDemo,
        is_published: false, // claim 完了までは非公開
      })
      .select('id')
      .single()

    if (counselorError || !newCounselor) {
      // ロールバック：作成した agencies を削除
      await supabase.from('agencies').delete().eq('id', newAgency.id)
      setOnboarding(false)
      setOnboardError(`オーナーレコードの作成に失敗しました: ${counselorError?.message ?? 'unknown'}`)
      return
    }

    const inviteUrl = `${COUNSELOR_APP_URL}/claim?token=${inviteToken}`

    setOnboarding(false)
    setOnboardResult({
      agencyName: newAgency.name,
      ownerName: onboardForm.ownerName.trim(),
      inviteUrl,
      agencyId: newAgency.id,
      counselorId: newCounselor.id,
    })
    resetOnboardForm()
    setOnboardOpen(false)
    loadAgencies()
  }

  async function copyInviteUrl() {
    if (!onboardResult) return
    try {
      await navigator.clipboard.writeText(onboardResult.inviteUrl)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2200)
    } catch {
      // クリップボード API が使えない環境用フォールバック：選択状態にする
      const input = document.getElementById('invite-url-display') as HTMLInputElement | null
      if (input) {
        input.select()
        input.setSelectionRange(0, input.value.length)
      }
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">相談所管理</h1>
        <button
          onClick={() => setOnboardOpen(true)}
          className="btn btn-primary"
          style={{ gap: 6 }}
        >
          <IconPlus /> 新規相談所＋オーナー招待
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : agencies.length === 0 ? (
          <div className="empty-state">相談所データがありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>名前</th>
                  <th>説明</th>
                  <th>WebサイトURL</th>
                  <th>登録日</th>
                  <th>サンプル</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map(a => (
                  <tr key={a.id} style={a.is_demo ? { background: 'rgba(212,160,144,0.05)' } : undefined}>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>
                      {a.name}
                      {a.is_demo && (
                        <span style={{
                          marginLeft: 6,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: 'rgba(212,160,144,0.18)',
                          color: 'var(--accent-deep, #B8806E)',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.04em',
                          verticalAlign: 'middle',
                        }}>サンプル</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.description ?? '—'}
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {a.website_url ? (
                        <a href={a.website_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                          {a.website_url.replace(/^https?:\/\//, '').slice(0, 30)}
                        </a>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(a.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td>
                      <label className="toggle">
                        <input type="checkbox" checked={a.is_demo} onChange={() => toggleDemo(a.id, a.is_demo)} />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <button onClick={() => openEdit(a)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                        <IconEdit /> 編集
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editTarget && editForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">相談所編集 — {editTarget.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">名前</label>
                <input className="form-input" value={editForm.name} onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)} />
              </div>
              <div>
                <label className="form-label">説明</label>
                <textarea className="form-textarea" value={editForm.description} onChange={e => setEditForm(f => f ? { ...f, description: e.target.value } : f)} rows={3} />
              </div>
              <div>
                <label className="form-label">WebサイトURL</label>
                <input className="form-input" type="url" value={editForm.website_url} onChange={e => setEditForm(f => f ? { ...f, website_url: e.target.value } : f)} placeholder="https://" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.is_demo}
                    onChange={e => setEditForm(f => f ? { ...f, is_demo: e.target.checked } : f)}
                    style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>サンプル扱いにする（ユーザーサイトに「サンプル」バッジを表示）</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setEditTarget(null); setEditForm(null) }} className="btn btn-ghost">キャンセル</button>
              <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard modal — 新規相談所＋オーナー一括作成 */}
      {onboardOpen && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 560 }}>
            <div className="modal-title">新規相談所の登録 + オーナーへの招待</div>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>
              新規相談所と、その代表となる「オーナー」のカウンセラーレコードを一括で作成します。
              作成後に発行される招待 URL をオーナーへメールで送付してください。
              オーナーが招待 URL から /claim でサインアップすると、カウンセラーレコードがオーナーに紐付きます（owner_user_id セットは別途 Supabase Dashboard で実施）。
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-section-eyebrow" style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-deep, #B8806E)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                相談所情報
              </div>
              <div>
                <label className="form-label">相談所名 <span style={{ color: 'var(--danger, #C07A6E)' }}>*</span></label>
                <input
                  className="form-input"
                  value={onboardForm.agencyName}
                  onChange={e => setOnboardForm(f => ({ ...f, agencyName: e.target.value }))}
                  placeholder="例：銀座マリッジサポート"
                  required
                />
              </div>
              <div>
                <label className="form-label">説明（任意）</label>
                <textarea
                  className="form-textarea"
                  value={onboardForm.agencyDescription}
                  onChange={e => setOnboardForm(f => ({ ...f, agencyDescription: e.target.value }))}
                  rows={2}
                  placeholder="相談所の概要、対応エリア、強み等"
                />
              </div>
              <div>
                <label className="form-label">WebサイトURL（任意）</label>
                <input
                  className="form-input"
                  type="url"
                  value={onboardForm.agencyWebsite}
                  onChange={e => setOnboardForm(f => ({ ...f, agencyWebsite: e.target.value }))}
                  placeholder="https://"
                />
              </div>

              <div className="form-section-eyebrow" style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-deep, #B8806E)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 8 }}>
                オーナー情報（最初のカウンセラーレコード）
              </div>
              <div>
                <label className="form-label">オーナー氏名 <span style={{ color: 'var(--danger, #C07A6E)' }}>*</span></label>
                <input
                  className="form-input"
                  value={onboardForm.ownerName}
                  onChange={e => setOnboardForm(f => ({ ...f, ownerName: e.target.value }))}
                  placeholder="例：山田 花子"
                  required
                />
              </div>
              <div>
                <label className="form-label">ふりがな（任意）</label>
                <input
                  className="form-input"
                  value={onboardForm.ownerNameKana}
                  onChange={e => setOnboardForm(f => ({ ...f, ownerNameKana: e.target.value }))}
                  placeholder="やまだ はなこ"
                />
              </div>
              <div>
                <label className="form-label">役割表示</label>
                <input
                  className="form-input"
                  value={onboardForm.ownerRole}
                  onChange={e => setOnboardForm(f => ({ ...f, ownerRole: e.target.value }))}
                  placeholder="オーナー"
                />
                <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, lineHeight: 1.6 }}>
                  カウンセラープロフィール上で表示される肩書き（例：オーナー、代表カウンセラー）
                </p>
              </div>

              <div style={{ paddingTop: 8, borderTop: '1px solid var(--border, #EAE0D0)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={onboardForm.isDemo}
                    onChange={e => setOnboardForm(f => ({ ...f, isDemo: e.target.checked }))}
                    style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>サンプル扱いにする（実営業用ではない場合）</span>
                </label>
              </div>

              {onboardError && (
                <div style={{
                  background: 'rgba(192,122,110,.1)',
                  color: 'var(--danger, #C07A6E)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  lineHeight: 1.6,
                }}>
                  {onboardError}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={closeOnboard} className="btn btn-ghost" disabled={onboarding}>キャンセル</button>
              <button
                onClick={handleOnboard}
                className="btn btn-primary"
                disabled={onboarding || !onboardForm.agencyName.trim() || !onboardForm.ownerName.trim()}
              >
                {onboarding ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '作成して招待URL発行'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard result modal — 招待URL表示 */}
      {onboardResult && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 560 }}>
            <div className="modal-title" style={{ color: 'var(--success, #7A9E87)' }}>
              ✓ 作成完了
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              <strong>{onboardResult.agencyName}</strong> を作成し、
              オーナー <strong>{onboardResult.ownerName}</strong> 用の招待 URL を発行しました。
            </p>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">招待 URL（オーナーへメール送付）</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="invite-url-display"
                  className="form-input"
                  value={onboardResult.inviteUrl}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: 12, flex: 1 }}
                  onFocus={e => e.currentTarget.select()}
                />
                <button onClick={copyInviteUrl} className="btn btn-ghost btn-sm" style={{ gap: 4, whiteSpace: 'nowrap' }}>
                  <IconCopy /> {urlCopied ? 'コピー済' : 'コピー'}
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(168,136,88,0.06)',
              border: '1px solid rgba(168,136,88,0.18)',
              borderRadius: 8,
              padding: 14,
              fontSize: 12,
              lineHeight: 1.8,
              marginBottom: 16,
            }}>
              <strong>次のステップ：</strong>
              <ol style={{ marginLeft: 20, marginTop: 6 }}>
                <li>上記 URL をオーナーへメールで送付</li>
                <li>オーナーが URL から /claim にアクセス → 利用規約に同意 → アカウント作成</li>
                <li>オーナーの claim 完了後、Supabase Dashboard で <code>agencies.owner_user_id</code> をオーナーの <code>auth.uid()</code> にセット</li>
                <li>オーナーがログイン後、自社の追加カウンセラーを招待可能（次フェーズで UI 化予定）</li>
              </ol>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setOnboardResult(null)} className="btn btn-primary">閉じる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
