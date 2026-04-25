'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, CounselorMedia, Agency } from '@/lib/types'
import CatchphraseField from '@/components/reel/CatchphraseField'
import ReelImageGrid from '@/components/reel/ReelImageGrid'
import CaptionEditor from '@/components/reel/CaptionEditor'
import MottoField from '@/components/reel/MottoField'
import PhonePreview from '@/components/reel/PhonePreview'

interface Review {
  id: string
  rating: number
  body: string
  author_age_range: string | null
  author_gender: string | null
  created_at: string
}

export default function ReelPage() {
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [agency, setAgency] = useState<Agency | null>(null)
  const [mediaList, setMediaList] = useState<CounselorMedia[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [catchphrase, setCatchphrase] = useState('')
  const [motto, setMotto] = useState('')
  const [reelEnabled, setReelEnabled] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const cpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mottoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: c } = await supabase
        .from('counselors')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle()
      if (!c) {
        setLoading(false)
        return
      }

      setCounselor(c as Counselor)
      setCatchphrase(c.catchphrase ?? '')
      setMotto(c.message ?? '')
      setReelEnabled(c.reel_enabled ?? false)

      if (c.agency_id) {
        const { data: ag } = await supabase
          .from('agencies')
          .select('*')
          .eq('id', c.agency_id)
          .maybeSingle()
        setAgency(ag as Agency | null)
      }

      const { data: media } = await supabase
        .from('counselor_media')
        .select('*')
        .eq('counselor_id', c.id)
        .order('display_order')
      setMediaList((media as CounselorMedia[]) ?? [])

      const { data: rv } = await supabase
        .from('reviews')
        .select('id,rating,body,author_age_range,author_gender,created_at')
        .eq('counselor_id', c.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20)
      setReviews((rv as Review[]) ?? [])

      setLoading(false)
    }
    load()
  }, [])

  const handleCatchphraseChange = useCallback(
    (val: string) => {
      setCatchphrase(val)
      setSaveStatus('dirty')
      if (cpTimerRef.current) clearTimeout(cpTimerRef.current)
      cpTimerRef.current = setTimeout(async () => {
        if (!counselor) return
        setSaveStatus('saving')
        const supabase = createClient()
        await supabase
          .from('counselors')
          .update({ catchphrase: val })
          .eq('id', counselor.id)
        setSaveStatus('saved')
      }, 2000)
    },
    [counselor],
  )

  const handleMottoChange = useCallback(
    (val: string) => {
      setMotto(val)
      setSaveStatus('dirty')
      if (mottoTimerRef.current) clearTimeout(mottoTimerRef.current)
      mottoTimerRef.current = setTimeout(async () => {
        if (!counselor) return
        setSaveStatus('saving')
        const supabase = createClient()
        await supabase
          .from('counselors')
          .update({ message: val })
          .eq('id', counselor.id)
        setSaveStatus('saved')
      }, 2000)
    },
    [counselor],
  )

  const handleReelToggle = async (enabled: boolean) => {
    if (!counselor) return
    setReelEnabled(enabled)
    const supabase = createClient()
    await supabase
      .from('counselors')
      .update({ reel_enabled: enabled })
      .eq('id', counselor.id)
    showToast(enabled ? 'リールを公開しました' : 'リールを非公開にしました')
  }

  const captionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleCaptionSave = useCallback((mediaId: string, caption: string) => {
    setMediaList((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, caption } : m)),
    )
    if (captionTimer.current) clearTimeout(captionTimer.current)
    captionTimer.current = setTimeout(async () => {
      const supabase = createClient()
      await supabase
        .from('counselor_media')
        .update({ caption })
        .eq('id', mediaId)
    }, 2000)
  }, [])

  const handleUpload = async (file: File) => {
    if (!counselor) return
    setUploading(true)

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl
    await new Promise((res) => {
      img.onload = res
    })
    const ratio = img.width / img.height
    URL.revokeObjectURL(objectUrl)

    if (ratio > 0.6) {
      const ok = window.confirm(
        '縦長（9:16）の画像が推奨ですが、このまま使いますか？',
      )
      if (!ok) {
        setUploading(false)
        return
      }
    }

    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${counselor.id}/${crypto.randomUUID()}.${ext}`
    const { data: uploaded, error } = await supabase.storage
      .from('counselor-media')
      .upload(path, file)

    if (error || !uploaded) {
      showToast('アップロードに失敗しました')
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('counselor-media').getPublicUrl(uploaded.path)
    const nextOrder = mediaList.length

    const { data: inserted } = await supabase
      .from('counselor_media')
      .insert({
        counselor_id: counselor.id,
        media_url: publicUrl,
        display_order: nextOrder,
        media_type: 'image',
        caption: null,
      })
      .select()
      .maybeSingle()

    if (inserted) {
      setMediaList((prev) => [...prev, inserted as CounselorMedia])
      setSelectedId((inserted as CounselorMedia).id)
    }
    setUploading(false)
    showToast('画像を追加しました')
  }

  const handleReorder = async (newOrder: CounselorMedia[]) => {
    setMediaList(newOrder)
    const supabase = createClient()
    await Promise.all(
      newOrder.map((item) =>
        supabase
          .from('counselor_media')
          .update({ display_order: item.display_order })
          .eq('id', item.id),
      ),
    )
  }

  const handleDelete = (id: string) => setConfirmDelete(id)

  const confirmDoDelete = async () => {
    if (!confirmDelete) return
    const target = mediaList.find((m) => m.id === confirmDelete)
    if (!target) return

    const supabase = createClient()
    const urlParts = target.media_url.split('/counselor-media/')
    if (urlParts[1]) {
      await supabase.storage
        .from('counselor-media')
        .remove([decodeURIComponent(urlParts[1])])
    }
    await supabase.from('counselor_media').delete().eq('id', confirmDelete)

    const remaining = mediaList
      .filter((m) => m.id !== confirmDelete)
      .map((m, i) => ({ ...m, display_order: i }))
    setMediaList(remaining)
    if (selectedId === confirmDelete) setSelectedId(remaining[0]?.id ?? null)
    setConfirmDelete(null)
    showToast('画像を削除しました')
  }

  const selectedMedia = mediaList.find((m) => m.id === selectedId) ?? null

  if (loading)
    return (
      <div style={{ padding: 32, color: 'var(--text-mid)' }}>
        読み込み中...
      </div>
    )

  if (!counselor) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>
          プロフィールを先に作成してください。
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '28px 24px',
        paddingBottom: 130,
        maxWidth: 720,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        REEL
      </div>

      <h1 className="page-title" style={{ fontSize: 28, marginBottom: 14 }}>
        あなたのリール
      </h1>

      <p
        style={{
          fontSize: 13,
          color: 'var(--text-mid)',
          lineHeight: 1.85,
          marginBottom: 28,
        }}
      >
        Kinda talk のカウンセラー一覧で、利用者が最初に出会う「あなたの印象」です。
        <br />
        3〜5枚で、普段の空気が伝わる順に並べるのがおすすめ。
      </p>

      {/* 各セクションを縦スタック */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CatchphraseField
          value={catchphrase}
          onChange={handleCatchphraseChange}
        />

        <div className="kc-card" style={{ padding: 20 }}>
          <ReelImageGrid
            items={mediaList}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id)
              setPreviewIndex(mediaList.findIndex((m) => m.id === id))
            }}
            onReorder={handleReorder}
            onDelete={handleDelete}
            onUpload={handleUpload}
            uploading={uploading}
          />
        </div>

        <div className="kc-card" style={{ padding: 20 }}>
          <CaptionEditor selected={selectedMedia} onSave={handleCaptionSave} />
        </div>

        <div className="kc-card" style={{ padding: 20 }}>
          <MottoField value={motto} onChange={handleMottoChange} />
        </div>

        {/* 公開設定カード */}
        <div className="kc-card" style={{ padding: 20 }}>
          <h3 className="section-title" style={{ marginBottom: 6 }}>
            公開設定
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 14,
              marginTop: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text-deep)',
                }}
              >
                リールを Kinda talk で公開する
              </div>
              <p
                style={{
                  fontSize: 11.5,
                  color: 'var(--text-mid)',
                  marginTop: 6,
                  lineHeight: 1.7,
                }}
              >
                OFF の場合、プロフィールは表示されますがリールは非表示になります
              </p>
            </div>
            <label className="kc-toggle" style={{ flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={reelEnabled}
                onChange={(e) => handleReelToggle(e.target.checked)}
              />
              <span className="kc-toggle-slider" />
            </label>
          </div>
        </div>

        {/* インラインプレビュー */}
        <div style={{ marginTop: 6 }}>
          <p
            className="eyebrow"
            style={{ textAlign: 'center', marginBottom: 14 }}
          >
            PREVIEW
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PhonePreview
              catchphrase={catchphrase}
              mediaList={mediaList}
              selectedIndex={previewIndex}
              onSelectIndex={(i) => {
                setPreviewIndex(i)
                setSelectedId(mediaList[i]?.id ?? null)
              }}
              counselorId={counselor.id}
              counselorName={counselor.name}
              agencyName={agency?.name ?? ''}
              area={counselor.area}
              ratingAvg={counselor.rating_avg}
              reviewCount={counselor.review_count}
              reviews={reviews}
            />
          </div>
          <p
            style={{
              textAlign: 'center',
              fontSize: 11.5,
              color: 'var(--text-light)',
              marginTop: 14,
              lineHeight: 1.7,
            }}
          >
            実際の表示イメージです。
            <br />
            スワイプで次の画像に切り替わります。
          </p>
        </div>
      </div>

      {/* 固定セーブバー */}
      <ReelSaveBar
        status={saveStatus}
        published={reelEnabled}
        liveUrl={`https://kinda.futarive.jp/counselors/${counselor.id}`}
      />

      {/* 削除確認モーダル */}
      {confirmDelete && (
        <div className="kc-overlay">
          <div className="kc-modal" style={{ maxWidth: 340 }}>
            <h2 className="kc-modal-title">画像を削除しますか？</h2>
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-mid)',
                marginBottom: 20,
              }}
            >
              この操作は取り消せません。Storage からも完全に削除されます。
            </p>
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-end',
              }}
            >
              <button
                className="kc-btn kc-btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                キャンセル
              </button>
              <button
                className="kc-btn kc-btn-danger"
                onClick={confirmDoDelete}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}

function ReelSaveBar({
  status,
  published,
  liveUrl,
}: {
  status: 'saved' | 'dirty' | 'saving'
  published: boolean
  liveUrl: string
}) {
  return (
    <div className="reel-save-bar">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
          flex: 1,
        }}
      >
        {status === 'saving' ? (
          <>
            <div
              style={{
                width: 10,
                height: 10,
                border: '2px solid var(--border-mid)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                color: 'var(--text-mid)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              保存中…
            </span>
          </>
        ) : status === 'dirty' ? (
          <>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--warning)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                color: 'var(--warning)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              未保存の変更があります
            </span>
          </>
        ) : (
          <>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--success)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                color: 'var(--text-mid)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              自動保存済み
              <span style={{ color: 'var(--text-light)', margin: '0 4px' }}>
                ·
              </span>
              <span
                style={{
                  color: published ? 'var(--accent-deep)' : 'var(--text-light)',
                }}
              >
                {published ? '公開中' : '非公開'}
              </span>
            </span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="kc-btn kc-btn-ghost kc-btn-sm"
        >
          実機で確認
        </a>
        <button
          type="button"
          className="kc-btn kc-btn-primary kc-btn-sm"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          aria-label="変更を公開"
        >
          変更を公開
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
