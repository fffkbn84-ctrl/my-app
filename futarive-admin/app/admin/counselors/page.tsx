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

type CounselorWithAgency = CounselorRow & { agency_name: string }

interface EditForm {
  name: string
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

export default function CounselorsPage() {
  const [counselors, setCounselors] = useState<CounselorWithAgency[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<CounselorWithAgency | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCounselors() }, [])

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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">カウンセラー管理</h1>
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
