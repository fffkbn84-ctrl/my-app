// futarive-counselor/lib/notifications.ts
//
// K-5: ブラウザ通知ユーティリティ
//
// Web Notifications API のラッパー：
// - permission の状態取得 / リクエスト
// - ユーザーの ON/OFF 設定（localStorage 永続化）
// - 通知の発火
//
// iPhone Safari は PWA 化必要（後日対応）。今は desktop / Android Chrome 想定。

const PREF_KEY = 'kinda-notifications-enabled'

export type NotificationPermissionState =
  | 'default'    // 未確認
  | 'granted'    // 許可済み
  | 'denied'     // 拒否（ユーザーが再度許可しないと出ない）
  | 'unsupported' // ブラウザが API 非対応 or SSR

export function getPermissionState(): NotificationPermissionState {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return 'unsupported'
  }
  return Notification.permission as NotificationPermissionState
}

/**
 * ユーザーがブラウザ通知を「使いたい」と設定しているか（localStorage）。
 * 実際に通知が出るのは
 *   isPreferenceEnabled() && getPermissionState() === 'granted'
 * の AND 条件。
 */
export function isPreferenceEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(PREF_KEY) === 'true'
  } catch {
    return false
  }
}

export function setPreferenceEnabled(on: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (on) localStorage.setItem(PREF_KEY, 'true')
    else localStorage.removeItem(PREF_KEY)
  } catch {
    // Privacy mode 等で localStorage 不可 → 無視
  }
}

/**
 * permission を要求する。
 * 成功すれば 'granted'、拒否されれば 'denied'。
 * 既に 'granted'/'denied' の場合は再度ダイアログは出ない。
 */
export async function requestPermission(): Promise<NotificationPermissionState> {
  if (typeof Notification === 'undefined') return 'unsupported'
  try {
    const result = await Notification.requestPermission()
    return result as NotificationPermissionState
  } catch {
    return 'denied'
  }
}

interface ShowOptions {
  title: string
  body?: string
  /** クリックでフォアグラウンドに戻り遷移する URL（同一オリジン推奨） */
  url?: string
  /** 同種の通知をまとめる識別子（同 tag は上書き表示される） */
  tag?: string
}

export function showNotification(opts: ShowOptions): Notification | null {
  if (typeof Notification === 'undefined') return null
  if (Notification.permission !== 'granted') return null

  try {
    const notification = new Notification(opts.title, {
      body: opts.body,
      tag: opts.tag,
      icon: '/favicon.ico',
    })
    if (opts.url) {
      notification.onclick = (e) => {
        e.preventDefault()
        try { window.focus() } catch { /* noop */ }
        try { window.location.assign(opts.url!) } catch { /* noop */ }
        notification.close()
      }
    }
    return notification
  } catch {
    return null
  }
}
