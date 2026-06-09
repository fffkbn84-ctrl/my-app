// futarive-counselor/lib/email.ts
// Resend 経由のメール送信ラッパー（counselor）。
// admin (futarive-admin/lib/email.ts) と同一仕様。From/Reply-To は全プロジェクト統一。
// 環境変数 RESEND_API_KEY が未設定の場合は console.warn を出して何も送らない（事故防止・ビルドは壊さない）。
//
// 使い方:
//   import { sendEmail } from '@/lib/email'
//   await sendEmail({ to: 'agency@example.com', subject: 'foo', html: '<p>bar</p>' })

import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

// 送信元（全プロジェクト統一）: send.kinda.jp は Resend で認証済み（DKIM/SPF/MX/DMARC 緑）。
// noreply@send.kinda.jp は送信専用（実メールボックス不要）。
const DEFAULT_FROM = 'Kinda ふたりへ <noreply@send.kinda.jp>'
// 返信先（全プロジェクト統一）: hello@kinda.jp は ImprovMX 経由で Gmail に着信する。
const DEFAULT_REPLY_TO = 'hello@kinda.jp'

export type SendEmailParams = {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, from, replyTo }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set, skipping send:', { to, subject })
    return { skipped: true as const, reason: 'no_api_key' }
  }

  const resend = new Resend(RESEND_API_KEY)
  const result = await resend.emails.send({
    from: from ?? DEFAULT_FROM,
    to,
    subject,
    html,
    replyTo: replyTo ?? DEFAULT_REPLY_TO,
  })

  if (result.error) {
    console.error('[email] send failed:', result.error)
    return { ok: false as const, error: result.error }
  }

  return { ok: true as const, id: result.data?.id }
}
