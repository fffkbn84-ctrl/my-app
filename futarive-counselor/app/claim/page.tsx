import { Suspense } from 'react'
import ClaimContent from './ClaimContent'

export default function ClaimPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--text-mid)' }}>読み込み中…</div>}>
      <ClaimContent />
    </Suspense>
  )
}
