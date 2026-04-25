'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Agency } from '@/lib/types'

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved')
  const [toast, setToast] = useState('')
  const [savedOnce, setSavedOnce] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    website_url: '',
    business_hours_text: '',
    consultation_start_time: '10:00',
    consultation_end_time: '19:00',
    closed_weekdays: [] as number[],
    default_slot_minutes: 60,
  })

  const formRef = useRef(form)
  const selectedIdRef = useRef(selectedId)
  useEffect(() => { formRef.current = form }, [form])
  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])

  const syncFromAgency = (ag: Agency) => {
    setForm({
      name: ag.name ?? '',
      description: ag.description ?? '',
      website_url: ag.website_url ?? '',
      business_hours_text: ag.business_hours_text ?? '',
      consultation_start_time: (ag.consultation_start_time ?? '10:00').slice(0, 5),
      consultation_end_time: (ag.consultation_end_time ?? '19:00').slice(0, 5),
      closed_weekdays: ag.closed_weekdays ?? [],
      default_slot_minutes: ag.default_slot_minutes ?? 60,
    })
  }

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
        syncFromAgency(list[0])
        setSavedOnce(true)
      }
      setLoading(false)
      // 次tickでhydratedを立てる（初期セットで自動保存が走らないように）
      setTimeout(() => setHydrated(true), 50)
    }
    load()
  }, [])

  // 自動保存：form変更を2秒デバウンスで保存
  useEffect(() => {
    if (!hydrated || !selectedId) return
    setSaveStatus('dirty')
    const t = setTimeout(() => { void save() }, 2000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, hydrated, selectedId])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const save = async (): Promise<boolean> => {
    const id = selectedIdRef.current
    if (!id) return false
    const f = formRef.current
    if (f.consultation_start_time >= f.consultation_end_time) {
      showToast('面談可能時間：終了は開始より後にしてください')
      setSaveStatus('dirty')
      return false
    }
    setSaveStatus('saving')
    const supabase = createClient()
    const payload = {
      name: f.name,
      description: f.description || null,
      website_url: f.website_url || null,
      business_hours_text: f.business_hours_text || null,
      consultation_start_time: f.consultation_start_time || null,
      consultation_end_time: f.consultation_end_time || null,
      closed_weekdays: f.closed_weekdays.length > 0 ? f.closed_weekdays : null,
      default_slot_minutes: f.default_slot_minutes || null,
    }
    const { error } = await supabase.from('agencies').update(payload).eq('id', id)
    if (error) {
      console.error('[agency save] error', error)
      showToast(`保存失敗：${describeError(error)}`)
      setSaveStatus('dirty')
      return false
    }
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...payload } : a))
    setSaveStatus('saved')
    setSavedOnce(true)
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
      syncFromAgency(newAg)
      showToast('相談所を追加しました')
    }
  }

  const handleSelectChange = (id: string) => {
    setSelectedId(id)
    const ag = agencies.find(a => a.id === id)
    if (ag) syncFromAgency(ag)
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

      {/* 保存完了後の次ステップ案内 */}
      {savedOnce && saveStatus === 'saved' && (
        <div className="kc-card" style={{
          padding: 18, marginBottom: 24,
          background: 'var(--accent-pale)',
          border: '1px solid var(--accent-dim)',
          borderRadius: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Shippori Mincho, serif', fontWeight: 600, fontSize: 14, color: 'var(--text-deep)', marginBottom: 4 }}>
                相談所プロフィールを保存しました
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 12 }}>
                続いて、あなた自身のカウンセラープロフィールを作成しましょう。<br/>
                お客様に見ていただく担当者情報を整えます。
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/profile" className="kc-btn kc-btn-primary kc-btn-sm" style={{ textDecoration: 'none' }}>
                  カウンセラープロフィールを作成する
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/dashboard" className="kc-btn kc-btn-ghost kc-btn-sm" style={{ textDecoration: 'none' }}>
                  ダッシュボードへ
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {agencies.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <label className="kc-label">編集対象の相談所</label>
          <select className="kc-select" value={selectedId} onChange={e => handleSelectChange(e.target.value)}>
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

        {/* 営業時間（自由記述） */}
        <div>
          <label className="kc-label">営業時間（自由記述）</label>
          <textarea
            className="kc-textarea"
            style={{ minHeight: 70 }}
            value={form.business_hours_text}
            onChange={e => update('business_hours_text', e.target.value)}
            placeholder="例：平日 10:00〜19:00 / 土日 10:00〜18:00"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            お客様向けに表示される営業時間の説明文です。
          </p>
        </div>

        {/* 面談可能時間 */}
        <div>
          <label className="kc-label">面談可能時間</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <input
              className="kc-input"
              type="time"
              step={1800}
              value={form.consultation_start_time}
              onChange={e => update('consultation_start_time', e.target.value)}
              style={{ maxWidth: 130 }}
            />
            <span style={{ color: 'var(--text-mid)' }}>〜</span>
            <input
              className="kc-input"
              type="time"
              step={1800}
              value={form.consultation_end_time}
              onChange={e => update('consultation_end_time', e.target.value)}
              style={{ maxWidth: 130 }}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            予約枠カレンダーの時刻ピッカーがこの範囲に絞られます。
          </p>
        </div>

        {/* 定休日 */}
        <div>
          <label className="kc-label">定休日</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { v: 0, label: '日', danger: true },
              { v: 1, label: '月' },
              { v: 2, label: '火' },
              { v: 3, label: '水' },
              { v: 4, label: '木' },
              { v: 5, label: '金' },
              { v: 6, label: '土', accent: true },
            ].map(d => {
              const checked = form.closed_weekdays.includes(d.v)
              return (
                <button
                  key={d.v}
                  type="button"
                  onClick={() => {
                    const next = checked
                      ? form.closed_weekdays.filter(w => w !== d.v)
                      : [...form.closed_weekdays, d.v].sort()
                    update('closed_weekdays', next)
                  }}
                  style={{
                    width: 38, height: 38,
                    borderRadius: 999,
                    border: '1px solid ' + (checked ? 'var(--accent)' : 'var(--border)'),
                    background: checked ? 'var(--accent)' : 'transparent',
                    color: checked ? '#1A130A' : (d.danger ? 'var(--danger)' : d.accent ? 'var(--accent)' : 'var(--text)'),
                    fontFamily: 'Noto Sans JP, sans-serif',
                    fontWeight: 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'background .15s, border-color .15s',
                  }}
                  aria-pressed={checked}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            選択した曜日は予約枠カレンダーで「定休日」として表示されます。
          </p>
        </div>

        {/* 1枠あたりの所要時間 */}
        <div>
          <label className="kc-label">面談1枠の所要時間</label>
          <select
            className="kc-select"
            style={{ maxWidth: 200 }}
            value={String(form.default_slot_minutes)}
            onChange={e => update('default_slot_minutes', Number(e.target.value))}
          >
            <option value="30">30分</option>
            <option value="45">45分</option>
            <option value="60">60分（1時間）</option>
            <option value="75">75分</option>
            <option value="90">90分（1.5時間）</option>
            <option value="120">120分（2時間）</option>
          </select>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            予約枠の自動生成と「枠を追加」の終了時刻のデフォルトに使われます。
          </p>
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
