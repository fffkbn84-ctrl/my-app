// supabase/functions/notify-stale-profiles/index.ts
//
// プロフィール情報が長期間未更新（既定 90 日以上）の counselor / agency 所有者に
// 「更新しませんか？」メールを送る Edge Function。
//
// 入力: HTTP POST（Supabase Cron からの定期実行を想定。手動でも叩ける）
// Authorization: Bearer <STALE_NOTIFY_TOKEN>  ← 自分で設定する任意の固定トークン
//
// 環境変数（Supabase の Function Secrets で設定）:
//   RESEND_API_KEY            必須。Resend の API キー
//   RESEND_FROM               任意。差出人。既定 "Kinda <noreply@example.com>"
//   STALE_NOTIFY_TOKEN        必須。リクエスト認可用の固定トークン
//   KINDA_COUNSELOR_URL       任意。カウンセラー管理画面のベース URL（メール文面のリンク用）
//   STALE_DAYS                任意。何日経過から対象か（既定 90）
//   COOLDOWN_DAYS             任意。前回送信からのクールダウン日数（既定 30）
//   DRY_RUN                   任意。"1" なら実際の送信と DB 更新をスキップしてログ出力のみ
//
// 戻り値（JSON）: { processed, sent, skipped, errors }
//
// 設計メモ:
//   - SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY は Supabase Functions ランタイムが自動注入する
//   - service-role キーで auth.users を読むため、メール宛先は本人ログインのアドレス
//   - 1 リクエストあたりの処理上限は MAX_PER_RUN（暴走防止）

// @ts-ignore Deno runtime import — type resolution only matters at deploy time
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM = Deno.env.get('RESEND_FROM') ?? 'Kinda <noreply@kinda.invalid>'
const STALE_NOTIFY_TOKEN = Deno.env.get('STALE_NOTIFY_TOKEN') ?? ''
const KINDA_COUNSELOR_URL = Deno.env.get('KINDA_COUNSELOR_URL') ?? 'https://kinda-counselor.vercel.app'

const STALE_DAYS = parseInt(Deno.env.get('STALE_DAYS') ?? '90', 10)
const COOLDOWN_DAYS = parseInt(Deno.env.get('COOLDOWN_DAYS') ?? '30', 10)
const DRY_RUN = Deno.env.get('DRY_RUN') === '1'
const MAX_PER_RUN = 50

type Kind = 'counselor' | 'agency'

interface Target {
  kind: Kind
  id: string
  name: string
  ownerUserId: string
  email: string
  updatedAt: string
  daysSince: number
}

function days(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

async function fetchOwnerEmail(supabase: ReturnType<typeof createClient>, userId: string): Promise<string | null> {
  const { data, error } = await supabase.auth.admin.getUserById(userId)
  if (error || !data?.user?.email) return null
  return data.user.email
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  if (DRY_RUN) {
    console.log('[dry-run]', JSON.stringify({ to, subject }))
    return { ok: true }
  }
  if (!RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY not configured' }
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: RESEND_FROM, to, subject, html, text }),
  })
  if (!res.ok) {
    return { ok: false, error: `Resend ${res.status}: ${await res.text()}` }
  }
  const body = await res.json() as { id?: string }
  return { ok: true, id: body.id }
}

