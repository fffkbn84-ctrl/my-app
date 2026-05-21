// futarive-admin/app/api/webhooks/billing-disputed/route.ts
//
// Supabase Database Webhook が billing_events の UPDATE を検知して
// status='disputed' に遷移したときに POST してくる Route Handler。
// 受け取ったら関連情報を解決して運営宛にメール通知する。
//
// 必要な環境変数:
//   - RESEND_API_KEY              （Resend API キー）
//   - ADMIN_NOTIFY_EMAIL          （通知先メールアドレス）
//   - NEXT_PUBLIC_SUPABASE_URL    （関連テーブル取得用）
//   - SUPABASE_SERVICE_ROLE_KEY   （RLS をバイパスして billing_events 関連を取得する）
//   - SUPABASE_WEBHOOK_SECRET     （Supabase Webhook の Authorization ヘッダーで照合）
//
// セキュリティ:
//   Authorization: Bearer <SUPABASE_WEBHOOK_SECRET> が一致しないリクエストは拒否

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

type BillingEventRow = {
  id: string
  reservation_id: string
  agency_id: string
  counselor_id: string | null
  amount_jpy: number
  status: 'pending' | 'confirmed' | 'voided' | 'disputed'
  dispute_note: string | null
  dispute_at: string | null
  created_at: string
}

type SupabaseWebhookPayload = {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: BillingEventRow | null
  old_record: BillingEventRow | null
}

