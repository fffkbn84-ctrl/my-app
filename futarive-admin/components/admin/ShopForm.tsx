'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export interface ShopFormData {
  name: string
  category_label: string
  thumb_variant: string
  area_label: string
  area: string
  location: string
  stage: string
  badge_type: 'certified' | 'agency' | 'listed'
  agency_id: string | null
  description: string
  price_range: string
  hours: string
  holiday: string
  access: string
  address: string
  photo_url: string
  booking_url: string
  instagram_url: string
  other_social_url: string
  features: string[]
  scenes: string[]
  tags: string[]
  is_published: boolean
}

interface ShopMediaRow {
  id: string
  shop_id: string
  media_url: string
  display_order: number
  caption: string | null
  alt_text: string | null
}

const SHOP_MEDIA_BUCKET = 'shop-media'

export const EMPTY_FORM: ShopFormData = {
  name: '',
  category_label: 'カフェ',
  thumb_variant: 'cafe',
  area_label: '東京',
  area: '',
  location: '',
  stage: '',
  badge_type: 'listed',
  agency_id: null,
  description: '',
  price_range: '',
  hours: '',
  holiday: '',
  access: '',
  address: '',
  photo_url: '',
  booking_url: '',
  instagram_url: '',
  other_social_url: '',
  features: [],
  scenes: [],
  tags: [],
  is_published: true,
}

const CATEGORY_OPTIONS = [
  'カフェ',
  'カフェ・甘味',
  'レストラン',
  'ホテルラウンジ',
  '美容室',
  'ネイル',
  '眉毛',
  'エステ',
  'フォトスタジオ',
]

const THUMB_VARIANT_OPTIONS: { value: string; label: string }[] = [
  { value: 'cafe', label: 'cafe（カフェ・レストラン系）' },
  { value: 'lounge', label: 'lounge（ホテルラウンジ）' },
  { value: 'hair', label: 'hair（美容室）' },
  { value: 'nail', label: 'nail（ネイル）' },
  { value: 'brow', label: 'brow（眉毛）' },
  { value: 'esthetic', label: 'esthetic（エステ）' },
  { value: 'photo-studio', label: 'photo-studio（フォトスタジオ）' },
]

const BADGE_LABELS: Record<string, string> = {
  certified: '取材済み',
  agency: '相談所おすすめ',
  listed: '掲載店',
}

interface AgencyOption {
  id: string
  name: string
}

