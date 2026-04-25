'use client'

import { useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CounselorMedia } from '@/lib/types'

const MAX_IMAGES = 10
const RECOMMENDED = 3

const SLOT_HINTS = [
  'portrait 9:16',
  'agency interior',
  'tea & notes',
  'bookshelf',
  'window light',
  'workspace',
]

interface ReelImageGridProps {
  items: CounselorMedia[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (newOrder: CounselorMedia[]) => void
  onDelete: (id: string) => void
  onUpload: (file: File) => void
  uploading: boolean
}

function SortableItem({
  item,
  index,
  selected,
  onSelect,
  onDelete,
}: {
  item: CounselorMedia
  index: number
  selected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        outline: selected ? '2.5px solid var(--accent)' : 'none',
        outlineOffset: 2,
        borderRadius: 12,
      }}
      className="reel-grid-item"
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.media_url}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* 順番バッジ（左上） */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'rgba(255,255,255,.92)',
          color: 'var(--text-deep)',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'DM Sans, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }}
      >
        {index + 1}
      </div>

      {/* キャプションが入っていれば白いピルを画像の下に重ねる */}
      {item.caption && (
        <div
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
            background: 'rgba(255,255,255,.96)',
            borderRadius: 10,
            padding: '8px 10px',
            fontSize: 11,
            color: 'var(--text)',
            lineHeight: 1.45,
            boxShadow: '0 2px 8px rgba(0,0,0,.12)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.caption}
        </div>
      )}

      {/* hover時の暗いオーバーレイ + 削除ボタン */}
      <div className="reel-grid-item-overlay">
        <button
          className="reel-grid-item-del"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="画像を削除"
          style={{
            background: 'rgba(0,0,0,.55)',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 2l8 8M10 2L2 10"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

function PlaceholderSlot({ index }: { index: number }) {
  return (
    <div
      className="reel-grid-item"
      style={{
        cursor: 'default',
        background:
          'linear-gradient(180deg, var(--bg-elev) 0%, var(--bg-subtle) 100%)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'var(--card)',
          color: 'var(--text-mid)',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'DM Sans, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border)',
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Shippori Mincho, serif',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-light)',
          padding: '0 8px',
          textAlign: 'center',
        }}
      >
        {SLOT_HINTS[index] ?? `slot ${index + 1}`}
      </div>
    </div>
  )
}

export default function ReelImageGrid({
  items,
  selectedId,
  onSelect,
  onReorder,
  onDelete,
  onUpload,
  uploading,
}: ReelImageGridProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex((i) => i.id === active.id)
    const newIdx = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIdx, newIdx).map((item, idx) => ({
      ...item,
      display_order: idx,
    }))
    onReorder(reordered)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(file)
    e.target.value = ''
  }

  const remaining = Math.max(RECOMMENDED - items.length, 0)
  // 空きスロットの表示数: 推奨枚数 - 既存枚数。最低1枚は常に表示。
  const placeholderCount = Math.max(RECOMMENDED - items.length, 0)

  return (
    <div>
      <div style={{ marginBottom: 6 }}>
        <h3
          className="section-title"
          style={{ marginBottom: 6 }}
        >
          リール画像
        </h3>
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-mid)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          1枚目に顔、2枚目に相談所の様子、3枚目以降に人柄が伝わる写真を。
          ドラッグで順番を入れ替えられます。
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="reel-grid" style={{ marginTop: 14 }}>
            {items.map((item, idx) => (
              <SortableItem
                key={item.id}
                item={item}
                index={idx}
                selected={item.id === selectedId}
                onSelect={() => onSelect(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            ))}

            {/* プレースホルダー: 推奨枚数まで番号付きの空スロットを表示 */}
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <PlaceholderSlot key={`p-${i}`} index={items.length + i} />
            ))}

            {/* 追加スロット */}
            {items.length < MAX_IMAGES && (
              <div
                className="reel-add-slot"
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      border: '2px solid var(--border-mid)',
                      borderTopColor: 'var(--accent)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path
                        d="M11 5v12M5 11h12"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--accent-deep)',
                        fontWeight: 500,
                      }}
                    >
                      写真を追加
                    </span>
                    {remaining > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          color: 'var(--text-light)',
                          marginTop: -2,
                        }}
                      >
                        （あと{remaining}枚推奨）
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* 撮り方ヒント */}
      <div
        style={{
          marginTop: 14,
          padding: '12px 14px',
          background: 'var(--card-warm)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          fontSize: 11.5,
          color: 'var(--text-mid)',
          lineHeight: 1.7,
        }}
      >
        縦長（9:16）で撮るとリールに余白なく収まります。
        <br />
        iPhone のポートレート写真がそのまま使えます。
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
