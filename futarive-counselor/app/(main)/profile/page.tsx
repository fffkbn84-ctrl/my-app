'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Agency } from '@/lib/types'

type Step = 1 | 2 | 3 | 4

const AREAS = ['東京', '神奈川', '埼玉', '千葉', '大阪', '京都', '兵庫', 'オンライン', 'その他']
const FEE_OPTIONS = ['無料', '3,000円', '5,000円', '10,000円']

export default function ProfilePage() {
  const [step, setStep] = useState<Step>(1)
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved')
  const [toast, setToast] = useState('')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // フォームステート
  const [form, setForm] = useState({
    name: '',
    name_kana: '',
    agency_id: '',
    area: '',
    years_of_experience: '',
    online: false,
    photo_url: '',
    intro: '',
    message: '',
    specialties: [] as string[],
    qualifications: [] as string[],
    fee: '',
    success_count: '',
    experience_label: '',
    is_published: false,
  })
  const [chipInput, setChipInput] = useState({ specialties: '', qualifications: '' })

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: agRows } = await supabase.from('agencies').select('*').eq('owner_user_id', user.id)
      setIsOwner(!!(agRows && agRows.length > 0))
      setAgencies((agRows as Agency[]) ?? [])

      const { data: c } = await supabase.from('counselors').select('*').eq('owner_user_id', user.id).maybeSingle()
      if (c) {
        setCounselor(c as Counselor)
        setForm({
          name: c.name ?? '',
          name_kana: c.name_kana ?? '',
          agency_id: c.agency_id ?? '',
          area: c.area ?? '',
          years_of_experience: c.years_of_experience != null ? String(c.years_of_experience) : '',
          online: (c.specialties ?? []).includes('オンライン'),
          photo_url: c.photo_url ?? '',
          intro: c.intro ?? '',
          message: c.message ?? '',
          specialties: (c.specialties ?? []).filter((s: string) => s !== 'オンライン'),
          qualifications: c.qualifications ?? [],
          fee: c.fee ?? '',
          success_count: c.success_count != null ? String(c.success_count) : '',
          experience_label: c.experience_label ?? '',
          is_published: c.is_published ?? false,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const triggerAutoSave = useCallback(() => {
    setSaveStatus('dirty')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => { handleSave() }, 2000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  const handleSave = async () => {
    setSaveStatus('saving')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const specialties = [...form.specialties, ...(form.online ? ['オンライン'] : [])]

    const payload = {
      name: form.name,
      name_kana: form.name_kana || null,
      agency_id: form.agency_id || null,
      area: form.area || null,
      years_of_experience: form.years_of_experience ? parseInt(form.years_of_experience) : null,
      photo_url: form.photo_url || null,
      intro: form.intro || null,
      message: form.message || null,
      specialties,
      qualifications: form.qualifications.length > 0 ? form.qualifications : null,
      fee: form.fee || null,
      success_count: form.success_count ? parseInt(form.success_count) : null,
      experience_label: form.experience_label || null,
      is_published: form.is_published,
      owner_user_id: user.id,
    }

    if (counselor?.id) {
      await supabase.from('counselors').update(payload).eq('id', counselor.id)
    } else {
      const { data: inserted } = await supabase.from('counselors').insert(payload).select().maybeSingle()
      if (inserted) setCounselor(inserted as Counselor)
    }
    setSaveStatus('saved')
    showToast('保存しました')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const updateForm = (key: keyof typeof form, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
    triggerAutoSave()
  }

  const addChip = (field: 'specialties' | 'qualifications') => {
    const val = chipInput[field].trim()
    if (!val) return
    updateForm(field, [...form[field], val])
    setChipInput(prev => ({ ...prev, [field]: '' }))
  }
  const removeChip = (field: 'specialties' | 'qualifications', idx: number) => {
    updateForm(field, form[field].filter((_, i) => i !== idx))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !counselor?.id) return
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${counselor.id}/profile.${ext}`
    const { error } = await supabase.storage.from('counselor-media').upload(path, file, { upsert: true })
    if (error) { showToast('アップロードに失敗しました'); return }
    const { data: { publicUrl } } = supabase.storage.from('counselor-media').getPublicUrl(path)
    updateForm('photo_url', publicUrl)
    showToast('写真をアップロードしました')
  }

  if (loading) {
    return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>
  }

  const STEPS = ['基本', '人となり', '料金と成果', '確認']

  return (
    <div style={{ padding: '28px 24px', maxWidth: 680, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>PROFILE</div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>プロフィール編集</h1>

      {/* ステップバー */}
      <div className="step-bar" style={{ marginBottom: 32 }}>
        {STEPS.map((label, i) => {
          const n = (i + 1) as Step
          const state = step === n ? 'active' : step > n ? 'done' : ''
          return (
            <div key={n} className={`step-item ${state}`}>
              <div className="step-circle">{step > n ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6l2.5 2.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : n}</div>
              <span className="step-label">{label}</span>
            </div>
          )
        })}
      </div>

      {/* Step 1: 基本 */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="kc-label">氏名 <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="kc-input" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="田中 美紀" />
          </div>
          <div>
            <label className="kc-label">ふりがな</label>
            <input className="kc-input" value={form.name_kana} onChange={e => updateForm('name_kana', e.target.value)} placeholder="たなか みき" />
          </div>
          <div>
            <label className="kc-label">所属相談所 <span style={{ color: 'var(--danger)' }}>*</span></label>
            {isOwner ? (
              <select className="kc-select" value={form.agency_id} onChange={e => updateForm('agency_id', e.target.value)}>
                <option value="">選択してください</option>
                {agencies.map(ag => <option key={ag.id} value={ag.id}>{ag.name}</option>)}
              </select>
            ) : (
              <input className="kc-input" value={agencies[0]?.name ?? ''} readOnly style={{ opacity: .6 }} />
            )}
          </div>
          <div>
            <label className="kc-label">活動エリア</label>
            <select className="kc-select" value={form.area} onChange={e => updateForm('area', e.target.value)}>
              <option value="">選択してください</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="kc-label">経験年数</label>
            <input className="kc-input" type="number" min={0} max={50} value={form.years_of_experience} onChange={e => updateForm('years_of_experience', e.target.value)} placeholder="5" style={{ maxWidth: 120 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label className="kc-toggle">
              <input type="checkbox" checked={form.online} onChange={e => updateForm('online', e.target.checked)} />
              <span className="kc-toggle-slider"/>
            </label>
            <span style={{ fontSize: '13px', color: 'var(--text)' }}>オンライン対応あり</span>
          </div>
          <div>
            <label className="kc-label">プロフィール写真</label>
            {form.photo_url && (
              <div style={{ marginBottom: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photo_url} alt="プロフィール" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload}
              style={{ fontSize: '13px', color: 'var(--text-mid)' }} disabled={!counselor?.id} />
            {!counselor?.id && <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: 4 }}>先に保存してから写真をアップロードできます</p>}
          </div>
        </div>
      )}

      {/* Step 2: 人となり */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="kc-label">自己紹介（200文字目安）</label>
            <textarea className="kc-textarea" style={{ minHeight: 120 }} value={form.intro}
              onChange={e => updateForm('intro', e.target.value)}
              placeholder="婚活のサポートを通じて、あなたらしいパートナーとの出会いを一緒に探していきます..." />
            <div style={{ fontSize: '11px', color: form.intro.length > 220 ? 'var(--danger)' : 'var(--text-light)', marginTop: 4, textAlign: 'right' }}>
              {form.intro.length}/200
            </div>
          </div>
          <div>
            <label className="kc-label">ご来談者へのメッセージ（100文字目安）</label>
            <textarea className="kc-textarea" style={{ minHeight: 80 }} value={form.message}
              onChange={e => updateForm('message', e.target.value)}
              placeholder="まずはお気軽にお話しましょう。" />
          </div>
          <div>
            <label className="kc-label">得意分野（Enter で追加）</label>
            <div className="chip-wrap">
              {form.specialties.map((s, i) => (
                <span key={i} className="chip">
                  {s}
                  <button onClick={() => removeChip('specialties', i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-deep)', lineHeight: 1, padding: 0, fontSize: 13 }}>×</button>
                </span>
              ))}
              <input
                className="chip-input"
                placeholder="例: 再婚、年の差婚"
                value={chipInput.specialties}
                onChange={e => setChipInput(prev => ({ ...prev, specialties: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip('specialties') } }}
              />
            </div>
          </div>
          <div>
            <label className="kc-label">保有資格（Enter で追加）</label>
            <div className="chip-wrap">
              {form.qualifications.map((q, i) => (
                <span key={i} className="chip">
                  {q}
                  <button onClick={() => removeChip('qualifications', i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-deep)', lineHeight: 1, padding: 0, fontSize: 13 }}>×</button>
                </span>
              ))}
              <input
                className="chip-input"
                placeholder="例: IBJ認定カウンセラー"
                value={chipInput.qualifications}
                onChange={e => setChipInput(prev => ({ ...prev, qualifications: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip('qualifications') } }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 料金と成果 */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="kc-label">相談料</label>
            <select className="kc-select" value={form.fee} onChange={e => updateForm('fee', e.target.value)} style={{ maxWidth: 200 }}>
              <option value="">選択してください</option>
              {FEE_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="kc-label">成婚実績（件）</label>
            <input className="kc-input" type="number" min={0} value={form.success_count}
              onChange={e => updateForm('success_count', e.target.value)}
              placeholder="12" style={{ maxWidth: 160 }} />
          </div>
          <div>
            <label className="kc-label">経験ラベル（自由記述）</label>
            <input className="kc-input" value={form.experience_label}
              onChange={e => updateForm('experience_label', e.target.value)}
              placeholder="例: 10年以上の婚活支援経験" />
          </div>
        </div>
      )}

      {/* Step 4: 確認 */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* プレビューカード */}
          <div className="kc-card-warm" style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>PREVIEW</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: form.photo_url ? 'transparent' : 'linear-gradient(135deg, var(--accent-pale), var(--accent-dim))',
                border: '2px solid var(--border)',
                overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {form.photo_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={form.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="10" r="5" stroke="var(--accent)" strokeWidth="1.5"/><path d="M4 24c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Shippori Mincho, serif', fontWeight: 600, fontSize: 17, color: 'var(--text-deep)' }}>{form.name || '（氏名未入力）'}</div>
                {form.name_kana && <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>{form.name_kana}</div>}
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {form.area && <span className="kc-badge kc-badge-open" style={{ fontSize: 10 }}>{form.area}</span>}
                  {form.online && <span className="kc-badge kc-badge-open" style={{ fontSize: 10 }}>オンライン</span>}
                  {form.fee && <span className="kc-badge kc-badge-booking" style={{ fontSize: 10 }}>{form.fee}</span>}
                </div>
                {form.specialties.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {form.specialties.map((s, i) => <span key={i} style={{ fontSize: 11, color: 'var(--text-mid)', background: 'var(--bg-elev)', padding: '2px 8px', borderRadius: 20 }}>{s}</span>)}
                  </div>
                )}
                {form.intro && <p style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 10, lineHeight: 1.7 }}>{form.intro.slice(0, 80)}{form.intro.length > 80 ? '...' : ''}</p>}
              </div>
            </div>
          </div>

          {/* 公開設定 */}
          <div className="kc-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-deep)' }}>プロフィールを公開する</div>
                <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 3 }}>Kinda talk に表示されます</div>
              </div>
              <label className="kc-toggle">
                <input type="checkbox" checked={form.is_published} onChange={e => updateForm('is_published', e.target.checked)} />
                <span className="kc-toggle-slider"/>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ナビボタン */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1) as Step)}
          className="kc-btn kc-btn-ghost"
          style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          前へ
        </button>
        {step < 4 ? (
          <button onClick={() => setStep(prev => (prev + 1) as Step)} className="kc-btn kc-btn-primary">
            次へ
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : (
          <button onClick={handleSave} className="kc-btn kc-btn-primary" disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? '保存中...' : '保存する'}
          </button>
        )}
      </div>

      {/* 保存状態インジケータ */}
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        {saveStatus === 'saved' && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ 自動保存済み</span>}
        {saveStatus === 'dirty' && <span style={{ fontSize: 11, color: 'var(--warning)' }}>未保存の変更があります</span>}
        {saveStatus === 'saving' && <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>保存中...</span>}
      </div>

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}
