'use client'

interface SaveBarProps {
  status: 'saved' | 'dirty' | 'saving'
  onSave: () => void
  onDiscard?: () => void
  disabled?: boolean
}

export default function SaveBar({ status, onSave, onDiscard, disabled }: SaveBarProps) {
  return (
    <div className="save-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {status === 'saved' && (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="var(--success)" strokeWidth="1.3"/>
              <path d="M4 7l2 2 4-4" stroke="var(--success)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '12px', color: 'var(--success)' }}>自動保存済み</span>
          </>
        )}
        {status === 'saving' && (
          <>
            <div style={{
              width: 14,
              height: 14,
              border: '2px solid var(--border-mid)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}/>
            <span style={{ fontSize: '12px', color: 'var(--text-mid)' }}>保存中...</span>
          </>
        )}
        {status === 'dirty' && (
          <span style={{ fontSize: '12px', color: 'var(--warning)' }}>未保存の変更があります</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {onDiscard && status === 'dirty' && (
          <button onClick={onDiscard} className="kc-btn kc-btn-ghost kc-btn-sm">
            破棄
          </button>
        )}
        <button
          onClick={onSave}
          className="kc-btn kc-btn-primary kc-btn-sm"
          disabled={disabled || status === 'saving' || status === 'saved'}
        >
          保存する
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )
}
