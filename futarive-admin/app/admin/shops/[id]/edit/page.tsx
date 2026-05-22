'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ShopForm, { type ShopFormData, EMPTY_FORM } from '@/components/admin/ShopForm'
import { createClient } from '@/lib/supabase/client'

export default function EditShopPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const id = params?.id as string
  const justCreated = searchParams.get('created') === '1'

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [initial, setInitial] = useState<ShopFormData | null>(null)
  const [shopName, setShopName] = useState<string>('')

  useEffect(() => {
    if (!id) return
    loadShop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function loadShop() {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setShopName(data.name ?? '')
    setInitial({
      ...EMPTY_FORM,
      name: data.name ?? '',
      category_label: data.category_label ?? EMPTY_FORM.category_label,
      thumb_variant: data.thumb_variant ?? EMPTY_FORM.thumb_variant,
      area_label: data.area_label ?? EMPTY_FORM.area_label,
      area: data.area ?? '',
      location: data.location ?? '',
      stage: data.stage ?? '',
      badge_type: (data.badge_type as ShopFormData['badge_type']) ?? 'listed',
      agency_id: data.agency_id ?? null,
      description: data.description ?? '',
      price_range: data.price_range ?? '',
      hours: data.hours ?? '',
      holiday: data.holiday ?? '',
      access: data.access ?? '',
      address: data.address ?? '',
      photo_url: data.photo_url ?? '',
      booking_url: data.booking_url ?? '',
      instagram_url: data.instagram_url ?? '',
      other_social_url: data.other_social_url ?? '',
      features: Array.isArray(data.features) ? data.features : [],
      scenes: Array.isArray(data.scenes) ? data.scenes : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      is_published: data.is_published ?? true,
    })
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    )
  }

  if (notFound) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">お店が見つかりません</h1>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            指定された ID のお店は存在しないか、削除された可能性があります。
          </p>
          <Link href="/admin/shops" className="btn btn-primary">お店一覧へ戻る</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link
            href="/admin/shops"
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 4,
            }}
          >
            ← お店一覧に戻る
          </Link>
          <h1 className="page-title">お店を編集 — {shopName}</h1>
        </div>
      </div>

      {justCreated && (
        <div
          style={{
            padding: 12,
            background: '#EDF6EF',
            border: '1px solid #BFD7C3',
            borderRadius: 6,
            color: '#3D7A4A',
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          新規登録しました。続けて詳細を編集できます。
        </div>
      )}

      {initial && <ShopForm mode="edit" shopId={id} initial={initial} />}
    </div>
  )
}
