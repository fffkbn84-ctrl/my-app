'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
interface ShopRow {
  id: string
  agency_id: string | null
  name: string
  category: string | null
  area: string | null
  badge_type: 'certified' | 'agency' | 'listed'
  review_count: number | null
  is_published: boolean
  created_at: string
}

type ShopWithAgency = ShopRow & { agency_name: string }

const BADGE_LABELS: Record<string, string> = {
  certified: '取材済み',
  agency: '相談所おすすめ',
  listed: '掲載店',
}

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopWithAgency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadShops() }, [])

  async function loadShops() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('shops').select('*, agencies(name)').order('created_at', { ascending: false })
    setShops(
      (data ?? []).map((s: Record<string, unknown>) => ({
        ...s,
        agency_name: (s.agencies as { name?: string } | null)?.name ?? '—',
      })) as ShopWithAgency[]
    )
    setLoading(false)
  }

  async function togglePublish(id: string, current: boolean) {
    await createClient().from('shops').update({ is_published: !current }).eq('id', id)
    loadShops()
  }

  async function updateBadge(id: string, badge: string) {
    await createClient().from('shops').update({ badge_type: badge as 'certified' | 'agency' | 'listed' }).eq('id', id)
    loadShops()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">お店管理</h1>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : shops.length === 0 ? (
          <div className="empty-state">お店データがありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>店名</th>
                  <th>カテゴリ</th>
                  <th>エリア</th>
                  <th>バッジ</th>
                  <th>口コミ数</th>
                  <th>掲載状態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {shops.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>{s.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{s.category ?? '—'}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{s.area ?? '—'}</td>
                    <td>
                      <select
                        className="form-select"
                        value={s.badge_type}
                        onChange={e => updateBadge(s.id, e.target.value)}
                        style={{ width: 'auto', minWidth: 120, fontSize: 12, padding: '4px 28px 4px 8px' }}
                      >
                        {Object.entries(BADGE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>{s.review_count ?? 0}</td>
                    <td>
                      <label className="toggle">
                        <input type="checkbox" checked={s.is_published} onChange={() => togglePublish(s.id, s.is_published)} />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <span className={`badge badge-${s.badge_type}`}>
                        {BADGE_LABELS[s.badge_type] ?? s.badge_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