export async function POST(req: NextRequest) {
  // 1. シークレット検証
  const authHeader = req.headers.get('authorization')
  if (!WEBHOOK_SECRET) {
    console.error('[webhook/billing-disputed] SUPABASE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'server misconfigured' }, { status: 500 })
  }
  if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 2. payload を読む
  const payload = (await req.json()) as SupabaseWebhookPayload

  // 3. 対象イベントか判定（billing_events の UPDATE で disputed への遷移のみ）
  if (
    payload.table !== 'billing_events' ||
    payload.type !== 'UPDATE' ||
    payload.record?.status !== 'disputed' ||
    payload.old_record?.status === 'disputed'
  ) {
    return NextResponse.json({ skipped: true, reason: 'not_a_dispute_transition' })
  }

  const event = payload.record
  if (!event) {
    return NextResponse.json({ skipped: true, reason: 'no_record' })
  }

  // 4. 関連テーブルから詳細を取得（service_role で RLS をバイパス）
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('[webhook/billing-disputed] Supabase env missing')
    return NextResponse.json({ error: 'server misconfigured' }, { status: 500 })
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const [agencyRes, counselorRes, reservationRes] = await Promise.all([
    supabase.from('agencies').select('name').eq('id', event.agency_id).maybeSingle(),
    event.counselor_id
      ? supabase.from('counselors').select('name').eq('id', event.counselor_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('reservations')
      .select('user_name, start_at, created_at, notes, agency_message, agency_message_at')
      .eq('id', event.reservation_id).maybeSingle(),
  ])

  const agencyName = (agencyRes.data as { name?: string } | null)?.name ?? '—'
  const counselorName = (counselorRes.data as { name?: string } | null)?.name ?? '（指名なし）'
  const reservation = reservationRes.data as {
    user_name?: string
    start_at?: string
    created_at?: string
    notes?: string | null
    agency_message?: string | null
    agency_message_at?: string | null
  } | null

  const userName = reservation?.user_name ?? '—'
  const startAt = reservation?.start_at
  const reservationAt = startAt ? new Date(startAt).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
  const bookedAt = reservation?.created_at
    ? new Date(reservation.created_at).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
  const disputedAt = event.dispute_at
    ? new Date(event.dispute_at).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
  const userNote = reservation?.notes ?? null
  const agencyMessage = reservation?.agency_message ?? null
  const agencyMessageAt = reservation?.agency_message_at
    ? new Date(reservation.agency_message_at).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }) : null

  // 5. メール送信
  if (!ADMIN_NOTIFY_EMAIL) {
    return NextResponse.json({ skipped: true, reason: 'no_notify_email' })
  }

  const adminBillingUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/admin/billing`
    : 'https://futarive-admin-fffkbn84-4095s-projects.vercel.app/admin/billing'

  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const userNoteBlock = userNote
    ? `<h3 style="font-size: 14px; color: #1A1612; margin-top: 24px;">利用者からの事前メッセージ</h3>
       <div style="background: #FDF8F0; padding: 14px 16px; border-radius: 8px; border-left: 3px solid #C8A97A; font-size: 13px; line-height: 1.7; white-space: pre-wrap;">${escape(userNote)}</div>`
    : ''

  const agencyMessageBlock = agencyMessage
    ? `<h3 style="font-size: 14px; color: #1A1612; margin-top: 24px;">相談所からの最後のメッセージ${agencyMessageAt ? `（${agencyMessageAt}）` : ''}</h3>
       <div style="background: #F0F4F8; padding: 14px 16px; border-radius: 8px; border-left: 3px solid #6B8FBF; font-size: 13px; line-height: 1.7; white-space: pre-wrap;">${escape(agencyMessage)}</div>`
    : `<p style="font-size: 12px; color: #C2410C; margin-top: 16px; background: #FEF3E2; padding: 8px 12px; border-radius: 6px;">⚠ 相談所からの連絡記録がありません</p>`

  const result = await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `[ふたりへ] 課金異議申立て：${agencyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif; max-width: 560px; color: #1A1612;">
        <h2 style="font-family: 'Shippori Mincho', serif; font-weight: 500; color: #1A1612; font-size: 18px; border-bottom: 1px solid #E5E0D8; padding-bottom: 12px;">
          課金イベントに異議申立てがありました
        </h2>
        <table style="width: 100%; margin: 16px 0; font-size: 14px; line-height: 1.7;">
          <tr><td style="color: #8C8480; padding: 4px 0; width: 110px;">相談所</td><td>${escape(agencyName)}</td></tr>
          <tr><td style="color: #8C8480; padding: 4px 0;">カウンセラー</td><td>${escape(counselorName)}</td></tr>
          <tr><td style="color: #8C8480; padding: 4px 0;">利用者</td><td>${escape(userName)}</td></tr>
          <tr><td style="color: #8C8480; padding: 4px 0;">予約日</td><td>${escape(bookedAt)}</td></tr>
          <tr><td style="color: #8C8480; padding: 4px 0;">面談予定</td><td>${escape(reservationAt)}</td></tr>
          <tr><td style="color: #8C8480; padding: 4px 0;">異議申立日</td><td>${escape(disputedAt)}</td></tr>
          <tr><td style="color: #8C8480; padding: 4px 0;">金額</td><td><strong>¥${(event.amount_jpy ?? 0).toLocaleString('ja-JP')}</strong></td></tr>
        </table>
        <h3 style="font-size: 14px; color: #1A1612; margin-top: 24px;">相談所からの異議内容</h3>
        <div style="background: #F7F4EF; padding: 14px 16px; border-radius: 8px; font-size: 13px; line-height: 1.7; white-space: pre-wrap;">${escape(event.dispute_note ?? '（記載なし）')}</div>
        ${userNoteBlock}
        ${agencyMessageBlock}
        <p style="margin-top: 24px;">
          <a href="${adminBillingUrl}" style="display: inline-block; background: #A87C2A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px;">
            統括管理画面で確認・解決する
          </a>
        </p>
        <p style="font-size: 11px; color: #8C8480; margin-top: 32px; border-top: 1px solid #E5E0D8; padding-top: 12px;">
          このメールは Supabase Database Webhook 経由で billing_events.status が 'disputed' に
          遷移したときに自動送信されています。
        </p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true, event_id: event.id, mail: result })
}
