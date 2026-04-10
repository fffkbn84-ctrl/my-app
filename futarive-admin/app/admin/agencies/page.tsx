'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AgencyRow {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
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

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<AgencyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<AgencyRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState<AddForm>({ name: '', description: '', website_url: '' })
  const [adding, setAdding] = useState(false)

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
    await supabase.from('agencies').update({
      name: editForm.name,
      description: editForm.description || null,
      website_url: editForm.website_url || null,
    }).eq('id', editTarget.id)
    setSaving(false)
    setEditTarget(null)
    setEditForm(null)
    loadAgencies()
  }

  async function handleAdd() {
    if (!addForm.name.trim()) return
    setAdding(true)
    const supabase = createClient()
    const { error } = await supabase.from('agencies').insert({
      name: addForm.name.trim(),
      description: addForm.description.trim() || null,
      website_url: addForm.website_url.trim() || null,
    })
    setAdding(false)
    if (error) { alert('エラー: ' + error.message); return }
    setShowAddModal(false)
    setAddForm({ name: '', description: '', website_url: '' })
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
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(a.created_at).toLocaleDateString('ja-JP')}
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
    </div>
  )
}
