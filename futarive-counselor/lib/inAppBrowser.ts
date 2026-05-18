// In-app browser 検出ユーティリティ
//
// LINE / Instagram / Facebook / Twitter(X) / TikTok などの SNS アプリが内蔵する
// WebView では Cookie が外部 Safari/Chrome と分離されており、
// Supabase Auth のセッションが保持されない・magic link が壊れる等の
// 認証トラブルが頻発する。
// 認証画面ではこの関数で検出し、ユーザーに外部ブラウザで開き直すよう案内する。

export type InAppBrowser =
  | 'line'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'tiktok'
  | null

export function detectInAppBrowser(): InAppBrowser {
  if (typeof window === 'undefined' || !navigator?.userAgent) return null
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('line/')) return 'line'
  if (ua.includes('instagram')) return 'instagram'
  if (ua.includes('fban') || ua.includes('fbav') || ua.includes(' fb_iab')) return 'facebook'
  if (ua.includes('twitter') || ua.includes(' x/')) return 'twitter'
  if (ua.includes('tiktok') || ua.includes('musical_ly')) return 'tiktok'
  return null
}

export function inAppBrowserLabel(b: InAppBrowser): string {
  switch (b) {
    case 'line': return 'LINE'
    case 'instagram': return 'Instagram'
    case 'facebook': return 'Facebook'
    case 'twitter': return 'X（旧 Twitter）'
    case 'tiktok': return 'TikTok'
    default: return ''
  }
}

// LINE は ?openExternalBrowser=1 を付けると Safari/Chrome に切り替えてくれる
export function buildExternalBrowserUrl(currentHref: string, b: InAppBrowser): string {
  if (b !== 'line') return currentHref
  try {
    const url = new URL(currentHref)
    url.searchParams.set('openExternalBrowser', '1')
    return url.toString()
  } catch {
    return currentHref
  }
}
