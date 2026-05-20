// futarive-admin/lib/email.ts
// Resend 経由のメール送信ラッパー。
// 環境変数 RESEND_API_KEY が未設定の場合は console.warn を出して何も送らない（開発時の事故防止）。
//
// 使い方:
//   import { sendEmail } from '@/lib/email'
//   await sendEmail({ to: 'admin@example.com', subject: 'foo', html: '<p>bar</p>' })

import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

// デフォルトの送信元: Resend が用意している共有ドメイン
// 自分のドメインを Verify したら 'noreply@yourdomain.jp' のようなアドレスに切り替える
const DEFAULT_FROM = 'ふたりへ運営 <onboarding@resend.dev>'

export type SendEmailParams = {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
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
  })

  if (result.error) {
    console.error('[email] send failed:', result.error)
    return { ok: false as const, error: result.error }
  }

  return { ok: true as const, id: result.data?.id }
}
