'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
interface EpisodeRow {
  id: string
  agency_id: string | null
  counselor_id: string | null
  title: string
  slug: string
  excerpt: string | null
  period: string | null
  year: number | null
  is_published: boolean
  sympathy_count: number
  created_at: string
}

interface AgencyRow { id: string; name: string }
interface CounselorRow { id: string; name: string }

type EpisodeFull = EpisodeRow & { agency_name: string; counselor_name: string }

interface AddForm {
  title: string
  agencyId: string
  counselorId: string
  excerpt: string
  period: string
  year: string
  isPublished: boolean
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function generateSlug(title: string): string {
  const map: Record<string, string> = { あ:'a',い:'i',う:'u',え:'e',お:'o',か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko' }
  return title.split('').map(c => map[c] || c).join('').toLowerCase()
    .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60) || `episode-${Date.now()}`
}

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<EpisodeFull[]>([])
  const [agencies, setAgencies] = useState<AgencyRow[]>([])
  const [counselors, setCounselors] = useState<CounselorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<AddForm>({
    title: '', agencyId: '', counselorId: '', excerpt: '',
    period: '', year: String(new Date().getFullYear()), isPublished: false,
  })

  useEffect(() => {
    loadEpisodes()
    const sb = createClient()
    sb.from('agencies').select('*').order('name').then(({ data }) => setAgencies(data ?? []))
    sb.from('counselors').select('*').order('name').then(({ data }) => setCounselors(data ?? []))
  }, [])

  async function loadEpisodes() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('episodes')
      .select('*, agencies(name), counselors(name)')
      .order('created_at', { ascending: false })
    setEpisodes(
      (data ?? []).map((e: Record<string, unknown>) => ({
        ...e,
        agency_name: (e.agencies as { name?: string } | null)?.name ?? '—',
        counselor_name: (e.counselors as { name?: string } | null)?.name ?? '—',
      })) as EpisodeFull[]
    )
    setLoading(false)
  }

  async function togglePublish(id: string, current: boolean) {
    await createClient().from('episodes').update({ is_published: !current }).eq('id', id)
    loadEpisodes()
  }

  async function handleAdd() {
    if (!form.title || !form.excerpt) return
    setSaving(true)
    const slug = generateSlug(form.title)
    const supabase = createClient()
    const { error } = await supabase.from('episodes').insert({
      title: form.title,
      slug,
      agency_id: form.agencyId || null,
      counselor_id: form.counselorId || null,
      excerpt: form.excerpt,
      period: form.period || null,
      year: form.year ? Number(form.year) : null,
      is_published: form.isPublished,
      sympathy_count: 0,
    })
    setSaving(false)
    if (error) { alert('エラー: ' + error.message); return }
    setShowModal(false)
    setForm({ title: '', agencyId: '', counselorId: '', excerpt: '', period: '', year: String(new Date().getFullYear()), isPublished: false })
    loadEpisodes()
  }

  const draft = episodes.filter(e => !e.is_published)
  const published = episodes.filter(e => e.is_published)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">成婚エピソード管理</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: 6 }}>
          <IconPlus /> 新規追加
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Draft column */}
          <div>
            <div style={{ fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '.06em', color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase' }}>
              下書き ({draft.length})
            </div>
            <div className="kanban-col">
              {draft.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>なし</div>}
              {draft.map(e => (
                <div key={e.id} className="kanban-card">
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{e.title.slice(0, 50)}{e.title.length > 50 && '…'}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                    {e.agency_name}{e.period && ` · ${e.period}`}
                  </div>
                  <button onClick={() => togglePublish(e.id, false)} className="btn btn-sm btn-primary" style={{ fontSize: 11 }}>公開する</button>
                </div>
              ))}
            </div>
          </div>

          {/* Published column */}
          <div>
            <div style={{ fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '.06em', color: '#166534', marginBottom: 10, textTransform: 'uppercase' }}>
              公開中 ({published.length})
            </div>
            <div className="kanban-col">
              {published.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>なし</div>}
              {published.map(e => (
                <div key={e.id} className="kanban-card">
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{e.title.slice(0, 50)}{e.title.length > 50 && '…'}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                    {e.agency_name}{e.period && ` · ${e.period}`}
                  </div>
                  <button onClick={() => togglePublish(e.id, true)} className="btn btn-sm btn-ghost" style={{ fontSize: 11 }}>非公開にする</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">エピソード新規追加</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">タイトル <span style={{ color: '#DC2626' }}>*</span></label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="例: 迷い続けた私が、やっと決めた日のこと" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">相談所</label>
                  <select className="form-select" value={form.agencyId} onChange={e => setForm(f => ({ ...f, agencyId: e.target.value }))}>
                    <option value="">選択してください</option>
                    {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">カウンセラー（任意）</label>
                  <select className="form-select" value={form.counselorId} onChange={e => setForm(f => ({ ...f, counselorId: e.target.value }))}>
                    <option value="">選択しない</option>
                    {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">概要 <span style={{ color: '#DC2626' }}>*</span>（100文字程度）</label>
                <textarea className="form-textarea" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3} placeholder="例: 30代で婚活を始めたAさんの体験談。" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">期間（例: 9ヶ月）</label>
                  <input className="form-input" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="9ヶ月" />
                </div>
                <div>
                  <label className="form-label">成婚年（例: 2025）</label>
                  <input className="form-input" type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
                  <span style={{ fontSize: 13 }}>今すぐ公開する</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">キャンセル</button>
              <button onClick={handleAdd} className="btn btn-primary" disabled={saving || !form.title || !form.excerpt}>
                {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
