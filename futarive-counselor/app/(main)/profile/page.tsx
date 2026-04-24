'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import PhotoCropModal from '@/components/profile/PhotoCropModal'
import type { Counselor, Agency } from '@/lib/types'

type Step = 1 | 2 | 3 | 4

const AREAS = [
  '全国', 'オンライン',
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
  'その他',
]
const FEE_OPTIONS = ['無料', '3,000円', '5,000円', '10,000円']

const ROOKIE_TAG = '新人'
const NEW_SHOP_TAG = '新規店舗'
const ONLINE_TAG = 'オンライン'
const AUTO_TAGS = [ROOKIE_TAG, NEW_SHOP_TAG, ONLINE_TAG]

// 手入力の得意分野（自動タグを除外）
function userSpecialties(all: string[] | null | undefined): string[] {
  return (all ?? []).filter(s => !AUTO_TAGS.includes(s))
}

// 経験年数が1年未満なら「新人」タグを付与
function deriveAutoTags(form: { years_of_experience: string; online: boolean }, agency: Agency | null) {
  const tags: string[] = []
  if (form.online) tags.push(ONLINE_TAG)
  const years = form.years_of_experience ? parseInt(form.years_of_experience) : null
  if (years !== null && years < 1) tags.push(ROOKIE_TAG)
  if (agency?.created_at) {
    const opened = new Date(agency.created_at).getTime()
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000
    if (opened > oneYearAgo) tags.push(NEW_SHOP_TAG)
  }
  return tags
}

