'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatLastReviewed, freshnessLevel, freshnessColor } from '@/lib/freshness'

interface ShopRow {
  id: string
  agency_id: string | null
  name: string
  category_label: string | null
  area_label: string | null
  area: string | null
  badge_type: 'certified' | 'agency' | 'listed'
  review_count: number | null
  is_published: boolean
  created_at: string
  last_reviewed_at: string | null
}

type ShopWithAgency = ShopRow & { agency_name: string }
type SortKey = 'created_at' | 'last_reviewed_at'

const BADGE_LABELS: Record<string, string> = {
  certified: '取材済み',
  agency: '相談所おすすめ',
  listed: '掲載店',
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopWithAgency[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('last_reviewed_at')

  useEffect(() => { loadShops(sortKey) }, [sortKey])

  async function loadShops(key: SortKey) {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('shops')
      .select('*, agencies(name)')
      .order(key, { ascending: key === 'last_reviewed_at' })
    setShops(
      (data ?? []).map((s: Record<string, unknown>) => ({
        ...s,
        agency_name: (s.agencies as { name?: string } | null)?.name ?? '—',
      })) as ShopWithAgency[]
    )
    setLoading(false)
  }

  async function markReviewed(id: string) {
    await createClient().from('shops').update({ last_reviewed_at: new Date().toISOString() }).eq('id', id)
    loadShops(sortKey)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">お店管理</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>並び順</span>
          <select
            className="form-select"
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            style={{ width: 'auto', fontSize: 12, padding: '4px 28px 4px 8px' }}
          >
            <option value="last_reviewed_at">最終点検（古い順）</option>
            <option value="created_at">作成日（新しい順）</option>
          </select>
          <Link href="/admin/shops/new" className="btn btn-primary" style={{ gap: 6 }}>
            <IconPlus /> 新規追加
          </Link>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : shops.length === 0 ? (
          <div className="empty-state">
            お店データがありません。<br />
            <Link href="/admin/shops/new" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>新規追加</Link>から登録できます。
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>店名</th>
                  <th>カテゴリ</th>
                  <th>エリア</th>
                  <th>相談所</th>
                  <th>バッジ</th>
                  <th>口コミ数</th>
                  <th>公開</th>
                  <th>最終点検</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {shops.map(s => {
                  const level = freshnessLevel(s.last_reviewed_at)
                  return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>{s.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{s.category_label ?? '—'}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{s.area ?? s.area_label ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{s.agency_name}</td>
                    <td>
                      <span className={`badge badge-${s.badge_type}`}>
                        {BADGE_LABELS[s.badge_type] ?? s.badge_type}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>{s.review_count ?? 0}</td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>
                      {s.is_published ? (
                        <span style={{ color: 'var(--success, #7A9E87)', fontWeight: 600 }}>●</span>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>○</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: freshnessColor(level), whiteSpace: 'nowrap', fontWeight: level === 'fresh' ? 400 : 600 }}>
                      {formatLastReviewed(s.last_reviewed_at)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link
                          href={`/admin/shops/${s.id}/edit`}
                          className="btn btn-ghost btn-sm"
                          style={{ gap: 4, textDecoration: 'none' }}
                        >
                          <IconEdit /> 編集
                        </Link>
                        <button
                          onClick={() => markReviewed(s.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 11, whiteSpace: 'nowrap' }}
                          title="内容を確認した時刻を更新します"
                        >
                          点検OK
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
