'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CounselorRow {
  id: string
  agency_id: string | null
  name: string
  area: string | null
  bio: string | null
  quote: string | null
  diagnosis_type: string | null
  years_of_experience: number | null
  review_count: number | null
  is_published: boolean
  created_at: string
}

interface AgencyRow { id: string; name: string }

type CounselorWithAgency = CounselorRow & { agency_name: string }

interface EditForm {
  name: string
  agency_id: string
  area: string
  bio: string
  quote: string
  diagnosis_type: string
  is_published: boolean
}

interface AddForm {
  name: string
  agency_id: string
  area: string
  bio: string
  quote: string
  diagnosis_type: string
  is_published: boolean
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

export default function CounselorsPage() {
  const [counselors, setCounselors] = useState<CounselorWithAgency[]>([])
  const [agencies, setAgencies] = useState<AgencyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<CounselorWithAgency | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState<AddForm>({
    name: '', agency_id: '', area: '', bio: '', quote: '', diagnosis_type: '', is_published: false,
  })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    loadCounselors()
    createClient().from('agencies').select('id, name').order('name').then(({ data }) => setAgencies(data ?? []))
  }, [])

  async function loadCounselors() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('counselors').select('*, agencies(name)').order('created_at', { ascending: false })
    setCounselors(
      (data ?? []).map((c: Record<string, unknown>) => ({
        ...c,
        agency_name: (c.agencies as { name?: string } | null)?.name ?? '—',
      })) as CounselorWithAgency[]
    )
    setLoading(false)
  }

  async function togglePublish(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('counselors').update({ is_published: !current }).eq('id', id)
    loadCounselors()
  }

  function openEdit(c: CounselorWithAgency) {
    setEditTarget(c)
    setEditForm({
      name: c.name,
      agency_id: c.agency_id ?? '',
      area: c.area ?? '',
      bio: c.bio ?? '',
      quote: c.quote ?? '',
      diagnosis_type: c.diagnosis_type ?? '',
      is_published: c.is_published,
    })
  }

  async function handleSave() {
    if (!editTarget || !editForm) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('counselors').update({
      name: editForm.name,
      agency_id: editForm.agency_id || null,
      area: editForm.area || null,
      bio: editForm.bio || null,
      quote: editForm.quote || null,
      diagnosis_type: editForm.diagnosis_type || null,
      is_published: editForm.is_published,
    }).eq('id', editTarget.id)
    setSaving(false)
    setEditTarget(null)
    setEditForm(null)
    loadCounselors()
  }

  async function handleAdd() {
    if (!addForm.name.trim()) return
    setAdding(true)
    const supabase = createClient()
    const { error } = await supabase.from('counselors').insert({
      name: addForm.name.trim(),
      agency_id: addForm.agency_id || null,
      area: addForm.area.trim() || null,
      bio: addForm.bio.trim() || null,
      quote: addForm.quote.trim() || null,
      diagnosis_type: addForm.diagnosis_type || null,
      is_published: addForm.is_published,
      review_count: 0,
    })
    setAdding(false)
    if (error) { alert('エラー: ' + error.message); return }
    setShowAddModal(false)
    setAddForm({ name: '', agency_id: '', area: '', bio: '', quote: '', diagnosis_type: '', is_published: false })
    loadCounselors()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">カウンセラー管理</h1>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: 6 }}>
          <IconPlus /> 新規追加
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : counselors.length === 0 ? (
          <div className="empty-state">カウンセラーデータがありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>名前</th>
                  <th>相談所</th>
                  <th>エリア</th>
                  <th>経験年数</th>
                  <th>口コミ数</th>
                  <th>診断タイプ</th>
                  <th>掲載状態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {counselors.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>{c.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{c.agency_name}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{c.area ?? '—'}</td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>{c.years_of_experience != null ? `${c.years_of_experience}年` : '—'}</td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>{c.review_count ?? 0}</td>
                    <td style={{ fontSize: 13, textAlign: 'center' }}>
                      {c.diagnosis_type ? (
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 20,
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          fontSize: 12,
                          fontFamily: 'DM Sans',
                          fontWeight: 600,
                        }}>{c.diagnosis_type}</span>
                      ) : '—'}
                    </td>
                    <td>
                      <label className="toggle">
                        <input type="checkbox" checked={c.is_published} onChange={() => togglePublish(c.id, c.is_published)} />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <button onClick={() => openEdit(c)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
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
            <div className="modal-title">カウンセラー 新規追加</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">名前 <span style={{ color: '#DC2626' }}>*</span></label>
                <input
                  className="form-input"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="例: 田中 美紀"
                />
              </div>
              <div>
                <label className="form-label">所属相談所</label>
                <select
                  className="form-select"
                  value={addForm.agency_id}
                  onChange={e => setAddForm(f => ({ ...f, agency_id: e.target.value }))}
                >
                  <option value="">選択してください</option>
                  {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">エリア</label>
                <input
                  className="form-input"
                  value={addForm.area}
                  onChange={e => setAddForm(f => ({ ...f, area: e.target.value }))}
                  placeholder="例: 東京・神奈川"
                />
              </div>
              <div>
                <label className="form-label">プロフィール（bio）</label>
                <textarea
                  className="form-textarea"
                  value={addForm.bio}
                  onChange={e => setAddForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  placeholder="カウンセラーの紹介文を入力してください"
                />
              </div>
              <div>
                <label className="form-label">一言コメント（quote）</label>
                <input
                  className="form-input"
                  value={addForm.quote}
                  onChange={e => setAddForm(f => ({ ...f, quote: e.target.value }))}
                  placeholder="例: 一緒に理想の相手を見つけましょう"
                />
              </div>
              <div>
                <label className="form-label">診断タイプ</label>
                <select
                  className="form-select"
                  value={addForm.diagnosis_type}
                  onChange={e => setAddForm(f => ({ ...f, diagnosis_type: e.target.value }))}
                >
                  <option value="">未設定</option>
                  {['A', 'B', 'C', 'D'].map(t => <option key={t} value={t}>タイプ {t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={addForm.is_published}
                    onChange={e => setAddForm(f => ({ ...f, is_published: e.target.checked }))}
                    style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>今すぐ公開する</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowAddModal(false); setAddForm({ name: '', agency_id: '', area: '', bio: '', quote: '', diagnosis_type: '', is_published: false }) }}
                className="btn btn-ghost"
              >キャンセル</button>
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
            <div className="modal-title">カウンセラー編集 — {editTarget.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">名前</label>
                <input className="form-input" value={editForm.name} onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)} />
              </div>
              <div>
                <label className="form-label">所属相談所</label>
                <select
                  className="form-select"
                  value={editForm.agency_id}
                  onChange={e => setEditForm(f => f ? { ...f, agency_id: e.target.value } : f)}
                >
                  <option value="">選択してください</option>
                  {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">エリア</label>
                <input className="form-input" value={editForm.area} onChange={e => setEditForm(f => f ? { ...f, area: e.target.value } : f)} placeholder="例: 東京・神奈川" />
              </div>
              <div>
                <label className="form-label">プロフィール（bio）</label>
                <textarea className="form-textarea" value={editForm.bio} onChange={e => setEditForm(f => f ? { ...f, bio: e.target.value } : f)} rows={4} />
              </div>
              <div>
                <label className="form-label">一言コメント（quote）</label>
                <input className="form-input" value={editForm.quote} onChange={e => setEditForm(f => f ? { ...f, quote: e.target.value } : f)} placeholder="例: 一緒に理想の相手を見つけましょう" />
              </div>
              <div>
                <label className="form-label">診断タイプ</label>
                <select className="form-select" value={editForm.diagnosis_type} onChange={e => setEditForm(f => f ? { ...f, diagnosis_type: e.target.value } : f)}>
                  <option value="">未設定</option>
                  {['A', 'B', 'C', 'D'].map(t => <option key={t} value={t}>タイプ {t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.is_published}
                    onChange={e => setEditForm(f => f ? { ...f, is_published: e.target.checked } : f)}
                    style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>公開する</span>
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
    </div>
  )
}
