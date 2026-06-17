import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://kinda.jp'

type NotifyEvent = 'cancel' | 'reschedule_request' | 'reschedule_approve'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function fmtJst(iso: string | null): string {
  if (!iso) return '日時未定'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '日時未定'
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

type ResvRow = {
  id: string
  user_name: string | null
  user_email: string | null
  counselor_name: string | null
  agency_name: string | null
  start_at: string | null
  reschedule_proposed_start: string | null
}

function wrap(inner: string): string {
  return `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">${inner}<p style="font-size:12px;color:#9a9088;margin-top:20px;">Kinda ふたりへ</p></div>`
}
function ctaButton(): string {
  return `<p style="margin:24px 0;"><a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4A090;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;">マイページで確認する</a></p>`
}

/**
 * 相談所（カウンセラー）がキャンセル / 日程変更 提案・承認 をしたときに、会員（ユーザー）へ通知する。
 * - 相談所アプリの client から、操作成功後に best-effort で叩かれる。
 * - 認可：ログイン中の相談所が RLS で読める予約だけ送信できる（他社の予約は読めない＝送れない）。
 */
export async function POST(req: Request) {
  let body: { reservationId?: string; event?: NotifyEvent }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }
  const reservationId = (body.reservationId ?? '').trim()
  const event = body.event
  if (!reservationId || !event) {
    return NextResponse.json({ ok: false, error: 'missing_params' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'not_authenticated' }, { status: 401 })
  }

  // RLS スコープで読む＝自社の予約のときだけ行が返る（他社の予約 ID では null）
  const { data: resvRow } = await supabase
    .from('reservations')
    .select('id, user_name, user_email, counselor_name, agency_name, start_at, reschedule_proposed_start')
    .eq('id', reservationId)
    .maybeSingle()
  const r = resvRow as unknown as ResvRow | null
  if (!r) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }
  if (!r.user_email) {
    return NextResponse.json({ ok: true, skipped: 'no_user_email' })
  }

  const who = r.agency_name || r.counselor_name || '担当の相談所'
  const greeting = r.user_name ? `${escapeHtml(r.user_name)} 様` : 'こんにちは'

  let subject: string
  let html: string
  if (event === 'cancel') {
    subject = 'ご予約がキャンセルされました｜Kinda ふたりへ'
    html = wrap(
      `<p>${greeting}</p>
       <p>${escapeHtml(who)} より、下記のご予約がキャンセルされました。詳しいメッセージはマイページでご確認いただけます。</p>
       <table style="font-size:14px;margin:8px 0;"><tr><td style="color:#8a7;padding-right:12px;">日時</td><td>${escapeHtml(fmtJst(r.start_at))}</td></tr></table>
       ${ctaButton()}`,
    )
  } else if (event === 'reschedule_request') {
    subject = '日程変更の提案が届きました｜Kinda ふたりへ'
    html = wrap(
      `<p>${greeting}</p>
       <p>${escapeHtml(who)} より、下記のご予約について日程変更の提案が届きました。マイページで候補日時をご確認のうえ、ご都合のよい日時をお選びください。</p>
       <table style="font-size:14px;margin:8px 0;">
         <tr><td style="color:#8a7;padding-right:12px;">現在の日時</td><td>${escapeHtml(fmtJst(r.start_at))}</td></tr>
         <tr><td style="color:#8a7;padding-right:12px;">提案日時</td><td>${escapeHtml(fmtJst(r.reschedule_proposed_start))} ほか</td></tr>
       </table>
       ${ctaButton()}`,
    )
  } else if (event === 'reschedule_approve') {
    subject = '日程変更が承認されました｜Kinda ふたりへ'
    html = wrap(
      `<p>${greeting}</p>
       <p>${escapeHtml(who)} があなたの日程変更を承認し、新しい日時でご予約が確定しました。</p>
       <table style="font-size:14px;margin:8px 0;"><tr><td style="color:#8a7;padding-right:12px;">確定した日時</td><td>${escapeHtml(fmtJst(r.reschedule_proposed_start))}</td></tr></table>
       ${ctaButton()}`,
    )
  } else {
    return NextResponse.json({ ok: false, error: 'unknown_event' }, { status: 400 })
  }

  const result = await sendEmail({ to: r.user_email, subject, html })
  return NextResponse.json({ ok: true, mail: result })
}
