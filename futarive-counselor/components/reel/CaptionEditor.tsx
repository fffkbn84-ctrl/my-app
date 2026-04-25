'use client'

import type { CounselorMedia } from '@/lib/types'

interface CaptionEditorProps {
  selected: CounselorMedia | null
  selectedIndex: number
  onSave: (mediaId: string, caption: string) => void
}

export default function CaptionEditor({ selected, selectedIndex, onSave }: CaptionEditorProps) {
  if (!selected) return null

  return (
    <div className="cap-card">
      <div className="cap-head">
        <span className="cap-head-label">選択中：</span>
        <span className="cap-head-num">{selectedIndex + 1}枚目</span>
        <span className="cap-head-label">のキャプション</span>
        <span className="cap-optional">任意</span>
      </div>
      <textarea
        className="cap-textarea"
        value={selected.caption ?? ''}
        onChange={e => onSave(selected.id, e.target.value)}
        placeholder="この写真について一言..."
      />
      <p className="cap-help">
        リール視聴時に画像の下に薄く表示されます。書かなくてもOK。
      </p>
    </div>
  )
}
