'use client'

import type { CounselorMedia } from '@/lib/types'

interface CaptionEditorProps {
  selected: CounselorMedia | null
  onSave: (mediaId: string, caption: string) => void
}

export default function CaptionEditor({ selected, onSave }: CaptionEditorProps) {
  if (!selected) {
    return (
      <div style={{
        background: 'var(--bg-elev)',
        border: '1px dashed var(--border-mid)',
        borderRadius: 12,
        padding: '20px 16px',
        textAlign: 'center',
        color: 'var(--text-light)',
        fontSize: 12,
      }}>
        画像を選択するとキャプションを編集できます
      </div>
    )
  }

  return (
    <div>
      <label className="kc-label">
        キャプション
        <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-light)', fontWeight: 400 }}>
          画像に表示される補足テキスト
        </span>
      </label>
      <textarea
        className="kc-textarea"
        style={{ minHeight: 70 }}
        value={selected.caption ?? ''}
        onChange={e => onSave(selected.id, e.target.value)}
        placeholder="この写真について一言..."
      />
    </div>
  )
}
