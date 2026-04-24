'use client'

import { useEffect, useRef, useState } from 'react'

const FRAME_SIZE = 280        // 画面上のクロップフレームサイズ
const OUTPUT_SIZE = 512       // 最終書き出しサイズ

interface Props {
  file: File
  onConfirm: (cropped: File) => void
  onCancel: () => void
}

export default function PhotoCropModal({ file, onConfirm, onCancel }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)           // ユーザーズーム倍率（1 = cover）
  const [pos, setPos] = useState({ x: 0, y: 0 })  // 中心からのオフセット（px）
  const [processing, setProcessing] = useState(false)

  const dragRef = useRef<{ x: number; y: number; startPosX: number; startPosY: number } | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  // ファイル読み込み
  useEffect(() => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      setImg(image)
      setScale(1)
      setPos({ x: 0, y: 0 })
    }
    image.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  // cover するためのベーススケール
  const baseScale = img
    ? FRAME_SIZE / Math.min(img.naturalWidth, img.naturalHeight)
    : 1
  const effectiveScale = baseScale * scale

  // 画像がフレーム外にはみ出さないよう位置を制限
  const clamp = (x: number, y: number) => {
    if (!img) return { x, y }
    const dispW = img.naturalWidth * effectiveScale
    const dispH = img.naturalHeight * effectiveScale
    const maxX = Math.max(0, (dispW - FRAME_SIZE) / 2)
    const maxY = Math.max(0, (dispH - FRAME_SIZE) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  useEffect(() => {
    setPos(prev => clamp(prev.x, prev.y))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, img])

  // ドラッグ（マウス・タッチ共通）
  const onPointerDown = (clientX: number, clientY: number) => {
    dragRef.current = { x: clientX, y: clientY, startPosX: pos.x, startPosY: pos.y }
  }
  const onPointerMove = (clientX: number, clientY: number) => {
    if (!dragRef.current) return
    const dx = clientX - dragRef.current.x
    const dy = clientY - dragRef.current.y
    setPos(clamp(dragRef.current.startPosX + dx, dragRef.current.startPosY + dy))
  }
  const onPointerUp = () => { dragRef.current = null }

  // グローバルイベント登録（フレーム外でも drag を追従させる）
  useEffect(() => {
    const move = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY)
    const up = () => onPointerUp()
    const tmove = (e: TouchEvent) => {
      if (e.touches[0]) { e.preventDefault(); onPointerMove(e.touches[0].clientX, e.touches[0].clientY) }
    }
    const tend = () => onPointerUp()
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', tmove, { passive: false })
    window.addEventListener('touchend', tend)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', tmove)
      window.removeEventListener('touchend', tend)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, scale, img])

  const handleConfirm = async () => {
    if (!img) return
    setProcessing(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_SIZE
      canvas.height = OUTPUT_SIZE
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas context取得失敗')

      // フレーム範囲に対応する原画ソース矩形を算出
      const sourceSize = FRAME_SIZE / effectiveScale
      const sourceX = img.naturalWidth / 2 - pos.x / effectiveScale - sourceSize / 2
      const sourceY = img.naturalHeight / 2 - pos.y / effectiveScale - sourceSize / 2

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceSize, sourceSize,
        0, 0, OUTPUT_SIZE, OUTPUT_SIZE,
      )

      const blob = await new Promise<Blob | null>(res =>
        canvas.toBlob(res, 'image/jpeg', 0.9)
      )
      if (!blob) throw new Error('画像変換に失敗しました')
      const cropped = new File([blob], file.name.replace(/\.[^.]+$/, '') + '-cropped.jpg', {
        type: 'image/jpeg',
      })
      onConfirm(cropped)
    } catch (e) {
      console.error('[crop] error', e)
      setProcessing(false)
    }
  }

  const displayStyle = img ? {
    width: img.naturalWidth * effectiveScale,
    height: img.naturalHeight * effectiveScale,
    transform: `translate(${pos.x}px, ${pos.y}px)`,
  } : {}

  return (
    <div className="kc-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="kc-modal" style={{ maxWidth: 360, padding: '24px 20px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>写真を調整</h2>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 4 }}>
            ドラッグで位置、スライダーで拡大を調整できます
          </p>
        </div>

        {/* クロップエリア */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
          <div
            ref={frameRef}
            onMouseDown={e => { e.preventDefault(); onPointerDown(e.clientX, e.clientY) }}
            onTouchStart={e => { if (e.touches[0]) onPointerDown(e.touches[0].clientX, e.touches[0].clientY) }}
            style={{
              position: 'relative',
              width: FRAME_SIZE,
              height: FRAME_SIZE,
              background: '#1a1612',
              overflow: 'hidden',
              cursor: dragRef.current ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
              borderRadius: 12,
            }}
          >
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                src={img.src}
                draggable={false}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -img.naturalHeight * effectiveScale / 2,
                  marginLeft: -img.naturalWidth * effectiveScale / 2,
                  pointerEvents: 'none',
                  ...displayStyle,
                }}
              />
            )}
            {/* 丸型オーバーレイマスク */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              boxShadow: `0 0 0 9999px rgba(0,0,0,.55)`,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,.8)',
            }} />
            {/* 中心のガイド十字 */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: dragRef.current ? 1 : 0,
              transition: 'opacity .15s',
            }}>
              <div style={{ width: 30, height: 1, background: 'rgba(255,255,255,.6)', position: 'absolute' }} />
              <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,.6)', position: 'absolute' }} />
            </div>
          </div>
        </div>

        {/* ズームスライダー */}
        <div style={{ padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="var(--text-mid)" strokeWidth="1.4"/>
              <path d="M9 9l4 4" stroke="var(--text-mid)" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M4 6h4" stroke="var(--text-mid)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent)' }}
            />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="var(--text-mid)" strokeWidth="1.4"/>
              <path d="M9 9l4 4" stroke="var(--text-mid)" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M4 6h4M6 4v4" stroke="var(--text-mid)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* アクションボタン */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
          <button className="kc-btn kc-btn-ghost" onClick={onCancel} disabled={processing}>
            キャンセル
          </button>
          <button className="kc-btn kc-btn-primary" onClick={handleConfirm} disabled={processing || !img}>
            {processing ? '処理中...' : '適用してアップロード'}
          </button>
        </div>
      </div>
    </div>
  )
}
