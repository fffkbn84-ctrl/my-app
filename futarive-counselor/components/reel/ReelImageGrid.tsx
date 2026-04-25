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
const RECOMMENDED = 5

const PLACEHOLDER_LABELS = [
  'portrait 9:16',
  'Emma interior',
  'tea & notes',
  'bookshelf',
  'morning light',
  'street',
  'still life',
  'window',
  'ceramics',
  'plants',
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

function SortableThumb({
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      onClick={onSelect}
      className={`reel-thumb${selected ? ' selected' : ''}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <div className="reel-thumb-num">{index + 1}</div>

      {item.media_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.media_url} alt="" />
      ) : (
        <div className="reel-thumb-placeholder">
          {PLACEHOLDER_LABELS[index % PLACEHOLDER_LABELS.length]}
        </div>
      )}

      {item.caption && (
        <div className="reel-thumb-caption-pill">{item.caption}</div>
      )}

      <button
        className="reel-thumb-del"
        onClick={e => { e.stopPropagation(); onDelete() }}
        aria-label="削除"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2L2 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex(i => i.id === active.id)
    const newIdx = items.findIndex(i => i.id === over.id)
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

  const remaining = Math.max(0, RECOMMENDED - items.length)

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
          <div className="reel-thumbs">
            {items.map((item, idx) => (
              <SortableThumb
                key={item.id}
                item={item}
                index={idx}
                selected={item.id === selectedId}
                onSelect={() => onSelect(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            ))}

            {items.length < MAX_IMAGES && (
              <div className="reel-add" onClick={() => fileRef.current?.click()}>
                {uploading ? (
                  <div style={{
                    width: 24, height: 24,
                    border: '2px solid var(--border-mid)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}/>
                ) : (
                  <>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M14 6v16M6 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div className="reel-add-text">
                      写真を追加
                      {remaining > 0 && (
                        <div className="reel-add-text-sub">（あと{remaining}枚推奨）</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div className="reel-tip">
        縦長（9:16）で撮るとリールに余白なく収まります。<br/>
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
