'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Counselor, CounselorMedia, Agency } from '@/lib/types'
import CatchphraseField from '@/components/reel/CatchphraseField'
import ReelImageGrid from '@/components/reel/ReelImageGrid'
import CaptionEditor from '@/components/reel/CaptionEditor'
import PhonePreview from '@/components/reel/PhonePreview'

interface Review {
  id: string; rating: number; body: string
  author_age_range: string | null; author_gender: string | null; created_at: string
}

export default function ReelPage() {
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [agency, setAgency] = useState<Agency | null>(null)
  const [mediaList, setMediaList] = useState<CounselorMedia[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [catchphrase, setCatchphrase] = useState('')
  const [bio, setBio] = useState('')
  const [reelEnabled, setReelEnabled] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const cpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: c } = await supabase.from('counselors').select('*').eq('owner_user_id', user.id).maybeSingle()
      if (!c) { setLoading(false); return }

      setCounselor(c as Counselor)
      setCatchphrase(c.catchphrase ?? '')
      setBio(c.bio ?? '')
      setReelEnabled(c.reel_enabled ?? false)

      if (c.agency_id) {
        const { data: ag } = await supabase.from('agencies').select('*').eq('id', c.agency_id).maybeSingle()
        setAgency(ag as Agency | null)
      }

      const { data: media } = await supabase
        .from('counselor_media').select('*')
        .eq('counselor_id', c.id).order('display_order')
      const list = (media as CounselorMedia[]) ?? []
      setMediaList(list)
      if (list[0]) setSelectedId(list[0].id)

      const { data: rv } = await supabase
        .from('reviews')
        .select('id,rating,body,author_age_range,author_gender,created_at')
        .eq('counselor_id', c.id).eq('is_published', true)
        .order('created_at', { ascending: false }).limit(20)
      setReviews((rv as Review[]) ?? [])

      setLoading(false)
    }
    load()
  }, [])

  const handleCatchphraseChange = useCallback((val: string) => {
    setCatchphrase(val)
    setSaveStatus('dirty')
    if (cpTimerRef.current) clearTimeout(cpTimerRef.current)
    cpTimerRef.current = setTimeout(() => saveCatchphrase(val), 1500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counselor])

  const saveCatchphrase = async (val: string) => {
    if (!counselor) return
    setSaveStatus('saving')
    const supabase = createClient()
    const { error } = await supabase.from('counselors').update({ catchphrase: val }).eq('id', counselor.id)
    if (error) {
      showToast(`保存失敗：${describeError(error)}`)
      setSaveStatus('dirty'); return
    }
    setSaveStatus('saved')
  }

  const handleBioChange = useCallback((val: string) => {
    setBio(val)
    setSaveStatus('dirty')
    if (bioTimerRef.current) clearTimeout(bioTimerRef.current)
    bioTimerRef.current = setTimeout(async () => {
      if (!counselor) return
      setSaveStatus('saving')
      const supabase = createClient()
      const { error } = await supabase.from('counselors').update({ bio: val }).eq('id', counselor.id)
      if (error) { showToast(`保存失敗：${describeError(error)}`); setSaveStatus('dirty'); return }
      setSaveStatus('saved')
    }, 1500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counselor])

  const handleReelToggle = async (enabled: boolean) => {
    if (!counselor) return
    setReelEnabled(enabled)
    const supabase = createClient()
    const { error } = await supabase.from('counselors').update({ reel_enabled: enabled }).eq('id', counselor.id)
    if (error) {
      setReelEnabled(!enabled)
      showToast(`保存失敗：${describeError(error)}`)
      return
    }
    showToast(enabled ? 'リールを公開しました' : 'リールを非公開にしました')
  }

  const captionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleCaptionSave = useCallback((mediaId: string, caption: string) => {
    setMediaList(prev => prev.map(m => m.id === mediaId ? { ...m, caption } : m))
    setSaveStatus('dirty')
    if (captionTimer.current) clearTimeout(captionTimer.current)
    captionTimer.current = setTimeout(async () => {
      const supabase = createClient()
      setSaveStatus('saving')
      const { error } = await supabase.from('counselor_media').update({ caption }).eq('id', mediaId)
      if (error) { showToast(`保存失敗：${describeError(error)}`); setSaveStatus('dirty'); return }
      setSaveStatus('saved')
    }, 1200)
  }, [])

  const handleUpload = async (file: File) => {
    if (!counselor) return
    setUploading(true)
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl
    await new Promise(res => { img.onload = res })
    const ratio = img.width / img.height
    URL.revokeObjectURL(objectUrl)

    if (ratio > 0.7) {
      const ok = window.confirm('縦長（9:16）の画像が推奨です。このまま使いますか？')
      if (!ok) { setUploading(false); return }
    }

    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${counselor.id}/${crypto.randomUUID()}.${ext}`
    const { data: uploaded, error } = await supabase.storage.from('counselor-media').upload(path, file)

    if (error || !uploaded) {
      showToast(`アップロード失敗：${describeError(error)}`)
      setUploading(false); return
    }

    const { data: { publicUrl } } = supabase.storage.from('counselor-media').getPublicUrl(uploaded.path)
    const nextOrder = mediaList.length

    const { data: inserted, error: insErr } = await supabase.from('counselor_media').insert({
      counselor_id: counselor.id,
      media_url: publicUrl,
      display_order: nextOrder,
      media_type: 'image',
      caption: null,
    }).select().maybeSingle()

    if (insErr) { showToast(`保存失敗：${describeError(insErr)}`); setUploading(false); return }
    if (inserted) {
      setMediaList(prev => [...prev, inserted as CounselorMedia])
      setSelectedId((inserted as CounselorMedia).id)
    }
    setUploading(false)
    showToast('画像を追加しました')
  }

  const handleReorder = async (newOrder: CounselorMedia[]) => {
    setMediaList(newOrder)
    const supabase = createClient()
    await Promise.all(
      newOrder.map(item =>
        supabase.from('counselor_media').update({ display_order: item.display_order }).eq('id', item.id)
      )
    )
  }

  const handleDelete = (id: string) => setConfirmDelete(id)

  const confirmDoDelete = async () => {
    if (!confirmDelete) return
    const target = mediaList.find(m => m.id === confirmDelete)
    if (!target) return

    const supabase = createClient()
    const urlParts = target.media_url.split('/counselor-media/')
    if (urlParts[1]) {
      await supabase.storage.from('counselor-media').remove([decodeURIComponent(urlParts[1])])
    }
    await supabase.from('counselor_media').delete().eq('id', confirmDelete)

    const remaining = mediaList
      .filter(m => m.id !== confirmDelete)
      .map((m, i) => ({ ...m, display_order: i }))
    setMediaList(remaining)
    if (selectedId === confirmDelete) setSelectedId(remaining[0]?.id ?? null)
    setConfirmDelete(null)
    showToast('画像を削除しました')
  }

  const handleOpenPublic = () => {
    if (!counselor) return
    window.open(`https://kinda.futarive.jp/counselors/${counselor.id}`, '_blank')
  }

  const handlePublish = async () => {
    if (!counselor) return
    setPublishing(true)
    if (!reelEnabled) {
      const supabase = createClient()
      const { error } = await supabase.from('counselors').update({ reel_enabled: true }).eq('id', counselor.id)
      if (error) {
        showToast(`公開失敗：${describeError(error)}`)
        setPublishing(false); return
      }
      setReelEnabled(true)
      showToast('リールを公開しました')
    } else {
      showToast('変更は既に反映されています')
    }
    setPublishing(false)
  }

  const selectedMedia = mediaList.find(m => m.id === selectedId) ?? null
  const selectedIndex = selectedMedia ? mediaList.findIndex(m => m.id === selectedMedia.id) : 0

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

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
    <div style={{ padding: '24px 20px', paddingBottom: 140, maxWidth: 720, margin: '0 auto' }}>
      {/* ヒーロー */}
      <div className="reel-hero-eyebrow">REEL</div>
      <h1 className="reel-hero-title">あなたのリール</h1>
      <p className="reel-hero-sub">
        Kinda talk のカウンセラー一覧で、利用者が最初に出会う「あなたの印象」です。<br/>
        3〜5枚で、普段の空気が伝わる順に並べるのがおすすめ。
      </p>

      {/* キャッチコピー */}
      <CatchphraseField value={catchphrase} onChange={handleCatchphraseChange} />

      {/* リール画像 */}
      <div className="reel-section">
        <h2 className="reel-section-title">リール画像</h2>
        <p className="reel-section-desc">
          1枚目に顔、2枚目に相談所の様子、3枚目以降に人柄が伝わる写真を。<br/>
          ドラッグで順番を入れ替えられます。
        </p>
        <ReelImageGrid
          items={mediaList}
          selectedId={selectedId}
          onSelect={id => { setSelectedId(id); setPreviewIndex(mediaList.findIndex(m => m.id === id)) }}
          onReorder={handleReorder}
          onDelete={handleDelete}
          onUpload={handleUpload}
          uploading={uploading}
        />
        {selectedMedia && (
          <CaptionEditor
            selected={selectedMedia}
            selectedIndex={selectedIndex}
            onSave={handleCaptionSave}
          />
        )}
      </div>

      {/* ことば */}
      <div className="reel-section">
        <h2 className="reel-section-title">ことば</h2>
        <p className="reel-section-desc">
          詳細ページとリールの最後に表示される、あなたの言葉。
        </p>
        <div className="cap-card" style={{ marginTop: 0 }}>
          <div className="cap-head">
            <span className="cap-head-label">大事にしていること・座右の銘</span>
            <span className="cap-optional">任意</span>
          </div>
          <textarea
            className="cap-textarea"
            value={bio}
            onChange={e => handleBioChange(e.target.value)}
            placeholder="急がせないことを、いちばん大切にしています。"
            style={{ minHeight: 80 }}
          />
        </div>
      </div>

      {/* 公開設定 */}
      <div className="reel-section">
        <h2 className="reel-section-title">公開設定</h2>
        <p style={{ fontFamily: 'Noto Sans JP, sans-serif', fontSize: 13, color: 'var(--text-deep)', marginBottom: 4 }}>
          リールを Kinda talk で公開する
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 14 }}>
          OFFの場合、プロフィールは表示されますがリールは非表示になります
        </p>
        <label className="kc-toggle">
          <input type="checkbox" checked={reelEnabled} onChange={e => handleReelToggle(e.target.checked)} />
          <span className="kc-toggle-slider" />
        </label>
      </div>

      {/* PREVIEW */}
      <p className="preview-eyebrow">PREVIEW</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PhonePreview
          catchphrase={catchphrase}
          mediaList={mediaList}
          selectedIndex={previewIndex}
          onSelectIndex={i => { setPreviewIndex(i); setSelectedId(mediaList[i]?.id ?? null) }}
          counselorId={counselor.id}
          counselorName={counselor.name}
          agencyName={agency?.name ?? ''}
          reviews={reviews}
        />
      </div>
      <p className="preview-help">
        実際の表示イメージです。<br/>
        スワイプで次の画像に切り替わります。
      </p>

      {/* 固定ボトム保存バー */}
      <div className="reel-savebar">
        <div className="reel-savebar-inner">
          <div className="reel-savebar-status">
            <span className={`reel-savebar-dot${reelEnabled ? '' : ' off'}`} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {saveStatus === 'saving' ? '保存中…'
                : saveStatus === 'dirty' ? '未保存の変更あり'
                : `自動保存済み・${reelEnabled ? '公開中' : '非公開'}`}
            </span>
          </div>
          <div className="reel-savebar-actions">
            <button className="reel-savebar-btn ghost" onClick={handleOpenPublic}>
              実機で確認
            </button>
            <button className="reel-savebar-btn primary" onClick={handlePublish} disabled={publishing}>
              {publishing ? '公開中…' : reelEnabled ? '変更を公開' : 'リールを公開'}
            </button>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {confirmDelete && (
        <div className="kc-overlay">
          <div className="kc-modal" style={{ maxWidth: 340 }}>
            <h2 className="kc-modal-title">画像を削除しますか？</h2>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 20 }}>
              この操作は取り消せません。Storage からも完全に削除されます。
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setConfirmDelete(null)}>キャンセル</button>
              <button className="kc-btn kc-btn-danger" onClick={confirmDoDelete}>削除する</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}
