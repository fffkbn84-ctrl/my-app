'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Agency } from '@/lib/types'

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved')
  const [toast, setToast] = useState('')
  const [hydrated, setHydrated] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    website_url: '',
  })

  const formRef = useRef(form)
  const selectedIdRef = useRef(selectedId)
  useEffect(() => { formRef.current = form }, [form])
  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('agencies').select('*').eq('owner_user_id', user.id).order('created_at')
      const list = (data as Agency[]) ?? []
      setAgencies(list)
      if (list[0]) {
        setSelectedId(list[0].id)
        setForm({
          name: list[0].name ?? '',
          description: list[0].description ?? '',
          website_url: list[0].website_url ?? '',
        })
      }
      setLoading(false)
      setTimeout(() => setHydrated(true), 0)
    }
    load()
  }, [])

  // 選択相談所が変わったらフォームを同期
  useEffect(() => {
    if (!selectedId) return
    const ag = agencies.find(a => a.id === selectedId)
    if (!ag) return
    setForm({
      name: ag.name ?? '',
      description: ag.description ?? '',
      website_url: ag.website_url ?? '',
    })
  }, [selectedId, agencies])

  // 自動保存
  useEffect(() => {
    if (!hydrated || !selectedId) return
    setSaveStatus('dirty')
    const t = setTimeout(() => { void save() }, 2000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, hydrated, selectedId])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const save = async (): Promise<boolean> => {
    const id = selectedIdRef.current
    if (!id) return false
    const f = formRef.current
    setSaveStatus('saving')
    const supabase = createClient()
    const { error } = await supabase.from('agencies').update({
      name: f.name,
      description: f.description || null,
      website_url: f.website_url || null,
    }).eq('id', id)
    if (error) {
      console.error('[agency save] error', error)
      showToast(`保存失敗：${describeError(error)}`)
      setSaveStatus('dirty')
      return false
    }
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, name: f.name, description: f.description || null, website_url: f.website_url || null } : a))
    setSaveStatus('saved')
    return true
  }

  const handleCreate = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('agencies').insert({
      name: '新しい相談所',
      description: null,
      website_url: null,
      owner_user_id: user.id,
    }).select().maybeSingle()
    if (error) {
      console.error('[agency create] error', error)
      showToast(`作成失敗：${describeError(error)}`)
      return
    }
    if (data) {
      const newAg = data as Agency
      setAgencies(prev => [...prev, newAg])
      setSelectedId(newAg.id)
      showToast('相談所を追加しました')
    }
  }

  const handleManualSave = async () => {
    const ok = await save()
    if (ok) showToast('保存しました')
  }

  const update = (key: keyof typeof form, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

  if (agencies.length === 0) {
    return (
      <div style={{ padding: '28px 24px', maxWidth: 680 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>AGENCY</div>
        <h1 className="page-title" style={{ marginBottom: 24 }}>相談所プロフィール</h1>
        <div className="kc-card" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16, lineHeight: 1.7 }}>
            まだ相談所が登録されていません。<br/>
            最初の相談所を作成してプロフィールを整えましょう。
          </p>
          <button className="kc-btn kc-btn-primary" onClick={handleCreate}>相談所を作成する</button>
        </div>
        {toast && <div className="kc-toast">{toast}</div>}
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 24px', maxWidth: 680, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>AGENCY</div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>相談所プロフィール</h1>

      {agencies.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <label className="kc-label">編集対象の相談所</label>
          <select className="kc-select" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label className="kc-label">相談所名 <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input className="kc-input" value={form.name} onChange={e => update('name', e.target.value)} placeholder="ブライダルハウス東京" />
        </div>
        <div>
          <label className="kc-label">紹介文</label>
          <textarea className="kc-textarea" style={{ minHeight: 140 }} value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="当相談所は、おひとりおひとりに寄り添ったサポートを心がけています..." />
        </div>
        <div>
          <label className="kc-label">WebサイトURL</label>
          <input className="kc-input" type="url" value={form.website_url}
            onChange={e => update('website_url', e.target.value)}
            placeholder="https://example.com" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12, flexWrap: 'wrap' }}>
        <button className="kc-btn kc-btn-ghost" onClick={handleCreate}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          別の相談所を追加
        </button>
        <button className="kc-btn kc-btn-primary" onClick={handleManualSave} disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? '保存中...' : '保存する'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14 }}>
        {saveStatus === 'saved' && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ 自動保存済み</span>}
        {saveStatus === 'dirty' && <span style={{ fontSize: 11, color: 'var(--warning)' }}>未保存の変更があります</span>}
        {saveStatus === 'saving' && <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>保存中...</span>}
      </div>

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}
