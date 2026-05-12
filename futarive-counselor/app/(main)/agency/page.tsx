'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Agency, AgencyMedia, Discount, FeeItem, FeePlan } from '@/lib/types'

// 「新店舗」バッジが表示される期間（創業から）
const NEW_SHOP_DAYS = 365

// 標準料金プランのテンプレート（4 項目入りのスタンダード）
const STANDARD_PLAN: FeePlan = {
  name: 'スタンダード',
  items: [
    { label: '入会金', amount: 0, suffix: null, note: null },
    { label: '月会費', amount: 0, suffix: '/月', note: null },
    { label: 'お見合い料', amount: 0, suffix: '/回', note: null },
    { label: '成婚料', amount: 0, suffix: null, note: null },
  ],
}

// よく使う suffix 候補
const SUFFIX_OPTIONS = ['', '/月', '/回', '/年', '/初回']

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
    phone: '',
    email: '',
    cancel_deadline_hours: 24,
    cancel_policy: '',
    fees: [] as FeePlan[],
    discounts: [] as Discount[],  // 014 マイグレーションで追加（U30 等の割引）
    campaign_text: '',
    campaign_expires_at: '',  // ISO 文字列、未設定なら ''
    founded_at: '',           // 'YYYY-MM-DD'、未設定なら ''
    /* 013 マイグレーションで追加した会場アクセス情報 */
    address: '',              // 所在地（フリーテキスト）
    access: '',               // 最寄駅などの簡潔なアクセス
    directions: '',           // 最寄駅からの行き方（複数行可）
    /* 015 マイグレーションで追加（agency_media テーブルと連動）*/
    logo_url: '',             // 相談所のプロフィール画像（ロゴ）URL
  })

  // リール画像（agency_media テーブル）は form とは別管理。
  // 個別 INSERT/UPDATE/DELETE で Supabase に即時反映する。
  const [media, setMedia] = useState<AgencyMedia[]>([])
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

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
      phone: ag.phone ?? '',
      email: ag.email ?? '',
      cancel_deadline_hours: ag.cancel_deadline_hours ?? 24,
      cancel_policy: ag.cancel_policy ?? '',
      fees: Array.isArray(ag.fees) ? ag.fees : [],
      discounts: Array.isArray(ag.discounts) ? ag.discounts : [],
      campaign_text: ag.campaign_text ?? '',
      // datetime-local の input value 用に "YYYY-MM-DDTHH:mm" に変換
      campaign_expires_at: ag.campaign_expires_at
        ? new Date(ag.campaign_expires_at).toISOString().slice(0, 16)
        : '',
      founded_at: ag.founded_at ?? '',
      address: ag.address ?? '',
      access: ag.access ?? '',
      directions: ag.directions ?? '',
      logo_url: ag.logo_url ?? '',
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
        await loadMedia(list[0].id)
      }
      setLoading(false)
      // 次tickでhydratedを立てる（初期セットで自動保存が走らないように）
      setTimeout(() => setHydrated(true), 50)
    }
    load()
  }, [])

  // リール画像（agency_media）の取得
  const loadMedia = async (agencyId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('agency_media')
      .select('*')
      .eq('agency_id', agencyId)
      .order('display_order', { ascending: true })
    setMedia((data as AgencyMedia[]) ?? [])
  }

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
      phone: f.phone || null,
      email: f.email || null,
      cancel_deadline_hours: typeof f.cancel_deadline_hours === 'number' ? f.cancel_deadline_hours : null,
      cancel_policy: f.cancel_policy || null,
      fees: f.fees,
      discounts: f.discounts,
      campaign_text: f.campaign_text || null,
      campaign_expires_at: f.campaign_expires_at
        ? new Date(f.campaign_expires_at).toISOString()
        : null,
      founded_at: f.founded_at || null,
      address: f.address || null,
      access: f.access || null,
      directions: f.directions || null,
      logo_url: f.logo_url || null,
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
    void loadMedia(id)
  }

  // ──────── ロゴアップロード ────────
  const handleLogoUpload = async (file: File) => {
    if (!selectedId) return
    setUploadingLogo(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const filename = `logo-${Date.now()}.${ext}`
      const path = `${selectedId}/${filename}`
      const { error: uploadErr } = await supabase.storage
        .from('agency-media')
        .upload(path, file, { upsert: false, cacheControl: '3600' })
      if (uploadErr) {
        showToast(`ロゴアップロード失敗：${uploadErr.message}`)
        return
      }
      const { data: pub } = supabase.storage.from('agency-media').getPublicUrl(path)
      const url = pub.publicUrl
      // form だけ更新 → 自動保存に乗る
      setForm(prev => ({ ...prev, logo_url: url }))
      showToast('ロゴをアップロードしました')
    } finally {
      setUploadingLogo(false)
    }
  }
  const handleLogoRemove = () => {
    setForm(prev => ({ ...prev, logo_url: '' }))
    showToast('ロゴを取り外しました')
  }

  // ──────── リール画像（agency_media）操作 ────────
  const handleMediaUpload = async (file: File) => {
    if (!selectedId) return
    if (media.length >= 6) {
      showToast('リール画像は最大6枚までです')
      return
    }
    setUploadingMedia(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const filename = `reel-${Date.now()}.${ext}`
      const path = `${selectedId}/${filename}`
      const { error: uploadErr } = await supabase.storage
        .from('agency-media')
        .upload(path, file, { upsert: false, cacheControl: '3600' })
      if (uploadErr) {
        showToast(`アップロード失敗：${uploadErr.message}`)
        return
      }
      const { data: pub } = supabase.storage.from('agency-media').getPublicUrl(path)
      const url = pub.publicUrl
      const nextOrder = media.length
      const { data, error } = await supabase
        .from('agency_media')
        .insert({
          agency_id: selectedId,
          media_url: url,
          media_type: 'image',
          display_order: nextOrder,
        })
        .select()
        .maybeSingle()
      if (error || !data) {
        showToast(`DB登録失敗：${error?.message ?? '不明'}`)
        return
      }
      setMedia(prev => [...prev, data as AgencyMedia])
      showToast('リール画像を追加しました')
    } finally {
      setUploadingMedia(false)
    }
  }
  const handleMediaCaptionChange = async (id: string, caption: string) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, caption } : m))
  }
  const handleMediaCaptionBlur = async (id: string) => {
    const item = media.find(m => m.id === id)
    if (!item) return
    const supabase = createClient()
    await supabase.from('agency_media').update({ caption: item.caption || null }).eq('id', id)
  }
  const handleMediaMove = async (id: string, dir: -1 | 1) => {
    const idx = media.findIndex(m => m.id === id)
    const to = idx + dir
    if (idx === -1 || to < 0 || to >= media.length) return
    const reordered = [...media]
    ;[reordered[idx], reordered[to]] = [reordered[to], reordered[idx]]
    // 全件の display_order を 0..N-1 で振り直して一括更新
    const withOrder = reordered.map((m, i) => ({ ...m, display_order: i }))
    setMedia(withOrder)
    const supabase = createClient()
    // 個別 UPDATE（並列）
    await Promise.all(withOrder.map(m =>
      supabase.from('agency_media').update({ display_order: m.display_order }).eq('id', m.id),
    ))
  }
  const handleMediaDelete = async (id: string) => {
    if (!window.confirm('このリール画像を削除しますか？')) return
    const supabase = createClient()
    const target = media.find(m => m.id === id)
    if (!target) return
    // 表示上は即時削除
    setMedia(prev => prev.filter(m => m.id !== id))
    await supabase.from('agency_media').delete().eq('id', id)
    // Storage 上のファイルも削除（agency_id/filename パスを URL から逆算）
    try {
      const url = target.media_url
      const marker = '/object/public/agency-media/'
      const idx = url.indexOf(marker)
      if (idx >= 0) {
        const path = url.slice(idx + marker.length)
        await supabase.storage.from('agency-media').remove([path])
      }
    } catch {
      // ベストエフォート。失敗しても DB は消えているので無視
    }
  }

  const handleManualSave = async () => {
    const ok = await save()
    if (ok) showToast('保存しました')
  }

  const update = (key: keyof typeof form, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // ──────── 料金プラン操作（プラン単位 + 項目単位）────────
  const addStandardPlan = () => {
    setForm(prev => ({
      ...prev,
      fees: [...prev.fees, { ...STANDARD_PLAN, items: STANDARD_PLAN.items.map(i => ({ ...i })) }],
    }))
  }
  const addEmptyPlan = () => {
    setForm(prev => ({
      ...prev,
      fees: [...prev.fees, { name: '', popular: false, items: [] }],
    }))
  }
  const updatePlan = (planIdx: number, key: keyof FeePlan, value: unknown) => {
    setForm(prev => ({
      ...prev,
      fees: prev.fees.map((p, i) => i === planIdx ? { ...p, [key]: value } : p),
    }))
  }
  const removePlan = (planIdx: number) => {
    if (!window.confirm(`プラン「${form.fees[planIdx]?.name || '無名'}」を削除しますか？`)) return
    setForm(prev => ({ ...prev, fees: prev.fees.filter((_, i) => i !== planIdx) }))
  }
  const addItem = (planIdx: number) => {
    setForm(prev => ({
      ...prev,
      fees: prev.fees.map((p, i) => i === planIdx
        ? { ...p, items: [...p.items, { label: '', amount: 0, suffix: null, note: null }] }
        : p,
      ),
    }))
  }
  const updateItem = (planIdx: number, itemIdx: number, key: keyof FeeItem, value: string | number | null) => {
    setForm(prev => ({
      ...prev,
      fees: prev.fees.map((p, i) => i === planIdx
        ? {
            ...p,
            items: p.items.map((it, j) => j === itemIdx ? { ...it, [key]: value } : it),
          }
        : p,
      ),
    }))
  }
  const removeItem = (planIdx: number, itemIdx: number) => {
    setForm(prev => ({
      ...prev,
      fees: prev.fees.map((p, i) => i === planIdx
        ? { ...p, items: p.items.filter((_, j) => j !== itemIdx) }
        : p,
      ),
    }))
  }
  // 配列要素を一個前/後ろに入れ替える小ヘルパー
  const moveInArr = <T,>(arr: T[], from: number, dir: -1 | 1): T[] => {
    const to = from + dir
    if (to < 0 || to >= arr.length) return arr
    const next = [...arr]
    ;[next[from], next[to]] = [next[to], next[from]]
    return next
  }
  const movePlan = (planIdx: number, dir: -1 | 1) => {
    setForm(prev => ({ ...prev, fees: moveInArr(prev.fees, planIdx, dir) }))
  }
  const duplicatePlan = (planIdx: number) => {
    setForm(prev => {
      const src = prev.fees[planIdx]
      if (!src) return prev
      // deep copy（プラン名末尾に "（コピー）" を付与・人気バッジは外す）
      const copy: FeePlan = {
        name: src.name ? `${src.name}（コピー）` : '',
        popular: false,
        items: src.items.map(i => ({ ...i })),
        notes: src.notes ?? null,
        description: src.description ?? null,
        included: src.included ? [...src.included] : null,
      }
      const next = [...prev.fees]
      next.splice(planIdx + 1, 0, copy)
      return { ...prev, fees: next }
    })
  }
  const moveItem = (planIdx: number, itemIdx: number, dir: -1 | 1) => {
    setForm(prev => ({
      ...prev,
      fees: prev.fees.map((p, i) => i === planIdx
        ? { ...p, items: moveInArr(p.items, itemIdx, dir) }
        : p,
      ),
    }))
  }
  const duplicateItem = (planIdx: number, itemIdx: number) => {
    setForm(prev => ({
      ...prev,
      fees: prev.fees.map((p, i) => {
        if (i !== planIdx) return p
        const src = p.items[itemIdx]
        if (!src) return p
        const copy: FeeItem = { ...src }
        const items = [...p.items]
        items.splice(itemIdx + 1, 0, copy)
        return { ...p, items }
      }),
    }))
  }

  // ──────── 割引（discounts）操作 ────────
  const addDiscount = () => {
    setForm(prev => ({
      ...prev,
      discounts: [...prev.discounts, { label: '', condition: null, amount: null, percent: null, note: null }],
    }))
  }
  const updateDiscount = (idx: number, key: keyof Discount, value: string | number | null) => {
    setForm(prev => ({
      ...prev,
      discounts: prev.discounts.map((d, i) => i === idx ? { ...d, [key]: value } : d),
    }))
  }
  const removeDiscount = (idx: number) => {
    setForm(prev => ({ ...prev, discounts: prev.discounts.filter((_, i) => i !== idx) }))
  }
  const moveDiscount = (idx: number, dir: -1 | 1) => {
    setForm(prev => ({ ...prev, discounts: moveInArr(prev.discounts, idx, dir) }))
  }

  // 「新店舗」バッジ表示状況（founded_at ベース）
  const newShopInfo = (() => {
    if (!form.founded_at) return null
    const founded = new Date(form.founded_at + 'T00:00:00')
    if (isNaN(founded.getTime())) return null
    const expires = new Date(founded.getTime() + NEW_SHOP_DAYS * 24 * 60 * 60 * 1000)
    const now = new Date()
    const foundedLabel = `${founded.getFullYear()}年${founded.getMonth() + 1}月${founded.getDate()}日`
    if (now >= expires) return { active: false, daysLeft: 0, foundedLabel }
    const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return { active: true, daysLeft, foundedLabel }
  })()

  // キャンペーンの状態
  const campaignStatus: 'none' | 'active' | 'expired' = !form.campaign_text
    ? 'none'
    : form.campaign_expires_at && new Date(form.campaign_expires_at) <= new Date()
      ? 'expired'
      : 'active'

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

      {/* 保存完了後の次ステップ案内
          NOTE: saveStatus に連動させると入力のたびに表示/非表示が切替わり、
          ページ高さが変わって iOS Safari の自動スクロールが暴れてしまう。
          一度保存できたユーザーには常に表示する。 */}
      {savedOnce && (
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

        {/* ─── 相談所写真セクション（015 マイグレーション） ────────────
            ロゴ（プロフィール画像）+ リール画像（最大6枚）
            お客様画面では agency 詳細ヒーロー直下にリール式で表示される。
        ─────────────────────────────────────── */}
        <div
          style={{
            padding: '14px 16px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            marginTop: 4,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            相談所写真
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7 }}>
            ロゴ（プロフィール画像）と、店内・スタッフ等のリール画像（最大6枚）を登録できます。
            <br/>お客様画面の詳細ページに表示されます。
          </p>
        </div>

        {/* ロゴ（プロフィール画像） */}
        <div>
          <label className="kc-label">プロフィール画像（ロゴ）</label>
          {form.logo_url ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.logo_url}
                alt="ロゴ"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  objectFit: 'cover',
                  border: '1px solid var(--border)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label
                  className="kc-btn kc-btn-ghost kc-btn-sm"
                  style={{ cursor: 'pointer', display: 'inline-flex' }}
                >
                  差し替える
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) void handleLogoUpload(f)
                      e.target.value = ''
                    }}
                    disabled={uploadingLogo}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleLogoRemove}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    fontSize: 11,
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left',
                  }}
                >
                  取り外す
                </button>
              </div>
            </div>
          ) : (
            <label
              className="kc-btn kc-btn-ghost kc-btn-sm"
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              ロゴをアップロード
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) void handleLogoUpload(f)
                  e.target.value = ''
                }}
                disabled={uploadingLogo}
              />
            </label>
          )}
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            正方形に近い画像が綺麗に表示されます（推奨：500×500px 以上）。
          </p>
        </div>

        {/* リール画像（agency_media） */}
        <div>
          <label className="kc-label">リール画像（最大6枚）</label>
          {media.length === 0 ? (
            <div
              style={{
                padding: '18px',
                background: 'var(--card-warm)',
                border: '1px dashed var(--border)',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 10 }}>
                まだリール画像が登録されていません。
              </p>
              <label
                className="kc-btn kc-btn-ghost kc-btn-sm"
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                画像を追加
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) void handleMediaUpload(f)
                    e.target.value = ''
                  }}
                  disabled={uploadingMedia}
                />
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {media.map((m, idx) => (
                <div
                  key={m.id}
                  style={{
                    padding: 10,
                    background: 'var(--card-warm)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.media_url}
                    alt={m.caption ?? `リール ${idx + 1}`}
                    style={{
                      width: 72,
                      height: 128,
                      objectFit: 'cover',
                      borderRadius: 8,
                      flexShrink: 0,
                      background: '#EFE3CB',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <input
                      className="kc-input"
                      value={m.caption ?? ''}
                      onChange={e => handleMediaCaptionChange(m.id, e.target.value)}
                      onBlur={() => handleMediaCaptionBlur(m.id)}
                      placeholder="キャプション（任意）— 例：エントランス"
                      style={{ fontSize: 12 }}
                      maxLength={40}
                    />
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleMediaMove(m.id, -1)}
                        disabled={idx === 0}
                        aria-label="上へ"
                        style={{
                          background: 'none',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          color: idx === 0 ? 'var(--text-faint)' : 'var(--text-mid)',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          padding: '3px 6px',
                          lineHeight: 1,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M3 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMediaMove(m.id, 1)}
                        disabled={idx === media.length - 1}
                        aria-label="下へ"
                        style={{
                          background: 'none',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          color: idx === media.length - 1 ? 'var(--text-faint)' : 'var(--text-mid)',
                          cursor: idx === media.length - 1 ? 'not-allowed' : 'pointer',
                          padding: '3px 6px',
                          lineHeight: 1,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <span style={{ flex: 1 }} />
                      <button
                        type="button"
                        onClick={() => handleMediaDelete(m.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger)',
                          fontSize: 11,
                          cursor: 'pointer',
                          padding: '3px 6px',
                        }}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {media.length < 6 && (
                <label
                  className="kc-btn kc-btn-ghost kc-btn-sm"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, alignSelf: 'center' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  画像を追加（あと {6 - media.length} 枚）
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) void handleMediaUpload(f)
                      e.target.value = ''
                    }}
                    disabled={uploadingMedia}
                  />
                </label>
              )}
            </div>
          )}
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            縦長の画像（9:16）が綺麗に表示されます。お客様画面の詳細ページに「1枚ずつスワイプ」のリール式で並びます。
          </p>
        </div>

        {/* 創業日（手入力） */}
        <div>
          <label className="kc-label">創業日</label>
          <input
            className="kc-input"
            type="date"
            value={form.founded_at}
            onChange={e => update('founded_at', e.target.value)}
            style={{ maxWidth: 200 }}
          />
          {newShopInfo ? (
            <div style={{
              marginTop: 8,
              padding: '10px 12px',
              background: newShopInfo.active ? 'var(--accent-pale)' : 'var(--bg-elev)',
              border: `1px solid ${newShopInfo.active ? 'var(--accent-dim)' : 'var(--border)'}`,
              borderRadius: 10,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M2 14V5l6-3 6 3v9M5 14V9h6v5" stroke={newShopInfo.active ? 'var(--accent-deep)' : 'var(--text-mid)'} strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              <div style={{ flex: 1, fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                {newShopInfo.active ? (
                  <>
                    お客様向けページに <strong style={{ color: 'var(--accent-deep)' }}>「新店舗」バッジ</strong> が
                    自動表示されます（あと <strong>{newShopInfo.daysLeft}</strong> 日間）。
                  </>
                ) : (
                  <>「新店舗」バッジの表示期間（創業から1年）は終了しています。</>
                )}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
              創業日を入力すると、お客様向けページに「新店舗」バッジが自動表示されます（創業から1年間）。
            </p>
          )}
        </div>

        {/* ─── 会場へのアクセス（013 マイグレーション） ───────────────
            ユーザー画面の「予約完了」「カウンセラー詳細」「マイページ予約詳細」で
            お客様に表示されます。所在地は Google マップにも自動連動します。
        ─────────────────────────────────────────────── */}
        <div
          style={{
            padding: '14px 16px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            marginTop: 4,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            会場へのアクセス
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7 }}>
            ご予約のお客様に表示されます。所在地は Google マップに自動表示されます。
          </p>
        </div>

        {/* 所在地 */}
        <div>
          <label className="kc-label">所在地</label>
          <input
            className="kc-input"
            type="text"
            value={form.address}
            onChange={e => update('address', e.target.value)}
            placeholder="例：東京都中央区銀座4-12-3 銀座ビル4F"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            この住所は Google マップの埋め込みクエリにも使われます。
          </p>
        </div>

        {/* アクセス（最寄駅） */}
        <div>
          <label className="kc-label">アクセス（最寄駅）</label>
          <input
            className="kc-input"
            type="text"
            value={form.access}
            onChange={e => update('access', e.target.value)}
            placeholder="例：東銀座駅 徒歩3分 / 銀座駅 徒歩5分"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            最寄駅と徒歩時間を1行で。複数駅を「/」で区切ってもOKです。
          </p>
        </div>

        {/* 最寄駅からの行き方（自由記述・複数行） */}
        <div>
          <label className="kc-label">最寄駅からの行き方</label>
          <textarea
            className="kc-textarea"
            style={{ minHeight: 110 }}
            value={form.directions}
            onChange={e => update('directions', e.target.value)}
            placeholder={
              '例：\n東銀座駅A1出口を出て地上に上がり、和光方面へ徒歩2分。\n4階建ての茶色いビルの3階に「ブライダルハウス東京」の看板があります。\nビル入口は1階のカフェの右隣です。'
            }
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            初めて来店される方が迷わないよう、目印・道順を自由に記入してください。改行が反映されます。
          </p>
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

        {/* 料金プランセクション区切り */}
        <div style={{
          marginTop: 8,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>FEES</div>
          <h2 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--text-deep)',
            marginBottom: 10,
          }}>
            料金プラン
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
            お客様の相談所詳細ページに表示される料金一覧です。<br/>
            入会金・月会費・成婚料の標準プランに加え、独自の料金（例：デート同行サポート）も自由に追加できます。
          </p>
          <div style={{
            marginTop: 10,
            padding: '8px 12px',
            background: 'var(--accent-pale)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 8,
            fontSize: 11,
            color: 'var(--text-deep)',
            lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--accent-deep)' }}>金額は税込で入力してください。</strong>
            お客様向けページには「¥XX,XXX（税込）」と表示されます。
          </div>
        </div>

        {/* 料金プラン本体（多プラン対応） */}
        <div>
          {form.fees.length === 0 ? (
            <div style={{
              padding: '20px 16px',
              background: 'var(--bg-elev)',
              border: '1px dashed var(--border)',
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 12, lineHeight: 1.7 }}>
                料金プランがまだ登録されていません。<br/>
                ベーシック・フルサポートなど、複数プランを作れます。
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="kc-btn kc-btn-primary kc-btn-sm" onClick={addStandardPlan}>
                  標準プランを追加
                </button>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={addEmptyPlan}>
                  + 空のプランを追加
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {form.fees.map((plan, planIdx) => (
                <div key={planIdx} style={{
                  background: plan.popular ? 'var(--accent-pale)' : 'var(--card-warm)',
                  border: `1.5px solid ${plan.popular ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 14,
                  padding: '14px 14px',
                }}>
                  {/* プランヘッダー */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    {/* プラン名（入力） */}
                    <input
                      className="kc-input"
                      value={plan.name}
                      onChange={e => updatePlan(planIdx, 'name', e.target.value)}
                      placeholder="例：ベーシック / フルサポート"
                      style={{ flex: 1, minWidth: 140, fontSize: 14, fontWeight: 500 }}
                    />
                    {/* プラン順番入れ替え ↑↓ */}
                    <div style={{ display: 'inline-flex', gap: 2 }}>
                      <button
                        type="button"
                        onClick={() => movePlan(planIdx, -1)}
                        disabled={planIdx === 0}
                        aria-label="プランを上へ"
                        style={{
                          background: 'none',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          color: planIdx === 0 ? 'var(--text-faint)' : 'var(--text-mid)',
                          cursor: planIdx === 0 ? 'not-allowed' : 'pointer',
                          padding: '4px 6px',
                          lineHeight: 1,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M3 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => movePlan(planIdx, 1)}
                        disabled={planIdx === form.fees.length - 1}
                        aria-label="プランを下へ"
                        style={{
                          background: 'none',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          color: planIdx === form.fees.length - 1 ? 'var(--text-faint)' : 'var(--text-mid)',
                          cursor: planIdx === form.fees.length - 1 ? 'not-allowed' : 'pointer',
                          padding: '4px 6px',
                          lineHeight: 1,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* プラン操作行2: 人気バッジ + 複製 + 削除 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-mid)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={plan.popular ?? false}
                        onChange={e => updatePlan(planIdx, 'popular', e.target.checked)}
                      />
                      人気バッジ
                    </label>
                    <button
                      type="button"
                      onClick={() => duplicatePlan(planIdx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-mid)',
                        cursor: 'pointer',
                        padding: '4px 0',
                        fontSize: 11,
                        textDecoration: 'underline',
                      }}
                    >
                      このプランを複製
                    </button>
                    <span style={{ flex: 1 }} />
                    <button
                      type="button"
                      onClick={() => removePlan(planIdx)}
                      aria-label="プラン削除"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: '4px 0',
                        fontSize: 11,
                      }}
                    >
                      プランを削除
                    </button>
                  </div>

                  {/* 対象セグメント（description）— 1〜2 行・短く
                     お客様画面でプラン名直下に「こんな方向け」として表示される */}
                  <div style={{ marginBottom: 10 }}>
                    <label
                      className="kc-label"
                      style={{ fontSize: 11, color: 'var(--text-mid)' }}
                    >
                      こんな方向け（任意）
                    </label>
                    <input
                      className="kc-input"
                      value={plan.description ?? ''}
                      onChange={e => updatePlan(planIdx, 'description', e.target.value || null)}
                      placeholder="例：短期成婚を本気で目指す方向け"
                      style={{ fontSize: 12 }}
                      maxLength={60}
                    />
                  </div>

                  {/* 含まれるもの（included[]）— 短い箇条書き 3〜6 件
                     お客様画面で「✓ ◯◯」の形式で並ぶ。比較スキャンしやすい設計。 */}
                  <div style={{ marginBottom: 12 }}>
                    <label
                      className="kc-label"
                      style={{ fontSize: 11, color: 'var(--text-mid)' }}
                    >
                      含まれるもの（任意・3〜6件目安）
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(plan.included ?? []).map((line, lineIdx) => (
                        <div key={lineIdx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--accent)', flexShrink: 0 }}>✓</span>
                          <input
                            className="kc-input"
                            value={line}
                            onChange={e => {
                              const next = [...(plan.included ?? [])]
                              next[lineIdx] = e.target.value
                              updatePlan(planIdx, 'included', next)
                            }}
                            placeholder="例：お見合い 月3件まで"
                            style={{ flex: 1, fontSize: 12 }}
                            maxLength={40}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = (plan.included ?? []).filter((_, i) => i !== lineIdx)
                              updatePlan(planIdx, 'included', next.length === 0 ? null : next)
                            }}
                            aria-label="含まれるものを削除"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-light)',
                              cursor: 'pointer',
                              padding: 4,
                              flexShrink: 0,
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                              <path d="M2 3h10M5 3V2h4v1M4 3v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="kc-btn kc-btn-ghost kc-btn-sm"
                      onClick={() => {
                        const next = [...(plan.included ?? []), '']
                        updatePlan(planIdx, 'included', next)
                      }}
                      style={{ marginTop: 6 }}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      含まれるものを追加
                    </button>
                  </div>

                  {/* 項目リスト */}
                  {plan.items.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '12px 0' }}>
                      項目がありません。下のボタンから追加してください。
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {plan.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={{
                          padding: 10,
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: 6,
                        }}>
                          {/* ラベル + 並び替え + 複製 + 削除 */}
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input
                              className="kc-input"
                              value={item.label}
                              onChange={e => updateItem(planIdx, itemIdx, 'label', e.target.value)}
                              placeholder="例：入会金 / デート同行"
                              style={{ flex: 1, fontSize: 13, fontWeight: 500 }}
                            />
                            {/* 項目並び替え ↑↓ */}
                            <button
                              type="button"
                              onClick={() => moveItem(planIdx, itemIdx, -1)}
                              disabled={itemIdx === 0}
                              aria-label="項目を上へ"
                              style={{
                                background: 'none',
                                border: '1px solid var(--border)',
                                borderRadius: 4,
                                color: itemIdx === 0 ? 'var(--text-faint)' : 'var(--text-mid)',
                                cursor: itemIdx === 0 ? 'not-allowed' : 'pointer',
                                padding: '3px 4px',
                                lineHeight: 1,
                                flexShrink: 0,
                              }}
                            >
                              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M3 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem(planIdx, itemIdx, 1)}
                              disabled={itemIdx === plan.items.length - 1}
                              aria-label="項目を下へ"
                              style={{
                                background: 'none',
                                border: '1px solid var(--border)',
                                borderRadius: 4,
                                color: itemIdx === plan.items.length - 1 ? 'var(--text-faint)' : 'var(--text-mid)',
                                cursor: itemIdx === plan.items.length - 1 ? 'not-allowed' : 'pointer',
                                padding: '3px 4px',
                                lineHeight: 1,
                                flexShrink: 0,
                              }}
                            >
                              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            {/* 項目複製 */}
                            <button
                              type="button"
                              onClick={() => duplicateItem(planIdx, itemIdx)}
                              aria-label="項目を複製"
                              title="項目を複製"
                              style={{
                                background: 'none',
                                border: '1px solid var(--border)',
                                borderRadius: 4,
                                color: 'var(--text-mid)',
                                cursor: 'pointer',
                                padding: '3px 4px',
                                lineHeight: 1,
                                flexShrink: 0,
                              }}
                            >
                              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/>
                                <path d="M5 1h4a1 1 0 0 1 1 1v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(planIdx, itemIdx)}
                              aria-label="項目削除"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-light)',
                                cursor: 'pointer',
                                padding: 4,
                                flexShrink: 0,
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 3h10M5 3V2h4v1M4 3v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                          {/* 金額 + サフィックス
                             バグ修正: 旧 type="number" + value={item.amount} (=0) の構成だと
                             先頭の "0" が消えず入力しづらかったので、表示用は string にして
                             amount===0 を空欄表示にする。入力時に非数字を除去し、
                             先頭ゼロも自動的に取り除く（"0100000" → "100000"）。 */}
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>¥</span>
                            <input
                              className="kc-input"
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={item.amount === 0 ? '' : String(item.amount)}
                              onChange={e => {
                                const stripped = e.target.value
                                  .replace(/[^0-9]/g, '')
                                  .replace(/^0+(?=\d)/, '')
                                const num = stripped === '' ? 0 : Number(stripped)
                                updateItem(planIdx, itemIdx, 'amount', num)
                              }}
                              onFocus={e => e.currentTarget.select()}
                              placeholder="0（無料）"
                              style={{ flex: '1 1 100px', fontFamily: 'DM Sans, sans-serif', textAlign: 'right' }}
                            />
                            <select
                              className="kc-select"
                              value={item.suffix ?? ''}
                              onChange={e => updateItem(planIdx, itemIdx, 'suffix', e.target.value || null)}
                              style={{ flex: '0 0 96px', fontSize: 12 }}
                              aria-label="表示単位"
                            >
                              {SUFFIX_OPTIONS.map(s => (
                                <option key={s} value={s}>{s === '' ? '(税込)' : s}</option>
                              ))}
                            </select>
                          </div>
                          {/* 補足 */}
                          <input
                            className="kc-input"
                            value={item.note ?? ''}
                            onChange={e => updateItem(planIdx, itemIdx, 'note', e.target.value || null)}
                            placeholder="補足（任意）— 初回のみ / ご希望者のみ 等"
                            style={{ fontSize: 12 }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 10 }}>
                    <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={() => addItem(planIdx)}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      このプランに項目を追加
                    </button>
                  </div>

                  {/* プラン単位の注意事項（任意・複数行可） */}
                  <div style={{ marginTop: 14 }}>
                    <label
                      className="kc-label"
                      style={{ fontSize: 11, color: 'var(--text-mid)' }}
                    >
                      注意事項（任意）
                    </label>
                    <textarea
                      className="kc-textarea"
                      style={{ minHeight: 60, fontSize: 12 }}
                      value={plan.notes ?? ''}
                      onChange={e => updatePlan(planIdx, 'notes', e.target.value || null)}
                      placeholder={
                        '例：\n・別途オプション料金がかかる場合があります\n・お見合い料は月3件目以降から発生'
                      }
                    />
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={addStandardPlan}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  標準プランを追加
                </button>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={addEmptyPlan}>
                  + 空のプランを追加
                </button>
              </div>
            </div>
          )}
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 10, lineHeight: 1.7 }}>
            ¥0 と入力した項目は「無料」（緑色）で表示されます。<br/>
            単位「/月」「/回」を選ぶと、お客様向けには「¥XX,XXX/月」と表示。<br/>
            空欄を選ぶと「¥XX,XXX（税込）」が自動付与されます。
          </p>
        </div>

        {/* ─── 各種割引・お得情報セクション（014 マイグレーション） ─────────
            プラン横断の割引（U30 / 乗り換え割 / 学割 等）をここで管理する。
            料金プラン本体（fees）とは独立。お客様向け詳細ページでは
            料金プラン直下に小さく一覧表示される予定。
        ─────────────────────────────────────────── */}
        <div style={{
          marginTop: 8,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>DISCOUNTS</div>
          <h2 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 18,
            fontWeight: 500,
            color: 'var(--text-deep)',
            marginBottom: 6,
          }}>
            各種割引・お得情報
          </h2>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginBottom: 14, lineHeight: 1.7 }}>
            U30割引・乗り換え割引・学割など、プラン横断で適用される割引を登録します。
            <br/>料金プラン本体（上記）とは別枠で表示されます。
          </p>

          {form.discounts.length === 0 ? (
            <div className="kc-card" style={{
              padding: 18,
              background: 'var(--card-warm)',
              border: '1px dashed var(--border)',
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 10 }}>
                まだ割引が登録されていません。
              </p>
              <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={addDiscount}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                割引を追加
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.discounts.map((d, idx) => (
                <div key={idx} style={{
                  padding: 12,
                  background: 'var(--card-warm)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  {/* 行1: ラベル + ↑↓ + 削除 */}
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      className="kc-input"
                      value={d.label}
                      onChange={e => updateDiscount(idx, 'label', e.target.value)}
                      placeholder="例：U30割引 / 乗り換え割引 / 学割"
                      style={{ flex: 1, fontSize: 13, fontWeight: 500 }}
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={() => moveDiscount(idx, -1)}
                      disabled={idx === 0}
                      aria-label="上へ"
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        color: idx === 0 ? 'var(--text-faint)' : 'var(--text-mid)',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        padding: '3px 5px',
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M3 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDiscount(idx, 1)}
                      disabled={idx === form.discounts.length - 1}
                      aria-label="下へ"
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        color: idx === form.discounts.length - 1 ? 'var(--text-faint)' : 'var(--text-mid)',
                        cursor: idx === form.discounts.length - 1 ? 'not-allowed' : 'pointer',
                        padding: '3px 5px',
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDiscount(idx)}
                      aria-label="削除"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-light)',
                        cursor: 'pointer',
                        padding: 4,
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3h10M5 3V2h4v1M4 3v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* 行2: 対象条件 */}
                  <input
                    className="kc-input"
                    value={d.condition ?? ''}
                    onChange={e => updateDiscount(idx, 'condition', e.target.value || null)}
                    placeholder="対象条件（任意）— 例：29歳以下の方"
                    style={{ fontSize: 12 }}
                    maxLength={50}
                  />

                  {/* 行3: 割引額 (円) または 割引率 (%) を排他選択 */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>割引</span>
                    <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>¥</span>
                    <input
                      className="kc-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={d.amount == null || d.amount === 0 ? '' : String(d.amount)}
                      onChange={e => {
                        const stripped = e.target.value
                          .replace(/[^0-9]/g, '')
                          .replace(/^0+(?=\d)/, '')
                        const num = stripped === '' ? null : Number(stripped)
                        updateDiscount(idx, 'amount', num)
                        // 円を入れたら % は消す
                        if (num != null) updateDiscount(idx, 'percent', null)
                      }}
                      onFocus={e => e.currentTarget.select()}
                      placeholder="20000"
                      style={{ flex: '1 1 90px', fontFamily: 'DM Sans, sans-serif', textAlign: 'right' }}
                      disabled={d.percent != null}
                    />
                    <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>または</span>
                    <input
                      className="kc-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={d.percent == null || d.percent === 0 ? '' : String(d.percent)}
                      onChange={e => {
                        const stripped = e.target.value
                          .replace(/[^0-9]/g, '')
                          .replace(/^0+(?=\d)/, '')
                        const num = stripped === '' ? null : Math.min(100, Number(stripped))
                        updateDiscount(idx, 'percent', num)
                        if (num != null) updateDiscount(idx, 'amount', null)
                      }}
                      onFocus={e => e.currentTarget.select()}
                      placeholder="20"
                      style={{ flex: '0 0 70px', fontFamily: 'DM Sans, sans-serif', textAlign: 'right' }}
                      disabled={d.amount != null}
                    />
                    <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>%</span>
                  </div>

                  {/* 行4: 補足 */}
                  <input
                    className="kc-input"
                    value={d.note ?? ''}
                    onChange={e => updateDiscount(idx, 'note', e.target.value || null)}
                    placeholder="補足（任意）— 例：他キャンペーンと併用不可"
                    style={{ fontSize: 12 }}
                    maxLength={60}
                  />
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={addDiscount}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  割引を追加
                </button>
              </div>
            </div>
          )}
        </div>

        {/* キャンペーンセクション区切り */}
        <div style={{
          marginTop: 8,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>CAMPAIGN</div>
          <h2 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--text-deep)',
            marginBottom: 10,
          }}>
            キャンペーン
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
            お客様の相談所詳細ページの目立つ位置に1件だけ表示されます。<br/>
            有効期限を過ぎたキャンペーンは自動的に非表示になります。
          </p>
        </div>

        {/* キャンペーン本文 */}
        <div>
          <label className="kc-label">キャンペーン本文</label>
          <textarea
            className="kc-textarea"
            style={{ minHeight: 60 }}
            value={form.campaign_text}
            onChange={e => update('campaign_text', e.target.value)}
            placeholder="例：5/31までの入会で入会金0円!"
          />
        </div>

        {/* キャンペーン有効期限 */}
        <div>
          <label className="kc-label">有効期限（任意）</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <input
              className="kc-input"
              type="datetime-local"
              value={form.campaign_expires_at}
              onChange={e => update('campaign_expires_at', e.target.value)}
              style={{ maxWidth: 260 }}
            />
            {form.campaign_expires_at && (
              <button
                type="button"
                className="kc-btn kc-btn-ghost kc-btn-sm"
                onClick={() => update('campaign_expires_at', '')}
              >
                期限を解除
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.7 }}>
            {form.campaign_text ? (
              campaignStatus === 'active' ? (
                <span style={{ color: 'var(--success)' }}>
                  ✓ 表示中
                  {form.campaign_expires_at && (
                    <> — {new Date(form.campaign_expires_at).toLocaleDateString('ja-JP')} まで</>
                  )}
                </span>
              ) : campaignStatus === 'expired' ? (
                <span style={{ color: 'var(--danger)' }}>
                  ⚠ 期限切れ — お客様には表示されていません。期限を延長するか、本文を更新してください。
                </span>
              ) : null
            ) : (
              <>キャンペーン本文を入力すると表示されます。期限を空欄にすると無期限表示になります。</>
            )}
          </p>
        </div>

        {/* キャンセル・連絡先セクション区切り */}
        <div style={{
          marginTop: 8,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>CANCELLATION &amp; CONTACT</div>
          <h2 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--text-deep)',
            marginBottom: 10,
          }}>
            キャンセル・連絡先設定
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
            キャンセル期限を過ぎた予約のキャンセル依頼が来た場合、お客様の予約履歴ページに
            ここで設定した連絡先（電話・メール）が表示されます。
          </p>
        </div>

        {/* キャンセル期限 */}
        <div>
          <label className="kc-label">キャンセル可能期限</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>面談日時の</span>
            <input
              className="kc-input"
              type="number"
              min={0}
              max={168}
              value={form.cancel_deadline_hours}
              onChange={e => update('cancel_deadline_hours', e.target.value === '' ? 0 : Number(e.target.value))}
              style={{ maxWidth: 100 }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>時間前まで</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            例：24 → 面談日の前日同時刻まで／0 → 当日キャンセル可。期限を過ぎたらお客様には電話・メール案内のみ。
          </p>
        </div>

        {/* キャンセルポリシー本文 */}
        <div>
          <label className="kc-label">キャンセルポリシー（自由記述）</label>
          <textarea
            className="kc-textarea"
            style={{ minHeight: 80 }}
            value={form.cancel_policy}
            onChange={e => update('cancel_policy', e.target.value)}
            placeholder="例：面談日の前日23:59までキャンセル無料。当日キャンセルも初回のみ可。"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            お客様の予約フローと予約履歴ページに表示されます。空欄ならデフォルト文言が使われます。
          </p>
        </div>

        {/* 電話 */}
        <div>
          <label className="kc-label">電話番号</label>
          <input
            className="kc-input"
            type="tel"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="03-1234-5678"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            キャンセル期限後の連絡先としてお客様に表示されます。営業電話には使われません。
          </p>
        </div>

        {/* メール */}
        <div>
          <label className="kc-label">連絡先メールアドレス</label>
          <input
            className="kc-input"
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="info@example.com"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            キャンセル依頼の連絡先として表示されます。
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
