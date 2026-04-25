'use client'

import { useEffect, useRef, useState } from 'react'

const FRAME_SIZE = 280   // 画面上のクロップフレームサイズ
const OUTPUT_SIZE = 512  // 最終書き出しサイズ
const MAX_SCALE = 4
// 縦横比が極端な画像でも「画像全体を枠に収める」まで小さくできるよう、
// MIN_SCALE は画像から動的に算出する（min = contain / cover 比 = 短辺/長辺）。

interface Props {
  file: File
  onConfirm: (cropped: File) => void
  onCancel: () => void
}

export default function PhotoCropModal({ file, onConfirm, onCancel }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [processing, setProcessing] = useState(false)
  const [interacting, setInteracting] = useState(false)

  // 操作中の状態を ref で保持（マルチタッチ対応）
  const stateRef = useRef<{
    mode: 'none' | 'drag' | 'pinch'
    startX: number
    startY: number
    startPosX: number
    startPosY: number
    startDist: number
    startScale: number
  }>({
    mode: 'none', startX: 0, startY: 0, startPosX: 0, startPosY: 0, startDist: 0, startScale: 1,
  })

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

  // cover ベーススケール（短辺フィット）と、それを基準とした最小スケール（画像全体を枠に収める）
  const baseScale = img
    ? FRAME_SIZE / Math.min(img.naturalWidth, img.naturalHeight)
    : 1
  const minScale = img
    ? Math.min(img.naturalWidth, img.naturalHeight) / Math.max(img.naturalWidth, img.naturalHeight)
    : 1
  const effectiveScale = baseScale * scale

  // 画像がフレーム外にはみ出さないよう位置を制限
  const clamp = (x: number, y: number, s: number = scale) => {
    if (!img) return { x, y }
    const eff = baseScale * s
    const dispW = img.naturalWidth * eff
    const dispH = img.naturalHeight * eff
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

  const setScaleClamped = (s: number) => {
    setScale(Math.max(minScale, Math.min(MAX_SCALE, s)))
  }

  // 2点間の距離（React.Touch / DOM Touch 両対応の最小型）
  const distance = (t1: { clientX: number; clientY: number }, t2: { clientX: number; clientY: number }) => {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.hypot(dx, dy)
  }

  // タッチ開始
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0]
      stateRef.current = {
        mode: 'drag',
        startX: t.clientX, startY: t.clientY,
        startPosX: pos.x, startPosY: pos.y,
        startDist: 0, startScale: scale,
      }
      setInteracting(true)
    } else if (e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]]
      stateRef.current = {
        mode: 'pinch',
        startX: 0, startY: 0,
        startPosX: pos.x, startPosY: pos.y,
        startDist: distance(t1, t2),
        startScale: scale,
      }
      setInteracting(true)
    }
  }

  // マウス開始
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    stateRef.current = {
      mode: 'drag',
      startX: e.clientX, startY: e.clientY,
      startPosX: pos.x, startPosY: pos.y,
      startDist: 0, startScale: scale,
    }
    setInteracting(true)
  }

  // ホイールズーム（PC）
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = -e.deltaY * 0.002
    setScaleClamped(scale + delta * scale)
  }

  // グローバル move/up リスナー
  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      const s = stateRef.current
      if (s.mode === 'drag') {
        const dx = clientX - s.startX
        const dy = clientY - s.startY
        setPos(clamp(s.startPosX + dx, s.startPosY + dy))
      }
    }
    const onTMove = (e: TouchEvent) => {
      const s = stateRef.current
      if (s.mode === 'drag' && e.touches[0]) {
        e.preventDefault()
        onMove(e.touches[0].clientX, e.touches[0].clientY)
      } else if (s.mode === 'pinch' && e.touches.length === 2) {
        e.preventDefault()
        const d = distance(e.touches[0], e.touches[1])
        const ratio = d / s.startDist
        setScaleClamped(s.startScale * ratio)
      }
    }
    const onUp = () => {
      stateRef.current.mode = 'none'
      setInteracting(false)
    }
    const onMMove = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    window.addEventListener('mousemove', onMMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTMove, { passive: false })
    window.addEventListener('touchend', onUp)
    window.addEventListener('touchcancel', onUp)
    return () => {
      window.removeEventListener('mousemove', onMMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTMove)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('touchcancel', onUp)
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

  return (
    <div className="kc-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="kc-modal" style={{ maxWidth: 360, padding: '24px 20px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>写真を調整</h2>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 4, lineHeight: 1.7 }}>
            ドラッグで位置調整。<br/>
            ピンチ・ホイール・スライダーで拡大できます。
          </p>
        </div>

        {/* クロップエリア */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onWheel={handleWheel}
            style={{
              position: 'relative',
              width: FRAME_SIZE,
              height: FRAME_SIZE,
              background: '#1a1612',
              overflow: 'hidden',
              cursor: interacting ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
              borderRadius: 12,
            }}
          >
            {img && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src={img.src}
                  draggable={false}
                  style={{
                    width: img.naturalWidth * effectiveScale,
                    height: img.naturalHeight * effectiveScale,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    flexShrink: 0,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    willChange: 'transform',
                  }}
                />
              </div>
            )}
            {/* 丸マスク */}
            <div style={{
              position: 'absolute', inset: 0,
              pointerEvents: 'none',
              boxShadow: '0 0 0 9999px rgba(0,0,0,.55)',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,.8)',
            }} />
            {/* 中心ガイド */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: interacting ? 1 : 0,
              transition: 'opacity .15s',
            }}>
              <div style={{ width: 30, height: 1, background: 'rgba(255,255,255,.6)', position: 'absolute' }} />
              <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,.6)', position: 'absolute' }} />
            </div>
          </div>
        </div>

        {/* ズームコントロール */}
        <div style={{ padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setScaleClamped(scale - 0.25)}
              aria-label="縮小"
              style={zoomBtnStyle}
              disabled={scale <= minScale + 0.001}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            <input
              type="range"
              min={minScale}
              max={MAX_SCALE}
              step={0.01}
              value={scale}
              onChange={e => setScaleClamped(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent)' }}
              aria-label="ズーム"
            />
            <button
              type="button"
              onClick={() => setScaleClamped(scale + 0.25)}
              aria-label="拡大"
              style={zoomBtnStyle}
              disabled={scale >= MAX_SCALE - 0.001}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div style={{
            textAlign: 'center', fontSize: 10,
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--text-mid)',
            marginTop: 6,
          }}>
            {scale.toFixed(2)}x
          </div>
        </div>

        {/* アクション */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
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

const zoomBtnStyle: React.CSSProperties = {
  width: 32, height: 32,
  borderRadius: '50%',
  border: '1px solid var(--border)',
  background: 'var(--bg-elev)',
  color: 'var(--text)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
}
