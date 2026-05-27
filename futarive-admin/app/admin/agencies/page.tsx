'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AgencyRow {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  owner_user_id: string | null
  created_at: string
}

interface EditForm {
  name: string
  description: string
  website_url: string
}

interface AddForm {
  name: string
  description: string
  website_url: string
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconKey() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="10" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 8l6-6M11 5l2 2M9 3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<AgencyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<AgencyRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState<AddForm>({ name: '', description: '', website_url: '' })
  const [adding, setAdding] = useState(false)
  // オーナーセット用 modal
  const [ownerTarget, setOwnerTarget] = useState<AgencyRow | null>(null)
  const [ownerInput, setOwnerInput] = useState('')
  const [ownerSaving, setOwnerSaving] = useState(false)
  const [ownerError, setOwnerError] = useState('')

  useEffect(() => { loadAgencies() }, [])

  async function loadAgencies() {
    setLoading(true)
    const { data } = await createClient().from('agencies').select('*').order('created_at', { ascending: false })
    setAgencies(data ?? [])
    setLoading(false)
  }

  function openEdit(a: AgencyRow) {
    setEditTarget(a)
    setEditForm({ name: a.name, description: a.description ?? '', website_url: a.website_url ?? '' })
  }

  async function handleSave() {
    if (!editTarget || !editForm) return
    setSaving(true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('agencies').update({
      name: editForm.name,
      description: editForm.description || null,
      website_url: editForm.website_url || null,
    } as any).eq('id', editTarget.id)
    setSaving(false)
    setEditTarget(null)
    setEditForm(null)
    loadAgencies()
  }

  async function handleAdd() {
    if (!addForm.name.trim()) return
    setAdding(true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('agencies').insert({
      name: addForm.name.trim(),
      description: addForm.description.trim() || null,
      website_url: addForm.website_url.trim() || null,
    } as any)
    setAdding(false)
    if (error) { alert('エラー: ' + error.message); return }
    setShowAddModal(false)
    setAddForm({ name: '', description: '', website_url: '' })
    loadAgencies()
  }

  function openOwnerModal(a: AgencyRow) {
    setOwnerTarget(a)
    setOwnerInput(a.owner_user_id ?? '')
    setOwnerError('')
  }

  async function handleSetOwner() {
    if (!ownerTarget) return
    const value = ownerInput.trim()
    if (value && !UUID_REGEX.test(value)) {
      setOwnerError('UUID の形式が正しくありません（例: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）')
      return
    }
    setOwnerSaving(true)
    setOwnerError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('agencies')
      .update({ owner_user_id: value || null })
      .eq('id', ownerTarget.id)
    setOwnerSaving(false)
    if (error) {
      setOwnerError('更新に失敗しました：' + error.message)
      return
    }
    setOwnerTarget(null)
    setOwnerInput('')
    loadAgencies()
  }

  async function handleClearOwner() {
    if (!ownerTarget) return
    const ok = window.confirm(`${ownerTarget.name} のオーナー設定を解除しますか？\n\n解除すると、現在のオーナーは管理画面でこの相談所を扱えなくなります。`)
    if (!ok) return
    setOwnerSaving(true)
    setOwnerError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('agencies')
      .update({ owner_user_id: null })
      .eq('id', ownerTarget.id)
    setOwnerSaving(false)
    if (error) {
      setOwnerError('解除に失敗しました：' + error.message)
      return
    }
    setOwnerTarget(null)
    setOwnerInput('')
    loadAgencies()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">相談所管理</h1>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: 6 }}>
          <IconPlus /> 新規追加
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
                  <th>オーナー</th>
                  <th>登録日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>{a.name}</td>
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
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                      {a.owner_user_id ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '2px 9px',
                          borderRadius: 999,
                          background: 'rgba(122,158,135,.18)',
                          color: '#5C8170',
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        title={a.owner_user_id}
                        >
                          設定済
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '2px 9px',
                          borderRadius: 999,
                          background: 'rgba(220,38,38,.12)',
                          color: '#B91C1C',
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: 'DM Sans, sans-serif',
                        }}>
                          未設定
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(a.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button onClick={() => openEdit(a)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                          <IconEdit /> 編集
                        </button>
                        <button onClick={() => openOwnerModal(a)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                          <IconKey /> オーナー
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">相談所 新規追加</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">名前 <span style={{ color: '#DC2626' }}>*</span></label>
                <input
                  className="form-input"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="例: ブライダルハウス東京"
                />
              </div>
              <div>
                <label className="form-label">説明</label>
                <textarea
                  className="form-textarea"
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="相談所の紹介文を入力してください"
                />
              </div>
              <div>
                <label className="form-label">WebサイトURL</label>
                <input
                  className="form-input"
                  type="url"
                  value={addForm.website_url}
                  onChange={e => setAddForm(f => ({ ...f, website_url: e.target.value }))}
                  placeholder="https://"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddModal(false); setAddForm({ name: '', description: '', website_url: '' }) }} className="btn btn-ghost">キャンセル</button>
              <button onClick={handleAdd} className="btn btn-primary" disabled={adding || !addForm.name.trim()}>
                {adding ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Owner modal */}
      {ownerTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">オーナー設定 — {ownerTarget.name}</div>

            <div style={{
              padding: '11px 14px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--muted)',
              lineHeight: 1.7,
              marginBottom: 16,
            }}>
              <p style={{ marginBottom: 8 }}>
                <strong style={{ color: 'var(--text)' }}>使い方</strong>
              </p>
              <ol style={{ paddingLeft: 18, margin: 0 }}>
                <li>Supabase ダッシュボード &gt; Authentication &gt; Users で対象ユーザーを開く</li>
                <li>そのユーザーの <code>UID</code> をコピー</li>
                <li>下の欄に貼り付けて「設定」を押す</li>
              </ol>
              <p style={{ marginTop: 8 }}>
                設定後、そのユーザーが counselor 管理画面にログインすると、この相談所のオーナーとして
                カウンセラー招待・予約管理ができるようになります。
              </p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label">
                オーナーのユーザー UUID
                {ownerTarget.owner_user_id && (
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--muted)' }}>
                    （現在の値が入っています）
                  </span>
                )}
              </label>
              <input
                className="form-input"
                value={ownerInput}
                onChange={e => { setOwnerInput(e.target.value); setOwnerError('') }}
                placeholder="例：a1b2c3d4-e5f6-7890-abcd-1234567890ab"
                style={{ fontFamily: 'DM Sans, monospace', fontSize: 12 }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>

            {ownerError && (
              <p style={{ fontSize: 12, color: '#B91C1C', marginBottom: 12, lineHeight: 1.7 }}>{ownerError}</p>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                {ownerTarget.owner_user_id && (
                  <button
                    onClick={handleClearOwner}
                    disabled={ownerSaving}
                    className="btn btn-ghost"
                    style={{ color: '#B91C1C' }}
                  >
                    オーナーを解除
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setOwnerTarget(null); setOwnerInput(''); setOwnerError('') }} className="btn btn-ghost">キャンセル</button>
                <button onClick={handleSetOwner} className="btn btn-primary" disabled={ownerSaving}>
                  {ownerSaving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '設定'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
