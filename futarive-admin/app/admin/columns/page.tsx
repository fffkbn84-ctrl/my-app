'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
interface ColumnRow {
  id: string
  title: string
  slug: string
  body: string | null
  thumbnail_url: string | null
  published_at: string | null
  created_at: string
}

interface ColumnForm {
  title: string
  slug: string
  body: string
  thumbnail_url: string
  published_at: string
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 5h10M6 5V3h4v2M5 5l1 8h4l1-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60) || `column-${Date.now()}`
}

const EMPTY_FORM: ColumnForm = { title: '', slug: '', body: '', thumbnail_url: '', published_at: '' }

export default function ColumnsPage() {
  const [columns, setColumns] = useState<ColumnRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<ColumnRow | null>(null)
  const [form, setForm] = useState<ColumnForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadColumns() }, [])

  async function loadColumns() {
    setLoading(true)
    const { data } = await createClient().from('columns').select('*').order('created_at', { ascending: false })
    setColumns(data ?? [])
    setLoading(false)
  }

  function openNew() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(c: ColumnRow) {
    setEditTarget(c)
    const pub = c.published_at ? new Date(c.published_at).toISOString().slice(0, 16) : ''
    setForm({ title: c.title, slug: c.slug, body: c.body ?? '', thumbnail_url: c.thumbnail_url ?? '', published_at: pub })
    setShowModal(true)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      body: form.body || null,
      thumbnail_url: form.thumbnail_url || null,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
    }
    let error
    if (editTarget) {
      ({ error } = await supabase.from('columns').update(payload).eq('id', editTarget.id))
    } else {
      ({ error } = await supabase.from('columns').insert(payload))
    }
    setSaving(false)
    if (error) { alert('エラー: ' + error.message); return }
    setShowModal(false)
    loadColumns()
  }

  async function handleDelete(id: string) {
    if (!confirm('このコラムを削除しますか？この操作は元に戻せません。')) return
    await createClient().from('columns').delete().eq('id', id)
    loadColumns()
  }

  async function togglePublish(c: ColumnRow) {
    const published_at = c.published_at ? null : new Date().toISOString()
    await createClient().from('columns').update({ published_at }).eq('id', c.id)
    loadColumns()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">コラム管理</h1>
        <button onClick={openNew} className="btn btn-primary" style={{ gap: 6 }}>
          <IconPlus /> 新規追加
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : columns.length === 0 ? (
          <div className="empty-state">コラムがありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>タイトル</th>
                  <th>slug</th>
                  <th>掲載状態</th>
                  <th>公開日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {columns.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500, fontSize: 13, maxWidth: 280 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{c.slug}</td>
                    <td>
                      <span className={c.published_at ? 'badge badge-published' : 'badge badge-draft'}>
                        {c.published_at ? '公開中' : '下書き'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {c.published_at ? new Date(c.published_at).toLocaleDateString('ja-JP') : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(c)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                          <IconEdit /> 編集
                        </button>
                        <button onClick={() => togglePublish(c)} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                          {c.published_at ? '非公開' : '公開'}
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm" style={{ gap: 4 }}>
                          <IconTrash />
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div className="modal-title">{editTarget ? 'コラム編集' : '新規コラム追加'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">タイトル <span style={{ color: '#DC2626' }}>*</span></label>
                <input
                  className="form-input"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || generateSlug(e.target.value) }))}
                  placeholder="例: 婚活を成功させる5つのポイント"
                />
              </div>
              <div>
                <label className="form-label">slug（URLに使用）</label>
                <input className="form-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="例: 5-tips-for-successful-marriage-hunting" />
              </div>
              <div>
                <label className="form-label">本文（Markdown）</label>
                <textarea
                  className="form-textarea"
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  rows={12}
                  placeholder="## 見出し&#10;&#10;本文をMarkdownで入力してください。"
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
              </div>
              <div>
                <label className="form-label">サムネイルURL（任意）</label>
                <input className="form-input" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label className="form-label">公開日時（空欄で下書き）</label>
                <input type="datetime-local" className="form-input" value={form.published_at} onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">キャンセル</button>
              <button onClick={handleSave} className="btn btn-primary" disabled={saving || !form.title}>
                {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : editTarget ? '更新' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
