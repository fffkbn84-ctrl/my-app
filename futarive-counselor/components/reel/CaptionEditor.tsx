'use client'

import type { CounselorMedia } from '@/lib/types'

interface CaptionEditorProps {
  selected: CounselorMedia | null
  onSave: (mediaId: string, caption: string) => void
}

export default function CaptionEditor({ selected, onSave }: CaptionEditorProps) {
  if (!selected) {
    return (
      <div
        style={{
          background: 'var(--bg-elev)',
          border: '1px dashed var(--border-mid)',
          borderRadius: 12,
          padding: '20px 16px',
          textAlign: 'center',
          color: 'var(--text-light)',
          fontSize: 12,
        }}
      >
        画像を選択するとキャプションを編集できます
      </div>
    )
  }

  const slotNum = selected.display_order + 1

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: 'var(--text-mid)',
          }}
        >
          選択中：
          <span
            style={{
              color: 'var(--text-deep)',
              fontWeight: 600,
              margin: '0 4px',
            }}
          >
            {slotNum}枚目
          </span>
          のキャプション
        </span>
        <span
          style={{
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 999,
            background: 'var(--bg-subtle)',
            color: 'var(--text-mid)',
          }}
        >
          任意
        </span>
      </div>

      <textarea
        className="kc-textarea"
        style={{ minHeight: 70 }}
        value={selected.caption ?? ''}
        onChange={(e) => onSave(selected.id, e.target.value)}
        placeholder="この写真について一言..."
      />

      <p
        style={{
          fontSize: 11,
          color: 'var(--text-light)',
          marginTop: 8,
          lineHeight: 1.6,
        }}
      >
        リール視聴時に画像の下に薄く表示されます。書かなくてもOK。
      </p>
    </div>
  )
}
