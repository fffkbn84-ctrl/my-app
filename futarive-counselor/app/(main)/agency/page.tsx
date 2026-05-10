'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'
import type { Agency, FeeItem } from '@/lib/types'

// 「新店舗」バッジが表示される期間（創業から）
const NEW_SHOP_DAYS = 365

// 標準料金プランのテンプレート
const STANDARD_FEES: FeeItem[] = [
  { label: '入会金', amount: 0, note: null },
  { label: '月会費', amount: 0, note: null },
  { label: '成婚料', amount: 0, note: null },
]

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved')
  const [toast, setToast] = useState('')
  const [savedOnce, setSavedOnce] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    website_url: '',
    business_hours_text: '',
    consultation_start_time: '10:00',
    consultation_end_time: '19:00',
    closed_weekdays: [] as number[],
    default_slot_minutes: 60,
    phone: '',
    email: '',
    cancel_deadline_hours: 24,
    cancel_policy: '',
    fees: [] as FeeItem[],
    campaign_text: '',
    campaign_expires_at: '',  // ISO 文字列、未設定なら ''
    founded_at: '',           // 'YYYY-MM-DD'、未設定なら ''
  })

  const formRef = useRef(form)
  const selectedIdRef = useRef(selectedId)
  useEffect(() => { formRef.current = form }, [form])
  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])

  const syncFromAgency = (ag: Agency) => {
    setForm({
      name: ag.name ?? '',
      description: ag.description ?? '',
      website_url: ag.website_url ?? '',
      business_hours_text: ag.business_hours_text ?? '',
      consultation_start_time: (ag.consultation_start_time ?? '10:00').slice(0, 5),
      consultation_end_time: (ag.consultation_end_time ?? '19:00').slice(0, 5),
      closed_weekdays: ag.closed_weekdays ?? [],
      default_slot_minutes: ag.default_slot_minutes ?? 60,
      phone: ag.phone ?? '',
      email: ag.email ?? '',
      cancel_deadline_hours: ag.cancel_deadline_hours ?? 24,
      cancel_policy: ag.cancel_policy ?? '',
      fees: Array.isArray(ag.fees) ? ag.fees : [],
      campaign_text: ag.campaign_text ?? '',
      // datetime-local の input value 用に "YYYY-MM-DDTHH:mm" に変換
      campaign_expires_at: ag.campaign_expires_at
        ? new Date(ag.campaign_expires_at).toISOString().slice(0, 16)
        : '',
      founded_at: ag.founded_at ?? '',
    })
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('agencies').select('*').eq('owner_user_id', user.id).order('created_at')
      const list = (data as Agency[]) ?? []
      setAgencies(list)
      if (list[0]) {
        setSelectedId(list[0].id)
        syncFromAgency(list[0])
        setSavedOnce(true)
      }
      setLoading(false)
      // 次tickでhydratedを立てる（初期セットで自動保存が走らないように）
      setTimeout(() => setHydrated(true), 50)
    }
    load()
  }, [])

  // 自動保存：form変更を2秒デバウンスで保存
  useEffect(() => {
    if (!hydrated || !selectedId) return
    setSaveStatus('dirty')
    const t = setTimeout(() => { void save() }, 2000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, hydrated, selectedId])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const save = async (): Promise<boolean> => {
    const id = selectedIdRef.current
    if (!id) return false
    const f = formRef.current
    if (f.consultation_start_time >= f.consultation_end_time) {
      showToast('面談可能時間：終了は開始より後にしてください')
      setSaveStatus('dirty')
      return false
    }
    setSaveStatus('saving')
    const supabase = createClient()
    const payload = {
      name: f.name,
      description: f.description || null,
      website_url: f.website_url || null,
      business_hours_text: f.business_hours_text || null,
      consultation_start_time: f.consultation_start_time || null,
      consultation_end_time: f.consultation_end_time || null,
      closed_weekdays: f.closed_weekdays.length > 0 ? f.closed_weekdays : null,
      default_slot_minutes: f.default_slot_minutes || null,
      phone: f.phone || null,
      email: f.email || null,
      cancel_deadline_hours: typeof f.cancel_deadline_hours === 'number' ? f.cancel_deadline_hours : null,
      cancel_policy: f.cancel_policy || null,
      fees: f.fees,
      campaign_text: f.campaign_text || null,
      campaign_expires_at: f.campaign_expires_at
        ? new Date(f.campaign_expires_at).toISOString()
        : null,
      founded_at: f.founded_at || null,
    }
    const { error } = await supabase.from('agencies').update(payload).eq('id', id)
    if (error) {
      console.error('[agency save] error', error)
      showToast(`保存失敗：${describeError(error)}`)
      setSaveStatus('dirty')
      return false
    }
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...payload } : a))
    setSaveStatus('saved')
    setSavedOnce(true)
    return true
  }

  const handleCreate = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('agencies').insert({
      name: '新しい相談所',
      description: null,
      website_url: null,
      owner_user_id: user.id,
    }).select().maybeSingle()
    if (error) {
      console.error('[agency create] error', error)
      showToast(`作成失敗：${describeError(error)}`)
      return
    }
    if (data) {
      const newAg = data as Agency
      setAgencies(prev => [...prev, newAg])
      setSelectedId(newAg.id)
      syncFromAgency(newAg)
      showToast('相談所を追加しました')
    }
  }

  const handleSelectChange = (id: string) => {
    setSelectedId(id)
    const ag = agencies.find(a => a.id === id)
    if (ag) syncFromAgency(ag)
  }

  const handleManualSave = async () => {
    const ok = await save()
    if (ok) showToast('保存しました')
  }

  const update = (key: keyof typeof form, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // 料金プラン操作
  const addStandardFees = () => {
    setForm(prev => ({ ...prev, fees: STANDARD_FEES.map(f => ({ ...f })) }))
  }
  const addCustomFee = () => {
    setForm(prev => ({ ...prev, fees: [...prev.fees, { label: '', amount: 0, note: null }] }))
  }
  const updateFee = (idx: number, key: keyof FeeItem, value: string | number | null) => {
    setForm(prev => ({
      ...prev,
      fees: prev.fees.map((f, i) => i === idx ? { ...f, [key]: value } : f),
    }))
  }
  const removeFee = (idx: number) => {
    setForm(prev => ({ ...prev, fees: prev.fees.filter((_, i) => i !== idx) }))
  }

  // 「新店舗」バッジ表示状況（founded_at ベース）
  const newShopInfo = (() => {
    if (!form.founded_at) return null
    const founded = new Date(form.founded_at + 'T00:00:00')
    if (isNaN(founded.getTime())) return null
    const expires = new Date(founded.getTime() + NEW_SHOP_DAYS * 24 * 60 * 60 * 1000)
    const now = new Date()
    const foundedLabel = `${founded.getFullYear()}年${founded.getMonth() + 1}月${founded.getDate()}日`
    if (now >= expires) return { active: false, daysLeft: 0, foundedLabel }
    const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return { active: true, daysLeft, foundedLabel }
  })()

  // キャンペーンの状態
  const campaignStatus: 'none' | 'active' | 'expired' = !form.campaign_text
    ? 'none'
    : form.campaign_expires_at && new Date(form.campaign_expires_at) <= new Date()
      ? 'expired'
      : 'active'

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

  if (agencies.length === 0) {
    return (
      <div style={{ padding: '28px 24px', maxWidth: 680 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>AGENCY</div>
        <h1 className="page-title" style={{ marginBottom: 24 }}>相談所プロフィール</h1>
        <div className="kc-card" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16, lineHeight: 1.7 }}>
            まだ相談所が登録されていません。<br/>
            最初の相談所を作成してプロフィールを整えましょう。
          </p>
          <button className="kc-btn kc-btn-primary" onClick={handleCreate}>相談所を作成する</button>
        </div>
        {toast && <div className="kc-toast">{toast}</div>}
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 24px', maxWidth: 680, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>AGENCY</div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>相談所プロフィール</h1>

      {/* 保存完了後の次ステップ案内 */}
      {savedOnce && saveStatus === 'saved' && (
        <div className="kc-card" style={{
          padding: 18, marginBottom: 24,
          background: 'var(--accent-pale)',
          border: '1px solid var(--accent-dim)',
          borderRadius: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Shippori Mincho, serif', fontWeight: 600, fontSize: 14, color: 'var(--text-deep)', marginBottom: 4 }}>
                相談所プロフィールを保存しました
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 12 }}>
                続いて、あなた自身のカウンセラープロフィールを作成しましょう。<br/>
                お客様に見ていただく担当者情報を整えます。
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/profile" className="kc-btn kc-btn-primary kc-btn-sm" style={{ textDecoration: 'none' }}>
                  カウンセラープロフィールを作成する
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/dashboard" className="kc-btn kc-btn-ghost kc-btn-sm" style={{ textDecoration: 'none' }}>
                  ダッシュボードへ
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {agencies.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <label className="kc-label">編集対象の相談所</label>
          <select className="kc-select" value={selectedId} onChange={e => handleSelectChange(e.target.value)}>
            {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label className="kc-label">相談所名 <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input className="kc-input" value={form.name} onChange={e => update('name', e.target.value)} placeholder="ブライダルハウス東京" />
        </div>
        <div>
          <label className="kc-label">紹介文</label>
          <textarea className="kc-textarea" style={{ minHeight: 140 }} value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="当相談所は、おひとりおひとりに寄り添ったサポートを心がけています..." />
        </div>
        <div>
          <label className="kc-label">WebサイトURL</label>
          <input className="kc-input" type="url" value={form.website_url}
            onChange={e => update('website_url', e.target.value)}
            placeholder="https://example.com" />
        </div>

        {/* 創業日（手入力） */}
        <div>
          <label className="kc-label">創業日</label>
          <input
            className="kc-input"
            type="date"
            value={form.founded_at}
            onChange={e => update('founded_at', e.target.value)}
            style={{ maxWidth: 200 }}
          />
          {newShopInfo ? (
            <div style={{
              marginTop: 8,
              padding: '10px 12px',
              background: newShopInfo.active ? 'var(--accent-pale)' : 'var(--bg-elev)',
              border: `1px solid ${newShopInfo.active ? 'var(--accent-dim)' : 'var(--border)'}`,
              borderRadius: 10,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M2 14V5l6-3 6 3v9M5 14V9h6v5" stroke={newShopInfo.active ? 'var(--accent-deep)' : 'var(--text-mid)'} strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              <div style={{ flex: 1, fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                {newShopInfo.active ? (
                  <>
                    お客様向けページに <strong style={{ color: 'var(--accent-deep)' }}>「新店舗」バッジ</strong> が
                    自動表示されます（あと <strong>{newShopInfo.daysLeft}</strong> 日間）。
                  </>
                ) : (
                  <>「新店舗」バッジの表示期間（創業から1年）は終了しています。</>
                )}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
              創業日を入力すると、お客様向けページに「新店舗」バッジが自動表示されます（創業から1年間）。
            </p>
          )}
        </div>



        {/* 営業時間（自由記述） */}
        <div>
          <label className="kc-label">営業時間（自由記述）</label>
          <textarea
            className="kc-textarea"
            style={{ minHeight: 70 }}
            value={form.business_hours_text}
            onChange={e => update('business_hours_text', e.target.value)}
            placeholder="例：平日 10:00〜19:00 / 土日 10:00〜18:00"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            お客様向けに表示される営業時間の説明文です。
          </p>
        </div>

        {/* 面談可能時間 */}
        <div>
          <label className="kc-label">面談可能時間</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <input
              className="kc-input"
              type="time"
              step={1800}
              value={form.consultation_start_time}
              onChange={e => update('consultation_start_time', e.target.value)}
              style={{ maxWidth: 130 }}
            />
            <span style={{ color: 'var(--text-mid)' }}>〜</span>
            <input
              className="kc-input"
              type="time"
              step={1800}
              value={form.consultation_end_time}
              onChange={e => update('consultation_end_time', e.target.value)}
              style={{ maxWidth: 130 }}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            予約枠カレンダーの時刻ピッカーがこの範囲に絞られます。
          </p>
        </div>

        {/* 定休日 */}
        <div>
          <label className="kc-label">定休日</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { v: 0, label: '日', danger: true },
              { v: 1, label: '月' },
              { v: 2, label: '火' },
              { v: 3, label: '水' },
              { v: 4, label: '木' },
              { v: 5, label: '金' },
              { v: 6, label: '土', accent: true },
            ].map(d => {
              const checked = form.closed_weekdays.includes(d.v)
              return (
                <button
                  key={d.v}
                  type="button"
                  onClick={() => {
                    const next = checked
                      ? form.closed_weekdays.filter(w => w !== d.v)
                      : [...form.closed_weekdays, d.v].sort()
                    update('closed_weekdays', next)
                  }}
                  style={{
                    width: 38, height: 38,
                    borderRadius: 999,
                    border: '1px solid ' + (checked ? 'var(--accent)' : 'var(--border)'),
                    background: checked ? 'var(--accent)' : 'transparent',
                    color: checked ? '#1A130A' : (d.danger ? 'var(--danger)' : d.accent ? 'var(--accent)' : 'var(--text)'),
                    fontFamily: 'Noto Sans JP, sans-serif',
                    fontWeight: 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'background .15s, border-color .15s',
                  }}
                  aria-pressed={checked}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            選択した曜日は予約枠カレンダーで「定休日」として表示されます。
          </p>
        </div>

        {/* 1枠あたりの所要時間 */}
        <div>
          <label className="kc-label">面談1枠の所要時間</label>
          <select
            className="kc-select"
            style={{ maxWidth: 200 }}
            value={String(form.default_slot_minutes)}
            onChange={e => update('default_slot_minutes', Number(e.target.value))}
          >
            <option value="30">30分</option>
            <option value="45">45分</option>
            <option value="60">60分（1時間）</option>
            <option value="75">75分</option>
            <option value="90">90分（1.5時間）</option>
            <option value="120">120分（2時間）</option>
          </select>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            予約枠の自動生成と「枠を追加」の終了時刻のデフォルトに使われます。
          </p>
        </div>

        {/* 料金プランセクション区切り */}
        <div style={{
          marginTop: 8,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>FEES</div>
          <h2 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--text-deep)',
            marginBottom: 10,
          }}>
            料金プラン
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
            お客様の相談所詳細ページに表示される料金一覧です。<br/>
            入会金・月会費・成婚料の標準プランに加え、独自の料金（例：デート同行サポート）も自由に追加できます。
          </p>
          <div style={{
            marginTop: 10,
            padding: '8px 12px',
            background: 'var(--accent-pale)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 8,
            fontSize: 11,
            color: 'var(--text-deep)',
            lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--accent-deep)' }}>金額は税込で入力してください。</strong>
            お客様向けページには「¥XX,XXX（税込）」と表示されます。
          </div>
        </div>

        {/* 料金プラン本体 */}
        <div>
          {form.fees.length === 0 ? (
            <div style={{
              padding: '16px 14px',
              background: 'var(--bg-elev)',
              border: '1px dashed var(--border)',
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 12, lineHeight: 1.7 }}>
                料金プランがまだ登録されていません。
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="kc-btn kc-btn-primary kc-btn-sm" onClick={addStandardFees}>
                  標準プランを追加（入会金 / 月会費 / 成婚料）
                </button>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={addCustomFee}>
                  + カスタム料金を追加
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {form.fees.map((fee, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: 'var(--bg-elev)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    display: 'grid',
                    gridTemplateColumns: '1fr 130px auto',
                    gap: 8,
                    alignItems: 'start',
                  }}>
                    <div style={{ gridColumn: 'span 3' }}>
                      <input
                        className="kc-input"
                        value={fee.label}
                        onChange={e => updateFee(idx, 'label', e.target.value)}
                        placeholder="例：入会金 / デート同行サポート"
                        style={{ fontSize: 13, fontWeight: 500 }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>¥</span>
                      <input
                        className="kc-input"
                        type="number"
                        min={0}
                        value={fee.amount}
                        onChange={e => updateFee(idx, 'amount', e.target.value === '' ? 0 : Number(e.target.value))}
                        placeholder="100000"
                        style={{ fontFamily: 'DM Sans, sans-serif', textAlign: 'right' }}
                      />
                      <span style={{ fontSize: 10, color: 'var(--text-light)', whiteSpace: 'nowrap' }}>（込）</span>
                    </div>
                    <input
                      className="kc-input"
                      value={fee.note ?? ''}
                      onChange={e => updateFee(idx, 'note', e.target.value || null)}
                      placeholder="補足（任意）"
                      style={{ fontSize: 12 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFee(idx)}
                      aria-label="削除"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-light)',
                        cursor: 'pointer',
                        padding: 4,
                        alignSelf: 'center',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3h10M5 3V2h4v1M4 3v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={addCustomFee}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  料金を追加
                </button>
              </div>
            </>
          )}
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.7 }}>
            ¥0 と入力した項目は「無料」と表示されます。補足には「初回のみ」「ご希望者のみ」など短い説明を入れてください。
          </p>
        </div>

        {/* キャンペーンセクション区切り */}
        <div style={{
          marginTop: 8,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>CAMPAIGN</div>
          <h2 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--text-deep)',
            marginBottom: 10,
          }}>
            キャンペーン
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
            お客様の相談所詳細ページの目立つ位置に1件だけ表示されます。<br/>
            有効期限を過ぎたキャンペーンは自動的に非表示になります。
          </p>
        </div>

        {/* キャンペーン本文 */}
        <div>
          <label className="kc-label">キャンペーン本文</label>
          <textarea
            className="kc-textarea"
            style={{ minHeight: 60 }}
            value={form.campaign_text}
            onChange={e => update('campaign_text', e.target.value)}
            placeholder="例：5/31までの入会で入会金0円!"
          />
        </div>

        {/* キャンペーン有効期限 */}
        <div>
          <label className="kc-label">有効期限（任意）</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <input
              className="kc-input"
              type="datetime-local"
              value={form.campaign_expires_at}
              onChange={e => update('campaign_expires_at', e.target.value)}
              style={{ maxWidth: 260 }}
            />
            {form.campaign_expires_at && (
              <button
                type="button"
                className="kc-btn kc-btn-ghost kc-btn-sm"
                onClick={() => update('campaign_expires_at', '')}
              >
                期限を解除
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.7 }}>
            {form.campaign_text ? (
              campaignStatus === 'active' ? (
                <span style={{ color: 'var(--success)' }}>
                  ✓ 表示中
                  {form.campaign_expires_at && (
                    <> — {new Date(form.campaign_expires_at).toLocaleDateString('ja-JP')} まで</>
                  )}
                </span>
              ) : campaignStatus === 'expired' ? (
                <span style={{ color: 'var(--danger)' }}>
                  ⚠ 期限切れ — お客様には表示されていません。期限を延長するか、本文を更新してください。
                </span>
              ) : null
            ) : (
              <>キャンペーン本文を入力すると表示されます。期限を空欄にすると無期限表示になります。</>
            )}
          </p>
        </div>

        {/* キャンセル・連絡先セクション区切り */}
        <div style={{
          marginTop: 8,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>CANCELLATION &amp; CONTACT</div>
          <h2 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--text-deep)',
            marginBottom: 10,
          }}>
            キャンセル・連絡先設定
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
            キャンセル期限を過ぎた予約のキャンセル依頼が来た場合、お客様の予約履歴ページに
            ここで設定した連絡先（電話・メール）が表示されます。
          </p>
        </div>

        {/* キャンセル期限 */}
        <div>
          <label className="kc-label">キャンセル可能期限</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>面談日時の</span>
            <input
              className="kc-input"
              type="number"
              min={0}
              max={168}
              value={form.cancel_deadline_hours}
              onChange={e => update('cancel_deadline_hours', e.target.value === '' ? 0 : Number(e.target.value))}
              style={{ maxWidth: 100 }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>時間前まで</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            例：24 → 面談日の前日同時刻まで／0 → 当日キャンセル可。期限を過ぎたらお客様には電話・メール案内のみ。
          </p>
        </div>

        {/* キャンセルポリシー本文 */}
        <div>
          <label className="kc-label">キャンセルポリシー（自由記述）</label>
          <textarea
            className="kc-textarea"
            style={{ minHeight: 80 }}
            value={form.cancel_policy}
            onChange={e => update('cancel_policy', e.target.value)}
            placeholder="例：面談日の前日23:59までキャンセル無料。当日キャンセルも初回のみ可。"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            お客様の予約フローと予約履歴ページに表示されます。空欄ならデフォルト文言が使われます。
          </p>
        </div>

        {/* 電話 */}
        <div>
          <label className="kc-label">電話番号</label>
          <input
            className="kc-input"
            type="tel"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="03-1234-5678"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            キャンセル期限後の連絡先としてお客様に表示されます。営業電話には使われません。
          </p>
        </div>

        {/* メール */}
        <div>
          <label className="kc-label">連絡先メールアドレス</label>
          <input
            className="kc-input"
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="info@example.com"
          />
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
            キャンセル依頼の連絡先として表示されます。
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12, flexWrap: 'wrap' }}>
        <button className="kc-btn kc-btn-ghost" onClick={handleCreate}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          別の相談所を追加
        </button>
        <button className="kc-btn kc-btn-primary" onClick={handleManualSave} disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? '保存中...' : '保存する'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14 }}>
        {saveStatus === 'saved' && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ 自動保存済み</span>}
        {saveStatus === 'dirty' && <span style={{ fontSize: 11, color: 'var(--warning)' }}>未保存の変更があります</span>}
        {saveStatus === 'saving' && <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>保存中...</span>}
      </div>

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}