function counselorMail(name: string, daysSince: number) {
  const link = `${KINDA_COUNSELOR_URL}/profile`
  const subject = 'Kinda: プロフィール情報の見直しのご案内'
  const text = [
    `${name} さん`,
    '',
    'お久しぶりです。Kinda 運営です。',
    '',
    `登録いただいたプロフィール情報を、最後に更新されてから ${daysSince} 日が経ちました。`,
    'お忙しいところ恐縮ですが、いまの状況を映した内容になっているか、一度ご確認いただけますと幸いです。',
    '',
    `掲載内容の編集はこちらから： ${link}`,
    '',
    '— Kinda 運営チームより',
  ].join('\n')
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;color:#2C2A28;line-height:1.85;max-width:560px;padding:8px 4px">
    <p>${escapeHtml(name)} さん</p>
    <p>お久しぶりです。Kinda 運営です。</p>
    <p>登録いただいたプロフィール情報を、最後に更新されてから <strong>${daysSince} 日</strong> が経ちました。<br>
    お忙しいところ恐縮ですが、いまの状況を映した内容になっているか、一度ご確認いただけますと幸いです。</p>
    <p>掲載内容の編集はこちらから：<br>
    <a href="${link}" style="color:#D4A090;word-break:break-all">${link}</a></p>
    <p style="margin-top:28px;color:#8B8580;font-size:12px">— Kinda 運営チームより</p>
  </div>`
  return { subject, text, html }
}

function agencyMail(name: string, daysSince: number) {
  const link = `${KINDA_COUNSELOR_URL}/profile`
  const subject = 'Kinda: 相談所情報の見直しのご案内'
  const text = [
    `${name} ご担当者さま`,
    '',
    'お久しぶりです。Kinda 運営です。',
    '',
    `ご登録の相談所情報を、最後に更新されてから ${daysSince} 日が経ちました。`,
    '料金プランや営業時間に変化があれば、ぜひ反映をお願いいたします。',
    '',
    `編集ページ： ${link}`,
    '',
    '— Kinda 運営チームより',
  ].join('\n')
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;color:#2C2A28;line-height:1.85;max-width:560px;padding:8px 4px">
    <p>${escapeHtml(name)} ご担当者さま</p>
    <p>お久しぶりです。Kinda 運営です。</p>
    <p>ご登録の相談所情報を、最後に更新されてから <strong>${daysSince} 日</strong> が経ちました。<br>
    料金プランや営業時間に変化があれば、ぜひ反映をお願いいたします。</p>
    <p>編集ページ：<br>
    <a href="${link}" style="color:#D4A090;word-break:break-all">${link}</a></p>
    <p style="margin-top:28px;color:#8B8580;font-size:12px">— Kinda 運営チームより</p>
  </div>`
  return { subject, text, html }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

Deno.serve(async (req) => {
  // 認可: 固定トークン
  if (!STALE_NOTIFY_TOKEN) {
    return new Response(JSON.stringify({ error: 'STALE_NOTIFY_TOKEN not configured' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${STALE_NOTIFY_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const staleCutoff = new Date(Date.now() - STALE_DAYS * 86_400_000).toISOString()
  const cooldownCutoff = new Date(Date.now() - COOLDOWN_DAYS * 86_400_000).toISOString()

  const targets: Target[] = []
  const errors: { kind: Kind; id: string; error: string }[] = []

  // ── counselors ──
  const { data: cRows, error: cErr } = await supabase
    .from('counselors')
    .select('id, name, owner_user_id, updated_at, last_freshness_alert_sent_at')
    .lt('updated_at', staleCutoff)
    .not('owner_user_id', 'is', null)
    .or(`last_freshness_alert_sent_at.is.null,last_freshness_alert_sent_at.lt.${cooldownCutoff}`)
    .limit(MAX_PER_RUN)

  if (cErr) {
    return new Response(JSON.stringify({ error: 'counselor query failed', detail: cErr.message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }

  for (const r of (cRows ?? []) as Array<{ id: string; name: string; owner_user_id: string; updated_at: string }>) {
    const email = await fetchOwnerEmail(supabase, r.owner_user_id)
    if (!email) {
      errors.push({ kind: 'counselor', id: r.id, error: 'owner has no email' })
      continue
    }
    targets.push({
      kind: 'counselor', id: r.id, name: r.name,
      ownerUserId: r.owner_user_id, email,
      updatedAt: r.updated_at, daysSince: days(r.updated_at),
    })
  }

  // ── agencies ──
  const { data: aRows, error: aErr } = await supabase
    .from('agencies')
    .select('id, name, owner_user_id, updated_at, last_freshness_alert_sent_at')
    .lt('updated_at', staleCutoff)
    .not('owner_user_id', 'is', null)
    .or(`last_freshness_alert_sent_at.is.null,last_freshness_alert_sent_at.lt.${cooldownCutoff}`)
    .limit(MAX_PER_RUN)

  if (aErr) {
    return new Response(JSON.stringify({ error: 'agency query failed', detail: aErr.message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }

  for (const r of (aRows ?? []) as Array<{ id: string; name: string; owner_user_id: string; updated_at: string }>) {
    const email = await fetchOwnerEmail(supabase, r.owner_user_id)
    if (!email) {
      errors.push({ kind: 'agency', id: r.id, error: 'owner has no email' })
      continue
    }
    targets.push({
      kind: 'agency', id: r.id, name: r.name,
      ownerUserId: r.owner_user_id, email,
      updatedAt: r.updated_at, daysSince: days(r.updated_at),
    })
  }

  // ── 送信ループ ──
  let sent = 0
  const skipped: { kind: Kind; id: string; reason: string }[] = []
  const now = new Date().toISOString()

  for (const t of targets) {
    const tmpl = t.kind === 'counselor' ? counselorMail(t.name, t.daysSince) : agencyMail(t.name, t.daysSince)
    const result = await sendEmail(t.email, tmpl.subject, tmpl.html, tmpl.text)
    if (!result.ok) {
      errors.push({ kind: t.kind, id: t.id, error: result.error })
      continue
    }
    if (DRY_RUN) {
      skipped.push({ kind: t.kind, id: t.id, reason: 'dry-run' })
      continue
    }
    const { error: updErr } = await supabase
      .from(t.kind === 'counselor' ? 'counselors' : 'agencies')
      .update({ last_freshness_alert_sent_at: now })
      .eq('id', t.id)
    if (updErr) {
      errors.push({ kind: t.kind, id: t.id, error: `update failed: ${updErr.message}` })
      continue
    }
    sent++
  }

  return new Response(JSON.stringify({
    processed: targets.length,
    sent,
    skipped,
    errors,
    config: { staleDays: STALE_DAYS, cooldownDays: COOLDOWN_DAYS, dryRun: DRY_RUN },
  }, null, 2), { headers: { 'content-type': 'application/json' } })
})