interface ChipInputProps {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

function ChipInput({ value, onChange, placeholder }: ChipInputProps) {
  const [draft, setDraft] = useState('')

  function add(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (value.includes(trimmed)) {
      setDraft('')
      return
    }
    onChange([...value, trimmed])
    setDraft('')
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: 8,
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'var(--surface)',
        minHeight: 42,
      }}
    >
      {value.map((chip, i) => (
        <span
          key={`${chip}-${i}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            fontSize: 12,
          }}
        >
          {chip}
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label={`${chip} を削除`}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: 0,
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add(draft)
          } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
            e.preventDefault()
            remove(value.length - 1)
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={placeholder ?? 'Enter または , で追加'}
        style={{
          flex: 1,
          minWidth: 120,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 13,
          padding: '4px 6px',
        }}
      />
    </div>
  )
}

interface ShopFormProps {
  mode: 'new' | 'edit'
  shopId?: string
  initial?: ShopFormData
}

export default function ShopForm({ mode, shopId, initial }: ShopFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<ShopFormData>(initial ?? EMPTY_FORM)
  const [agencies, setAgencies] = useState<AgencyOption[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [mediaList, setMediaList] = useState<ShopMediaRow[]>([])
  const [profileUploading, setProfileUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const profileFileRef = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadAgencies()
  }, [])

  useEffect(() => {
    if (mode === 'edit' && shopId) {
      loadGallery()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, shopId])

  async function loadAgencies() {
    const supabase = createClient()
    const { data } = await supabase
      .from('agencies')
      .select('id, name')
      .order('name', { ascending: true })
    setAgencies(((data ?? []) as AgencyOption[]).map(a => ({ id: a.id, name: a.name })))
  }

  async function loadGallery() {
    if (!shopId) return
    const supabase = createClient()
    const { data } = await supabase
      .from('shop_media')
      .select('*')
      .eq('shop_id', shopId)
      .order('display_order', { ascending: true })
    setMediaList((data ?? []) as ShopMediaRow[])
  }

  function fileExtension(name: string): string {
    const idx = name.lastIndexOf('.')
    if (idx === -1 || idx === name.length - 1) return 'jpg'
    return name.slice(idx + 1).toLowerCase()
  }

  async function handleProfileUpload(file: File) {
    if (!shopId) return
    setProfileUploading(true)
    setErrorMsg(null)
    const supabase = createClient()
    const ext = fileExtension(file.name)
    const path = `${shopId}/profile-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from(SHOP_MEDIA_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type || undefined })
    if (upErr) {
      setProfileUploading(false)
      setErrorMsg(`プロフィール画像のアップロードに失敗しました: ${upErr.message}`)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from(SHOP_MEDIA_BUCKET).getPublicUrl(path)
    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`
    const { error: updErr } = await supabase
      .from('shops')
      .update({ photo_url: cacheBustedUrl })
      .eq('id', shopId)
    if (updErr) {
      setProfileUploading(false)
      setErrorMsg(`DB 更新に失敗しました: ${updErr.message}`)
      return
    }
    patch('photo_url', cacheBustedUrl)
    setProfileUploading(false)
    setSuccessMsg('プロフィール画像を更新しました')
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  async function handleProfileRemove() {
    if (!shopId) return
    if (!form.photo_url) return
    if (!confirm('プロフィール画像を削除しますか？')) return
    setProfileUploading(true)
    setErrorMsg(null)
    const supabase = createClient()
    // Storage 上のオブジェクト削除（URL から path を逆引き）
    const marker = `/${SHOP_MEDIA_BUCKET}/`
    const idx = form.photo_url.indexOf(marker)
    if (idx !== -1) {
      const tail = form.photo_url.slice(idx + marker.length).split('?')[0]
      await supabase.storage.from(SHOP_MEDIA_BUCKET).remove([decodeURIComponent(tail)])
    }
    const { error: updErr } = await supabase
      .from('shops')
      .update({ photo_url: null })
      .eq('id', shopId)
    if (updErr) {
      setProfileUploading(false)
      setErrorMsg(`DB 更新に失敗しました: ${updErr.message}`)
      return
    }
    patch('photo_url', '')
    setProfileUploading(false)
    setSuccessMsg('プロフィール画像を削除しました')
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  async function handleGalleryUpload(files: FileList) {
    if (!shopId) return
    if (files.length === 0) return
    setGalleryUploading(true)
    setErrorMsg(null)
    const supabase = createClient()
    let order = mediaList.length
    const newItems: ShopMediaRow[] = []
    for (const file of Array.from(files)) {
      const ext = fileExtension(file.name)
      const path = `${shopId}/gallery-${Date.now()}-${order}.${ext}`
      const { error: upErr } = await supabase.storage
        .from(SHOP_MEDIA_BUCKET)
        .upload(path, file, { contentType: file.type || undefined })
      if (upErr) {
        setErrorMsg(`「${file.name}」のアップロードに失敗: ${upErr.message}`)
        continue
      }
      const { data: { publicUrl } } = supabase.storage.from(SHOP_MEDIA_BUCKET).getPublicUrl(path)
      const { data: inserted, error: insErr } = await supabase
        .from('shop_media')
        .insert({
          shop_id: shopId,
          media_url: publicUrl,
          display_order: order,
          caption: null,
          alt_text: null,
        })
        .select()
        .single()
      if (insErr || !inserted) {
        setErrorMsg(`DB 保存に失敗: ${insErr?.message ?? 'unknown'}`)
        continue
      }
      newItems.push(inserted as ShopMediaRow)
      order += 1
    }
    setMediaList(prev => [...prev, ...newItems])
    setGalleryUploading(false)
    if (newItems.length > 0) {
      setSuccessMsg(`${newItems.length} 枚をアップロードしました`)
      setTimeout(() => setSuccessMsg(null), 3000)
    }
  }

  async function handleGalleryDelete(item: ShopMediaRow) {
    if (!confirm('このギャラリー写真を削除しますか？')) return
    const supabase = createClient()
    const marker = `/${SHOP_MEDIA_BUCKET}/`
    const idx = item.media_url.indexOf(marker)
    if (idx !== -1) {
      const tail = item.media_url.slice(idx + marker.length).split('?')[0]
      await supabase.storage.from(SHOP_MEDIA_BUCKET).remove([decodeURIComponent(tail)])
    }
    await supabase.from('shop_media').delete().eq('id', item.id)
    setMediaList(prev => prev.filter(m => m.id !== item.id))
  }

  async function handleGalleryMove(item: ShopMediaRow, direction: -1 | 1) {
    const currentIdx = mediaList.findIndex(m => m.id === item.id)
    const targetIdx = currentIdx + direction
    if (targetIdx < 0 || targetIdx >= mediaList.length) return
    const target = mediaList[targetIdx]
    const supabase = createClient()
    // 2行 UPDATE で display_order をスワップ
    await supabase.from('shop_media').update({ display_order: target.display_order }).eq('id', item.id)
    await supabase.from('shop_media').update({ display_order: item.display_order }).eq('id', target.id)
    const next = [...mediaList]
    next[currentIdx] = { ...item, display_order: target.display_order }
    next[targetIdx] = { ...target, display_order: item.display_order }
    next.sort((a, b) => a.display_order - b.display_order)
    setMediaList(next)
  }

  async function handleGalleryCaptionBlur(item: ShopMediaRow, key: 'caption' | 'alt_text', value: string) {
    const trimmed = value.trim()
    if ((item[key] ?? '') === trimmed) return
    const supabase = createClient()
    await supabase.from('shop_media').update({ [key]: trimmed || null }).eq('id', item.id)
    setMediaList(prev => prev.map(m => m.id === item.id ? { ...m, [key]: trimmed || null } : m))
  }

  function patch<K extends keyof ShopFormData>(key: K, value: ShopFormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!form.name.trim()) {
      setErrorMsg('店名は必須です')
      return
    }

    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name.trim(),
      category_label: form.category_label || null,
      thumb_variant: form.thumb_variant || null,
      area_label: form.area_label || null,
      area: form.area || null,
      location: form.location || null,
      stage: form.stage || null,
      badge_type: form.badge_type,
      agency_id: form.agency_id || null,
      description: form.description || null,
      price_range: form.price_range || null,
      hours: form.hours || null,
      holiday: form.holiday || null,
      access: form.access || null,
      address: form.address || null,
      photo_url: form.photo_url || null,
      booking_url: form.booking_url.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      other_social_url: form.other_social_url.trim() || null,
      features: form.features.length > 0 ? form.features : null,
      scenes: form.scenes.length > 0 ? form.scenes : null,
      tags: form.tags.length > 0 ? form.tags : null,
      is_published: form.is_published,
    }

    if (mode === 'new') {
      const { data, error } = await supabase
        .from('shops')
        .insert(payload)
        .select('id')
        .single()
      setSaving(false)
      if (error) {
        setErrorMsg(`保存に失敗しました: ${error.message}`)
        return
      }
      router.push(`/admin/shops/${data.id}/edit?created=1`)
    } else {
      const { error } = await supabase
        .from('shops')
        .update(payload)
        .eq('id', shopId)
      setSaving(false)
      if (error) {
        setErrorMsg(`保存に失敗しました: ${error.message}`)
        return
      }
      setSuccessMsg('保存しました')
      setTimeout(() => setSuccessMsg(null), 3000)
    }
  }

  async function handleDelete() {
    if (mode !== 'edit' || !shopId) return
    if (!confirm(`「${form.name}」を削除します。この操作は取り消せません。`)) return
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('shops').delete().eq('id', shopId)
    setDeleting(false)
    if (error) {
      setErrorMsg(`削除に失敗しました: ${error.message}`)
      return
    }
    router.push('/admin/shops')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {errorMsg && (
        <div
          style={{
            padding: 12,
            background: '#FBEDED',
            border: '1px solid #E6BFBF',
            borderRadius: 6,
            color: '#8C3D3D',
            fontSize: 13,
          }}
        >
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div
          style={{
            padding: 12,
            background: '#EDF6EF',
            border: '1px solid #BFD7C3',
            borderRadius: 6,
            color: '#3D7A4A',
            fontSize: 13,
          }}
        >
          {successMsg}
        </div>
      )}

      <section className="card">
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>基本情報</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">店名 <span style={{ color: 'var(--danger, #C07A6E)' }}>*</span></label>
            <input
              className="form-input"
              value={form.name}
              onChange={e => patch('name', e.target.value)}
              placeholder="例: カフェ ロワール 丸の内"
              required
            />
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="form-label">カテゴリラベル</label>
              <select
                className="form-select"
                value={form.category_label}
                onChange={e => patch('category_label', e.target.value)}
              >
                {CATEGORY_OPTIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>ユーザーに見えるカテゴリ表記</p>
            </div>
            <div>
              <label className="form-label">サムネバリアント</label>
              <select
                className="form-select"
                value={form.thumb_variant}
                onChange={e => patch('thumb_variant', e.target.value)}
              >
                {THUMB_VARIANT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>カードのアイコン・色を決める</p>
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="form-label">エリアラベル</label>
              <input
                className="form-input"
                value={form.area_label}
                onChange={e => patch('area_label', e.target.value)}
                placeholder="例: 東京"
              />
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>フィルター用の大区分</p>
            </div>
            <div>
              <label className="form-label">バッジ</label>
              <select
                className="form-select"
                value={form.badge_type}
                onChange={e => patch('badge_type', e.target.value as ShopFormData['badge_type'])}
              >
                {Object.entries(BADGE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="form-label">詳細エリア（area）</label>
              <input
                className="form-input"
                value={form.area}
                onChange={e => patch('area', e.target.value)}
                placeholder="例: 東京・表参道"
              />
            </div>
            <div>
              <label className="form-label">表示用ロケーション（location）</label>
              <input
                className="form-input"
                value={form.location}
                onChange={e => patch('location', e.target.value)}
                placeholder="例: 東京・表参道"
              />
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>通常は area と同じ</p>
            </div>
          </div>

          <div>
            <label className="form-label">ステージ表記（stage）</label>
            <input
              className="form-input"
              value={form.stage}
              onChange={e => patch('stage', e.target.value)}
              placeholder="例: カフェ · お見合い"
            />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>サムネ下に出る「カテゴリ · シーン」表記</p>
          </div>

          <div>
            <label className="form-label">所属相談所（任意）</label>
            <select
              className="form-select"
              value={form.agency_id ?? ''}
              onChange={e => patch('agency_id', e.target.value || null)}
            >
              <option value="">未設定</option>
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>「相談所おすすめ」バッジの紐付け先</p>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={e => patch('is_published', e.target.checked)}
                style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 13 }}>公開する（フロントサイトに表示）</span>
            </label>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>詳細情報</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">説明文</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={e => patch('description', e.target.value)}
              rows={4}
              placeholder="お店の雰囲気・特徴を 2〜3 文で"
            />
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="form-label">価格帯</label>
              <input
                className="form-input"
                value={form.price_range}
                onChange={e => patch('price_range', e.target.value)}
                placeholder="例: ¥1,500 〜 ¥3,000"
              />
            </div>
            <div>
              <label className="form-label">営業時間</label>
              <input
                className="form-input"
                value={form.hours}
                onChange={e => patch('hours', e.target.value)}
                placeholder="例: 11:00 〜 22:00"
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="form-label">定休日</label>
              <input
                className="form-input"
                value={form.holiday}
                onChange={e => patch('holiday', e.target.value)}
                placeholder="例: 火曜日"
              />
            </div>
            <div>
              <label className="form-label">アクセス</label>
              <input
                className="form-input"
                value={form.access}
                onChange={e => patch('access', e.target.value)}
                placeholder="例: 表参道駅 A1 出口 徒歩 3 分"
              />
            </div>
          </div>

          <div>
            <label className="form-label">住所</label>
            <input
              className="form-input"
              value={form.address}
              onChange={e => patch('address', e.target.value)}
              placeholder="例: 東京都港区南青山 5-X-X"
            />
          </div>

        </div>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>写真</h2>
        {mode === 'new' ? (
          <p style={{ fontSize: 13, color: 'var(--muted)', padding: 16, background: 'var(--bg)', borderRadius: 8 }}>
            保存後、続けて写真をアップロードできるようになります。
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* プロフィール画像 */}
            <div>
              <label className="form-label">プロフィール画像（カードのサムネに使われます）</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {form.photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={form.photo_url}
                      alt="プロフィール画像プレビュー"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>未設定</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 200 }}>
                  <input
                    ref={profileFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) handleProfileUpload(f)
                      e.target.value = ''
                    }}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => profileFileRef.current?.click()}
                    disabled={profileUploading}
                  >
                    {profileUploading
                      ? <span className="spinner" style={{ width: 16, height: 16 }} />
                      : form.photo_url ? '画像を変更' : '画像をアップロード'}
                  </button>
                  {form.photo_url && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleProfileRemove}
                      disabled={profileUploading}
                    >
                      画像を削除
                    </button>
                  )}
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                    JPEG / PNG / WebP、最大 5MB。未設定の場合はサムネバリアントのカテゴリアイコンで表示されます。
                  </p>
                </div>
              </div>
            </div>

            {/* ギャラリー */}
            <div>
              <label className="form-label">
                ギャラリー（詳細ページに並べる写真・{mediaList.length} 枚）
              </label>
              {mediaList.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--muted)', padding: 12, background: 'var(--bg)', borderRadius: 8, marginBottom: 12 }}>
                  ギャラリー写真はまだありません。下の「写真を追加」から複数枚アップロードできます。
                </p>
              )}
              {mediaList.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {mediaList.map((item, i) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: 12,
                        padding: 10,
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.media_url}
                        alt={item.alt_text ?? `ギャラリー画像 ${i + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 6,
                          background: 'var(--bg)',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                        <input
                          className="form-input"
                          defaultValue={item.caption ?? ''}
                          placeholder="キャプション（任意）"
                          onBlur={e => handleGalleryCaptionBlur(item, 'caption', e.target.value)}
                          style={{ fontSize: 12, padding: '6px 10px' }}
                        />
                        <input
                          className="form-input"
                          defaultValue={item.alt_text ?? ''}
                          placeholder="alt テキスト（SEO 用・任意）"
                          onBlur={e => handleGalleryCaptionBlur(item, 'alt_text', e.target.value)}
                          style={{ fontSize: 12, padding: '6px 10px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleGalleryMove(item, -1)}
                          disabled={i === 0}
                          aria-label="上に移動"
                          style={{ padding: '4px 8px' }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleGalleryMove(item, 1)}
                          disabled={i === mediaList.length - 1}
                          aria-label="下に移動"
                          style={{ padding: '4px 8px' }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleGalleryDelete(item)}
                          aria-label="削除"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 12 }}>
                <input
                  ref={galleryFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={e => {
                    if (e.target.files) handleGalleryUpload(e.target.files)
                    e.target.value = ''
                  }}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => galleryFileRef.current?.click()}
                  disabled={galleryUploading}
                >
                  {galleryUploading
                    ? <span className="spinner" style={{ width: 16, height: 16 }} />
                    : '写真を追加（複数選択可）'}
                </button>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                  JPEG / PNG / WebP、各最大 5MB。並び順は ↑↓ ボタンで変更できます。
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>予約・SNS 導線</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
          詳細ページのメイン CTA は <strong>予約サイト URL → Instagram → その他</strong> の優先順で出し分け、
          設定されている他のリンクは小さなアイコンボタンとして並べて表示します。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">予約サイト URL（booking_url）</label>
            <input
              className="form-input"
              type="url"
              value={form.booking_url}
              onChange={e => patch('booking_url', e.target.value)}
              placeholder="例: https://reserve.example.com/futarive-cafe"
            />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              一休 / OZmall / TableCheck / お店独自の予約フォームなど。最優先でメイン CTA に表示されます
            </p>
          </div>
          <div>
            <label className="form-label">Instagram URL（instagram_url）</label>
            <input
              className="form-input"
              type="url"
              value={form.instagram_url}
              onChange={e => patch('instagram_url', e.target.value)}
              placeholder="例: https://www.instagram.com/futarive_cafe/"
            />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              カフェ等で DM 予約が主の場合に。booking_url が未設定なら Instagram がメイン CTA になります
            </p>
          </div>
          <div>
            <label className="form-label">その他 SNS / 公式サイト URL（other_social_url）</label>
            <input
              className="form-input"
              type="url"
              value={form.other_social_url}
              onChange={e => patch('other_social_url', e.target.value)}
              placeholder="例: https://www.example.com/"
            />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              公式サイト / X / LINE 公式 など。両方未設定ならメイン CTA になります
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>タグ・特徴</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">特徴（features）</label>
            <ChipInput
              value={form.features}
              onChange={next => patch('features', next)}
              placeholder="例: 落ち着いた個室, 静か"
            />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>詳細ページに表示される特徴タグ</p>
          </div>

          <div>
            <label className="form-label">利用シーン（scenes）</label>
            <ChipInput
              value={form.scenes}
              onChange={next => patch('scenes', next)}
              placeholder="例: お見合い, デート"
            />
          </div>

          <div>
            <label className="form-label">タグ（tags）</label>
            <ChipInput
              value={form.tags}
              onChange={next => patch('tags', next)}
              placeholder="例: 個室あり, 駅近"
            />
          </div>
        </div>
      </section>

      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={deleting || saving}
            >
              {deleting ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '削除'}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/shops" className="btn btn-ghost">キャンセル</Link>
          <button type="submit" className="btn btn-primary" disabled={saving || deleting}>
            {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : mode === 'new' ? '登録する' : '保存'}
          </button>
        </div>
      </div>
    </form>
  )
}
