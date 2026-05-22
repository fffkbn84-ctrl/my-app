'use client'

import Link from 'next/link'
import ShopForm from '@/components/admin/ShopForm'

export default function NewShopPage() {
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
          <h1 className="page-title">お店を新規登録</h1>
        </div>
      </div>

      <ShopForm mode="new" />
    </div>
  )
}
