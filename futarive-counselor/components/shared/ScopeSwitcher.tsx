// futarive-counselor/components/shared/ScopeSwitcher.tsx
//
// オーナーモード時に表示する「カウンセラー切替」ドロップダウン。
// useAgencyScope で取得した scope / setScope と組み合わせて使う。
//
// オーナーモードでない場合（一般カウンセラー本人）は何も表示しない。

'use client'

import { useEffect } from 'react'
import { SCOPE_ALL, type AgencyScope } from '@/lib/hooks/useAgencyScope'

type Props = {
  scope: AgencyScope
  // 個別カウンセラーモード必須にしたいページ（例: reel）では allowAll=false にする
  allowAll?: boolean
  // ラベル（任意・default: 'カウンセラー'）
  label?: string
  compact?: boolean
}

export default function ScopeSwitcher({ scope, allowAll = true, label = 'カウンセラー', compact }: Props) {
  const { isOwner, counselors, scope: value, setScope, agencies } = scope

  // allowAll=false かつ初期値が ALL の時は先頭カウンセラーに自動修正
  // （個別カウンセラー必須のページで「全体」が選ばれた状態を防ぐ）
  useEffect(() => {
    if (!allowAll && value === SCOPE_ALL && counselors.length > 0) {
      setScope(counselors[0].id)
    }
  }, [allowAll, value, counselors, setScope])

  // オーナーでない、または選択肢が1人以下なら出さない
  if (!isOwner || counselors.length <= 1) return null

  const agencyName = agencies[0]?.name ?? '相談所'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 6 : 10,
      flexWrap: 'wrap',
    }}>
      {!compact && (
        <span style={{
          fontSize: 11,
          fontFamily: 'DM Sans, sans-serif',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--text-mid)',
        }}>
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={e => setScope(e.target.value)}
        className="kc-input"
        style={{
          fontSize: 13,
          padding: '6px 10px',
          minWidth: 180,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}
      >
        {allowAll && <option value={SCOPE_ALL}>{agencyName}・全体</option>}
        {counselors.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}
