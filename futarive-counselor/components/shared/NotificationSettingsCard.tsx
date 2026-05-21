'use client'

// K-5: ブラウザ通知の ON/OFF UI
//
// ダッシュボード等に置く小さなカード。
// - permission の状態と localStorage 設定を組み合わせて4状態を表現
// - ON にするには「許可」+「設定 ON」両方が必要
// - 「テスト通知」ボタンで実際の見た目を確認できる

import { useCallback, useEffect, useState } from 'react'
import {
  getPermissionState,
  isPreferenceEnabled,
  requestPermission,
  setPreferenceEnabled,
  showNotification,
  type NotificationPermissionState,
} from '@/lib/notifications'

type DisplayState =
  | 'unsupported'    // API 非対応
  | 'denied'         // permission 拒否済（ブラウザ設定から手動で許可必要）
  | 'enabled'        // 通知が出る状態
  | 'preference_off' // 許可済みだがユーザー設定が OFF
  | 'needs_request'  // 未確認

function computeState(perm: NotificationPermissionState, pref: boolean): DisplayState {
  if (perm === 'unsupported') return 'unsupported'
  if (perm === 'denied') return 'denied'
  if (perm === 'granted' && pref) return 'enabled'
  if (perm === 'granted' && !pref) return 'preference_off'
  return 'needs_request'
}

export default function NotificationSettingsCard() {
  const [perm, setPerm] = useState<NotificationPermissionState>('unsupported')
  const [pref, setPref] = useState(false)
  // 「ページ遷移なし」のため、設定変更後にリアルタイム反映する。
  // listener は次回マウント時に新設定で動くので、ふうかさんには
  // 「設定変更後 ON にしたら一度ダッシュボードを再表示してください」と案内。

  useEffect(() => {
    setPerm(getPermissionState())
    setPref(isPreferenceEnabled())
  }, [])

  const handleEnable = useCallback(async () => {
    const granted = await requestPermission()
    setPerm(granted)
    if (granted === 'granted') {
      setPreferenceEnabled(true)
      setPref(true)
      // 即座にテスト通知を出して動作確認
      showNotification({
        title: 'ブラウザ通知をオンにしました',
        body: '新しい予約や口コミが入ったらここに通知します。',
        tag: 'kinda-welcome',
      })
    }
  }, [])

  const handleDisable = useCallback(() => {
    setPreferenceEnabled(false)
    setPref(false)
  }, [])

  const handleReEnable = useCallback(() => {
    setPreferenceEnabled(true)
    setPref(true)
  }, [])

  const handleTest = useCallback(() => {
    showNotification({
      title: 'テスト通知',
      body: '実際にはこんな感じで届きます。',
      tag: 'kinda-test',
    })
  }, [])

  const state = computeState(perm, pref)

  return (
    <div className="kc-card" style={{ padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span aria-hidden style={{ flexShrink: 0, marginTop: 2 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>
            ブラウザ通知
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', margin: '4px 0 0', lineHeight: 1.6 }}>
            {state === 'unsupported' &&
              'このブラウザは通知に対応していません。Chrome / Safari など最新ブラウザでお試しください。'}
            {state === 'denied' &&
              'ブラウザ側で通知が拒否されています。ブラウザの設定からこのサイトの通知を許可してから戻ってきてください。'}
            {state === 'needs_request' &&
              '新しい予約や口コミが入ったら、ブラウザにすぐお知らせできます。'}
            {state === 'preference_off' &&
              '通知は許可されていますが、現在 OFF になっています。'}
            {state === 'enabled' &&
              'ON になっています。新しい予約・口コミが入ったらブラウザに通知します。'}
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {state === 'needs_request' && (
              <button type="button" className="kc-btn kc-btn-primary kc-btn-sm" onClick={handleEnable}>
                通知をオンにする
              </button>
            )}
            {state === 'preference_off' && (
              <button type="button" className="kc-btn kc-btn-primary kc-btn-sm" onClick={handleReEnable}>
                通知をオンにする
              </button>
            )}
            {state === 'enabled' && (
              <>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={handleTest}>
                  テスト通知を送る
                </button>
                <button type="button" className="kc-btn kc-btn-ghost kc-btn-sm" onClick={handleDisable}>
                  通知をオフにする
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
