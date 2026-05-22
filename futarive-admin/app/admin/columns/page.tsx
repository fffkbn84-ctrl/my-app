'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FRONTSITE_URL } from '@/lib/config'
import { formatLastReviewed, freshnessLevel, freshnessColor } from '@/lib/freshness'

interface ColumnRow {
  id: string
  title: string
  slug: string
  body: string | null
  thumbnail_url: string | null
  published_at: string | null
  created_at: string
  last_reviewed_at: string | null
}

type SortKey = 'created_at' | 'last_reviewed_at'

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
function IconExternal() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M5 2H2v10h10V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 2h4v4M12 2L7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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
  const [sortKey, setSortKey] = useState<SortKey>('last_reviewed_at')

  useEffect(() => { loadColumns(sortKey) }, [sortKey])

  async function loadColumns(key: SortKey) {
    setLoading(true)
    const { data } = await createClient()
      .from('columns')
      .select('*')
      .order(key, { ascending: key === 'last_reviewed_at' })
    setColumns(data ?? [])
    setLoading(false)
  }

  async function markReviewed(id: string) {
    await createClient().from('columns').update({ last_reviewed_at: new Date().toISOString() }).eq('id', id)
    loadColumns(sortKey)
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
      last_reviewed_at: new Date().toISOString(),
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
    loadColumns(sortKey)
  }

  async function handleDelete(id: string) {
    if (!confirm('この Kinda voice を削除しますか？この操作は元に戻せません。')) return
    await createClient().from('columns').delete().eq('id', id)
    loadColumns(sortKey)
  }

  async function togglePublish(c: ColumnRow) {
    const published_at = c.published_at ? null : new Date().toISOString()
    await createClient()
      .from('columns')
      .update({ published_at, last_reviewed_at: new Date().toISOString() })
      .eq('id', c.id)
    loadColumns(sortKey)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kinda voices 管理</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>並び順</span>
          <select
            className="form-select"
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            style={{ width: 'auto', fontSize: 12, padding: '4px 28px 4px 8px' }}
          >
            <option value="last_reviewed_at">最終点検（古い順）</option>
            <option value="created_at">作成日（新しい順）</option>
          </select>
          <button onClick={openNew} className="btn btn-primary" style={{ gap: 6 }}>
            <IconPlus /> 新規追加
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : columns.length === 0 ? (
          <div className="empty-state">Kinda voices がありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>タイトル</th>
                  <th>slug</th>
                  <th>掲載状態</th>
                  <th>公開日</th>
                  <th>最終点検</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {columns.map(c => {
                  const level = freshnessLevel(c.last_reviewed_at)
                  return (
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
                    <td style={{ fontSize: 12, color: freshnessColor(level), whiteSpace: 'nowrap', fontWeight: level === 'fresh' ? 400 : 600 }}>
                      {formatLastReviewed(c.last_reviewed_at)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button onClick={() => openEdit(c)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                          <IconEdit /> 編集
                        </button>
                        <button onClick={() => markReviewed(c.id)} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} title="内容を確認した時刻を更新します">
                          点検OK
                        </button>
                        {c.published_at && (
                          <a
                            href={`${FRONTSITE_URL}/columns/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ gap: 4, fontSize: 11 }}
                            title="公開ページを別タブで開く"
                          >
                            <IconExternal /> プレビュー
                          </a>
                        )}
                        <button onClick={() => togglePublish(c)} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                          {c.published_at ? '非公開' : '公開'}
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm" style={{ gap: 4 }}>
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div className="modal-title">{editTarget ? 'Kinda voice 編集' : '新規 Kinda voice 追加'}</div>
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
