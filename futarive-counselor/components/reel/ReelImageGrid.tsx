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
  selected,
  onSelect,
  onDelete,
}: {
  item: CounselorMedia
  selected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

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
      <img src={item.media_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div className="reel-grid-item-overlay">
        <button
          className="reel-grid-item-del"
          onClick={e => { e.stopPropagation(); onDelete(item.id) }}
          style={{
            background: 'rgba(0,0,0,.55)',
            border: 'none',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {/* 順番バッジ */}
      <div style={{
        position: 'absolute',
        top: 6, left: 6,
        background: 'rgba(0,0,0,.5)',
        borderRadius: 6,
        padding: '1px 6px',
        fontSize: 9,
        fontFamily: 'DM Sans, sans-serif',
        color: 'white',
      }}>
        {item.display_order + 1}
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <label className="kc-label" style={{ marginBottom: 0 }}>
          リール画像
          <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-light)', fontWeight: 400 }}>
            推奨 3〜5枚・最大 {MAX_IMAGES} 枚（縦長 9:16 推奨）
          </span>
        </label>
        <span style={{ fontSize: 11, color: 'var(--text-light)', fontFamily: 'DM Sans, sans-serif' }}>
          {items.length}/{MAX_IMAGES}
        </span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
          <div className="reel-grid">
            {items.map(item => (
              <SortableItem
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={() => onSelect(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            ))}

            {/* 追加スロット */}
            {items.length < MAX_IMAGES && (
              <div
                className="reel-add-slot"
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <div style={{
                    width: 20, height: 20,
                    border: '2px solid var(--border-mid)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}/>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M11 5v12M5 11h12" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>追加</span>
                  </>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

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
