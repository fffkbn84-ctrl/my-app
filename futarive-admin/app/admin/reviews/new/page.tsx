'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
interface AgencyRow { id: string; name: string }
interface CounselorRow { id: string; name: string; agency_id: string | null }

type Step = 1 | 2 | 3 | 4 | 5

interface FormData {
  agencyId: string
  counselorId: string
  counselorName: string
  reviewerAgeRange: string
  reviewerGender: string
  reviewerArea: string
  rating: number
  body: string
  source: string
  isPublished: boolean
}

const STEPS = ['相談所・担当者', '投稿者属性', '評価', '本文・ソース', '確認・公開']

function StarButton({ value, selected, onClick }: { value: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 52,
        height: 52,
        borderRadius: 10,
        border: `2px solid ${selected ? '#F59E0B' : 'var(--border)'}`,
        background: selected ? '#FEF3C7' : 'var(--surface)',
        color: selected ? '#F59E0B' : 'var(--muted)',
        fontSize: 24,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .15s',
      }}
    >
      ★
    </button>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function NewReviewPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [agencies, setAgencies] = useState<AgencyRow[]>([])
  const [counselors, setCounselors] = useState<CounselorRow[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [checks, setChecks] = useState([false, false, false])

  const [form, setForm] = useState<FormData>({
    agencyId: '',
    counselorId: '',
    counselorName: '',
    reviewerAgeRange: '30代',
    reviewerGender: '非公開',
    reviewerArea: '非公開',
    rating: 0,
    body: '',
    source: '相談所提供',
    isPublished: true,
  })

  useEffect(() => {
    createClient().from('agencies').select('*').order('name').then(({ data }) => setAgencies(data ?? []))
  }, [])

  useEffect(() => {
    if (form.agencyId) {
      createClient().from('counselors').select('*')
        .eq('agency_id', form.agencyId).order('name')
        .then(({ data }) => setCounselors(data ?? []))
    } else {
      setCounselors([])
    }
  }, [form.agencyId])

  const updateForm = (key: keyof FormData, value: string | number | boolean) => {
    setForm(f => ({ ...f, [key]: value }))
  }

  const canGoNext = () => {
    if (step === 1) return form.agencyId && form.counselorId
    if (step === 2) return true
    if (step === 3) return form.rating > 0
    if (step === 4) return form.body.length >= 50
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('reviews').insert({
      counselor_id: form.counselorId,
      rating: form.rating,
      body: form.body,
      source_type: 'proxy',
      is_published: form.isPublished,
      reviewer_age_range: form.reviewerAgeRange,
      reviewer_gender: form.reviewerGender,
      reviewer_area: form.reviewerArea,
      reservation_id: null,
    } as any)
    setSubmitting(false)
    if (!error) {
      setSuccess(true)
    } else {
      alert('エラーが発生しました: ' + error.message)
    }
  }

  const handleReset = () => {
    setStep(1)
    setSuccess(false)
    setChecks([false, false, false])
    setForm({
      agencyId: '',
      counselorId: '',
      counselorName: '',
      reviewerAgeRange: '30代',
      reviewerGender: '非公開',
      reviewerArea: '非公開',
      rating: 0,
      body: '',
      source: '相談所提供',
      isPublished: true,
    })
  }

  if (success) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <circle cx="32" cy="32" r="30" stroke="#A87C2A" strokeWidth="2"/>
            <path d="M20 32l8 8 16-16" stroke="#A87C2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
          {form.isPublished ? '口コミを公開しました' : '下書き保存しました'}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
          代理入力した口コミには「代理掲載」バッジが付与されています
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleReset} className="btn btn-primary">続けて入力する</button>
          <button onClick={() => router.push('/admin/reviews')} className="btn btn-ghost">一覧に戻る</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">新規代理入力</h1>
      </div>

      {/* Warning banner */}
      <div className="warning-banner">
        <strong>景品表示法（ステマ規制）への対応：</strong><br />
        代理入力した口コミには必ず「代理掲載」バッジが自動付与されます。<br />
        相談所から同意を得た内容のみ入力してください。
      </div>

      {/* Step bar */}
      <div className="step-bar">
        {STEPS.map((label, i) => {
          const n = i + 1
          const state = step > n ? 'done' : step === n ? 'active' : ''
          return (
            <div key={n} className={`step-item ${state}`}>
              <div className="step-circle">
                {step > n ? <CheckIcon /> : n}
              </div>
              <div className="step-label" style={{ fontSize: 10 }}>{label}</div>
            </div>
          )
        })}
      </div>

      <div className="card">
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>相談所・カウンセラー選択</h2>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">相談所 <span style={{ color: '#DC2626' }}>*</span></label>
              <select
                className="form-select"
                value={form.agencyId}
                onChange={e => { updateForm('agencyId', e.target.value); updateForm('counselorId', ''); updateForm('counselorName', '') }}
              >
                <option value="">選択してください</option>
                {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 4 }}>
              <label className="form-label">カウンセラー <span style={{ color: '#DC2626' }}>*</span></label>
              <select
                className="form-select"
                value={form.counselorId}
                onChange={e => {
                  const c = counselors.find(c => c.id === e.target.value)
                  updateForm('counselorId', e.target.value)
                  updateForm('counselorName', c?.name ?? '')
                }}
                disabled={!form.agencyId}
              >
                <option value="">選択してください</option>
                {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {!form.agencyId && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>先に相談所を選択してください</p>}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>投稿者属性</h2>
            <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label">年代</label>
                <select className="form-select" value={form.reviewerAgeRange} onChange={e => updateForm('reviewerAgeRange', e.target.value)}>
                  {['20代', '30代', '40代', '50代以上'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">性別</label>
                <select className="form-select" value={form.reviewerGender} onChange={e => updateForm('reviewerGender', e.target.value)}>
                  {['非公開', '女性', '男性'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">エリア</label>
                <select className="form-select" value={form.reviewerArea} onChange={e => updateForm('reviewerArea', e.target.value)}>
                  {['非公開', '東京', '神奈川', '埼玉', '千葉', '大阪', 'その他'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>評価</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>星をタップして評価を選択してください</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(v => (
                <StarButton key={v} value={v} selected={form.rating === v} onClick={() => updateForm('rating', v)} />
              ))}
            </div>
            {form.rating > 0 && (
              <div style={{ textAlign: 'center', color: '#F59E0B', fontSize: 28 }}>
                {'★'.repeat(form.rating)}{'☆'.repeat(5 - form.rating)}
                <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 8 }}>{form.rating} / 5</span>
              </div>
            )}
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>本文・元ソース</h2>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">
                口コミ本文 <span style={{ color: '#DC2626' }}>*</span>
                <span style={{ fontWeight: 400, marginLeft: 8, color: form.body.length < 50 ? '#DC2626' : 'var(--muted)' }}>
                  {form.body.length}文字（最低50文字）
                </span>
              </label>
              <textarea
                className="form-textarea"
                value={form.body}
                onChange={e => updateForm('body', e.target.value)}
                rows={6}
                placeholder="カウンセラーとの面談について、感想をご記入ください。"
              />
            </div>
            <div>
              <label className="form-label">元ソース（表示用メモ・DBに保存しません）</label>
              <select className="form-select" value={form.source} onChange={e => updateForm('source', e.target.value)}>
                {['相談所提供', 'Google口コミ（相談所より提供）', 'アンケート回答', 'その他'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>確認・公開</h2>

            {/* Preview */}
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16,
              background: 'var(--bg)',
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span className="badge badge-proxy">代理掲載</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {[form.reviewerAgeRange, form.reviewerGender, form.reviewerArea].filter(v => v !== '非公開').join(' / ') || '属性非公開'}
                </span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 6 }}>{form.counselorName}</div>
              <div style={{ color: '#F59E0B', marginBottom: 8 }}>{'★'.repeat(form.rating)}{'☆'.repeat(5 - form.rating)}</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--ink)' }}>{form.body}</p>
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>公開前チェックリスト</div>
              {[
                '相談所（または担当者）から提供について同意を得ている',
                '個人を特定できる情報は削除されている',
                '「代理掲載」バッジが付与されることを確認した',
              ].map((label, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={e => setChecks(c => c.map((v, j) => j === i ? e.target.checked : v))}
                    style={{ marginTop: 2, accentColor: 'var(--accent)', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Publish setting */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>掲載設定</div>
              {[
                { value: true, label: '今すぐ公開' },
                { value: false, label: '下書き保存' },
              ].map(opt => (
                <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={form.isPublished === opt.value}
                    onChange={() => updateForm('isPublished', opt.value)}
                    style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>{opt.label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 44 }}
              disabled={!checks.every(Boolean) || submitting}
            >
              {submitting ? <span className="spinner" style={{ width: 18, height: 18 }} /> : form.isPublished ? '公開する' : '下書き保存する'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setStep(s => Math.max(1, s - 1) as Step)}
            className="btn btn-ghost"
            disabled={step === 1}
          >
            前へ
          </button>
          {step < 5 && (
            <button
              onClick={() => setStep(s => Math.min(5, s + 1) as Step)}
              className="btn btn-primary"
              disabled={!canGoNext()}
            >
              次へ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
