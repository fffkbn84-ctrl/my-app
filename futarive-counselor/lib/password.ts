// 新しいパスワードの条件。Supabase の Authentication → Password の設定と同じにしておくこと
// （画面で先に弾き、Supabase に断られて理由の分からないエラーになるのを避ける）
export const PASSWORD_MIN_LENGTH = 10

export const PASSWORD_RULE_TEXT = `${PASSWORD_MIN_LENGTH}文字以上・英小文字／英大文字／数字／記号をそれぞれ1つ以上`

/** 条件を満たしていなければ、足りないところを返す。満たしていれば null */
export function checkNewPassword(password: string): string | null {
  const missing: string[] = []
  if (!/[a-z]/.test(password)) missing.push('英小文字')
  if (!/[A-Z]/.test(password)) missing.push('英大文字')
  if (!/[0-9]/.test(password)) missing.push('数字')
  if (!/[^a-zA-Z0-9]/.test(password)) missing.push('記号')
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `パスワードは${PASSWORD_MIN_LENGTH}文字以上にしてください${missing.length ? `（${missing.join('・')}も必要です）` : ''}`
  }
  if (missing.length) return `パスワードに${missing.join('・')}を入れてください`
  return null
}

/** Supabase Auth がパスワードを断ったときの理由を日本語にする。該当しなければ null */
export function describePasswordError(e: { message?: string; code?: string } | null | undefined): string | null {
  if (!e) return null
  const message = e.message ?? ''
  if (e.code === 'weak_password' || /^Password should/i.test(message)) {
    return `パスワードの条件を満たしていません（${PASSWORD_RULE_TEXT}）`
  }
  if (e.code === 'same_password' || /different from the old password/i.test(message)) {
    return 'いまと同じパスワードは使えません。別のパスワードにしてください'
  }
  return null
}
