'use client'

import { useEffect, useState } from 'react'
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
  features: string[]
  scenes: string[]
  tags: string[]
  is_published: boolean
}

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

  useEffect(() => {
    loadAgencies()
  }, [])

  async function loadAgencies() {
    const supabase = createClient()
    const { data } = await supabase
      .from('agencies')
      .select('id, name')
      .order('name', { ascending: true })
    setAgencies(((data ?? []) as AgencyOption[]).map(a => ({ id: a.id, name: a.name })))
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

          <div>
            <label className="form-label">写真 URL</label>
            <input
              className="form-input"
              type="url"
              value={form.photo_url}
              onChange={e => patch('photo_url', e.target.value)}
              placeholder="https://..."
            />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>未指定の場合はサムネバリアントのカテゴリアイコンで表示</p>
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