export default function ProfilePage() {
  const [step, setStep] = useState<Step>(1)
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved')
  const [toast, setToast] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const [cropFile, setCropFile] = useState<File | null>(null)

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

  const counselorRef = useRef<Counselor | null>(null)
  const formRef = useRef(form)
  const agenciesRef = useRef<Agency[]>([])
  const isOwnerRef = useRef(false)
  useEffect(() => { counselorRef.current = counselor }, [counselor])
  useEffect(() => { formRef.current = form }, [form])
  useEffect(() => { agenciesRef.current = agencies }, [agencies])
  useEffect(() => { isOwnerRef.current = isOwner }, [isOwner])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: agRows } = await supabase.from('agencies').select('*').eq('owner_user_id', user.id)
      const owns = !!(agRows && agRows.length > 0)
      setIsOwner(owns)
      setAgencies((agRows as Agency[]) ?? [])

      const { data: c } = await supabase.from('counselors').select('*').eq('owner_user_id', user.id).maybeSingle()
      if (c) {
        setCounselor(c as Counselor)
        setForm({
          name: c.name ?? '',
          name_kana: c.name_kana ?? '',
          agency_id: c.agency_id ?? (owns ? agRows?.[0]?.id ?? '' : ''),
          area: c.area ?? '',
          years_of_experience: c.years_of_experience != null ? String(c.years_of_experience) : '',
          online: (c.specialties ?? []).includes(ONLINE_TAG),
          photo_url: c.photo_url ?? '',
          intro: c.intro ?? '',
          message: c.message ?? '',
          specialties: userSpecialties(c.specialties),
          qualifications: c.qualifications ?? [],
          fee: c.fee ?? '',
          success_count: c.success_count != null ? String(c.success_count) : '',
          experience_label: c.experience_label ?? '',
          is_published: c.is_published ?? false,
        })
      } else if (owns && agRows?.[0]?.id) {
        // オーナーの初期値：最初の相談所をデフォルト選択
        setForm(prev => ({ ...prev, agency_id: agRows[0].id }))
      }
      setLoading(false)
      // 初期ロード直後は dirty にしたくないので1tick後にhydrated
      setTimeout(() => setHydrated(true), 0)
    }
    load()
  }, [])

  // 自動保存：form変更を2秒デバウンスで保存
  useEffect(() => {
    if (!hydrated) return
    setSaveStatus('dirty')
    const timer = setTimeout(() => { void save() }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, hydrated])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const buildPayload = (userId: string) => {
    const f = formRef.current
    const ags = agenciesRef.current
    const current = counselorRef.current
    const matchedAgency = ags.find(a => a.id === f.agency_id) ?? ags[0] ?? null
    const autoTags = deriveAutoTags(f, matchedAgency)
    const merged = Array.from(new Set([...f.specialties, ...autoTags]))

    // オーナーで agency_id が未設定なら最初の相談所を自動セット
    const agencyId = f.agency_id
      || (isOwnerRef.current && ags[0]?.id)
      || current?.agency_id
      || null

    return {
      name: f.name,
      name_kana: f.name_kana || null,
      agency_id: agencyId,
      area: f.area || null,
      years_of_experience: f.years_of_experience !== '' ? parseInt(f.years_of_experience) : null,
      photo_url: f.photo_url || null,
      intro: f.intro || null,
      message: f.message || null,
      specialties: merged.length > 0 ? merged : null,
      qualifications: f.qualifications.length > 0 ? f.qualifications : null,
      fee: f.fee || null,
      success_count: f.success_count !== '' ? parseInt(f.success_count) : null,
      experience_label: f.experience_label || null,
      is_published: f.is_published,
      owner_user_id: userId,
    }
  }

  // 写真アップロード用に「まず行を作る」処理（INSERTのみ）
  const ensureCounselorRow = async (): Promise<Counselor | null> => {
    if (counselorRef.current?.id) return counselorRef.current
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { showToast('ログインが切れています'); return null }
    const base = buildPayload(user.id)
    const payload = { ...base, name: base.name || '（未入力）' }
    const { data, error } = await supabase.from('counselors').insert(payload).select().maybeSingle()
    if (error) {
      console.error('[ensureCounselorRow] insert error', error)
      showToast(`保存に失敗：${describeError(error)}`)
      return null
    }
    if (data) {
      setCounselor(data as Counselor)
      return data as Counselor
    }
    return null
  }

  const save = async (): Promise<boolean> => {
    setSaveStatus('saving')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showToast('ログインが切れています')
      setSaveStatus('dirty')
      return false
    }
    const payload = buildPayload(user.id)

    try {
      if (counselorRef.current?.id) {
        const { error } = await supabase.from('counselors').update(payload).eq('id', counselorRef.current.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('counselors').insert(payload).select().maybeSingle()
        if (error) throw error
        if (data) setCounselor(data as Counselor)
      }
      setSaveStatus('saved')
      return true
    } catch (e: unknown) {
      console.error('[profile save] error', e)
      showToast(`保存に失敗：${describeError(e)}`)
      setSaveStatus('dirty')
      return false
    }
  }

  const handleManualSave = async () => {
    const ok = await save()
    if (ok) showToast('保存しました')
  }

  const updateForm = (key: keyof typeof form, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // 同じファイルを再選択しても onChange が発火するように input を空にする
    e.target.value = ''
    if (!file) return

    // 形式チェック
    if (!/^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.type)) {
      showToast('JPG / PNG / WebP 形式のみアップロードできます')
      return
    }
    // サイズチェック
    const MAX_BYTES = 10 * 1024 * 1024
    if (file.size > MAX_BYTES) {
      showToast(`ファイルサイズが大きすぎます（${Math.round(file.size / 1024 / 1024)}MB）。10MB以下でお試しください`)
      return
    }
    setCropFile(file)
  }

  const handleCropConfirm = async (cropped: File) => {
    setCropFile(null)
    showToast('写真をアップロード中...')
    const supabase = createClient()
    let c = counselorRef.current
    if (!c?.id) {
      c = await ensureCounselorRow()
      if (!c?.id) return
    }
    const path = `${c.id}/profile-${Date.now()}.jpg`
    const { error } = await supabase.storage.from('counselor-media').upload(path, cropped, {
      upsert: true,
      contentType: 'image/jpeg',
    })
    if (error) {
      console.error('[photo upload] error', error)
      showToast(`アップロード失敗：${describeError(error)}`)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('counselor-media').getPublicUrl(path)
    updateForm('photo_url', `${publicUrl}?t=${Date.now()}`)
    showToast('写真をアップロードしました')
  }

  if (loading) {
    return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>
  }

  const STEPS = ['基本', '人となり', '料金と成果', '確認']
  const selectedAgency = agencies.find(a => a.id === form.agency_id) ?? null

  return (
    <div style={{ padding: '28px 24px', maxWidth: 680, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>PROFILE</div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>プロフィール編集</h1>

      <div className="step-bar" style={{ marginBottom: 32 }}>
        {STEPS.map((label, i) => {
          const n = (i + 1) as Step
          const state = step === n ? 'active' : step > n ? 'done' : ''
          return (
            <div
              key={n}
              className={`step-item ${state}`}
              onClick={() => setStep(n)}
              style={{ cursor: 'pointer' }}
            >
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
            ) : counselor?.agency_id ? (
              <input className="kc-input" value={selectedAgency?.name ?? '（所属相談所）'} readOnly style={{ opacity: .7, background: 'var(--bg-elev)' }} />
            ) : (
              <div style={{ padding: '14px 16px', background: 'var(--accent-pale)', border: '1px solid var(--accent-dim)', borderRadius: 10, fontSize: 12, color: 'var(--text)', lineHeight: 1.8 }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-deep)', marginBottom: 6 }}>所属相談所がまだ設定されていません</div>
                <div style={{ color: 'var(--text-mid)', marginBottom: 10 }}>
                  プロフィールを保存するには、先に所属相談所を作成してください。<br/>
                  個人運営の相談所として登録し、ご自身でオーナー兼カウンセラーとして利用できます。
                </div>
                <Link href="/agency" className="kc-btn kc-btn-primary kc-btn-sm" style={{ textDecoration: 'none' }}>
                  相談所プロフィールを作成する
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
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
            {form.years_of_experience !== '' && parseInt(form.years_of_experience) < 1 && (
              <p style={{ fontSize: 11, color: 'var(--accent-deep)', marginTop: 6 }}>
                ※ 1年未満の場合、プロフィールに「新人」タグが自動で付与されます
              </p>
            )}
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
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photo_url} alt="プロフィール" style={{
                  width: 110, height: 110, borderRadius: '50%', objectFit: 'cover',
                  border: '3px solid var(--accent-dim)',
                  boxShadow: '0 2px 12px rgba(0,0,0,.08)',
                }} />
                <div style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                  この見え方で<br/>お客様に表示されます
                </div>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoSelect}
              style={{ fontSize: '13px', color: 'var(--text-mid)' }} />
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 6, lineHeight: 1.7 }}>
              JPG / PNG / WebP 形式。10MBまで。<br/>
              選択後、丸型クロップ画面で位置・サイズを調整できます。
            </p>
          </div>
        </div>
      )}

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

      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                  {form.years_of_experience !== '' && parseInt(form.years_of_experience) < 1 && (
                    <span className="kc-badge kc-badge-urgent" style={{ fontSize: 10 }}>新人</span>
                  )}
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
          <button onClick={handleManualSave} className="kc-btn kc-btn-primary" disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? '保存中...' : '保存する'}
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 14 }}>
        {saveStatus === 'saved' && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ 自動保存済み</span>}
        {saveStatus === 'dirty' && <span style={{ fontSize: 11, color: 'var(--warning)' }}>未保存の変更があります</span>}
        {saveStatus === 'saving' && <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>保存中...</span>}
      </div>

      {toast && <div className="kc-toast">{toast}</div>}

      {cropFile && (
        <PhotoCropModal
          file={cropFile}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  )
}
