// Supabase の PostgrestError / 不明な例外を人間可読な日本語メッセージに変換する
export function describeError(e: unknown): string {
  if (!e) return '不明なエラー'
  if (typeof e === 'string') return e
  if (e instanceof Error) return e.message
  if (typeof e === 'object') {
    const obj = e as { message?: string; details?: string; hint?: string; code?: string }
    // NOT NULL 制約違反
    if (obj.code === '23502') {
      const colMatch = /column "([^"]+)"/i.exec(obj.message ?? obj.details ?? '')
      if (colMatch) {
        if (colMatch[1] === 'agency_id') {
          return '所属相談所が設定されていません。運営または相談所オーナーにお問い合わせください。'
        }
        return `必須項目「${colMatch[1]}」が未入力です。`
      }
      return '必須項目が未入力です。'
    }
    // 外部キー制約違反
    if (obj.code === '23503') {
      return '選択した相談所が存在しません。ページを再読み込みしてお試しください。'
    }
    // 重複キー
    if (obj.code === '23505') {
      return '既に登録済みのデータと重複しています。'
    }
    // RLS エラー
    if (obj.code === '42501' || /row-level security|permission denied/i.test(obj.message ?? '')) {
      return '権限エラー（RLS）。ログインし直すか運営までお問い合わせください。'
    }
    if (obj.message) return obj.message
    if (obj.details) return obj.details
    try { return JSON.stringify(obj) } catch { return '保存エラー' }
  }
  return String(e)
}
