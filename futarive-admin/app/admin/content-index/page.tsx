'use client'

import { useEffect, useState } from 'react'

interface VoiceRow {
  slug: string
  title: string
  author: string
  publishedAt: string
}
interface ColumnRow {
  slug: string
  title: string
  category: string
  publishedAt: string
}
interface StoryRow {
  id: string
  title: string
  stage: string
  date: string
  agencyName: string | null
  consentRecorded: boolean
}
interface ContentIndex {
  generatedAt: string
  voices: VoiceRow[]
  columns: ColumnRow[]
  stories: StoryRow[]
}

const SITE_URL = 'https://kinda.jp'

/**
 * Kinda voices・Kinda story は Claude/コードで content/columns/*.mdx・stories.ts に
 * 直接追加する運用のため、admin の既存「コラム管理」（別のSupabaseテーブル）には反映されない。
 * ここは書き込み経路を増やさず、サイト側の公開API（/api/content-index）を読むだけの
 * 読み取り専用の状況確認ページ。
 */
export default function ContentIndexPage() {
  const [data, setData] = useState<ContentIndex | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SITE_URL}/api/content-index`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error')
    } finally {
      setLoading(false)
    }
  }

  const fmtDate = (s: string) => {
    if (!s) return '—'
    const d = new Date(s)
    return isNaN(d.getTime()) ? s : d.toLocaleDateString('ja-JP')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Voices・Story状況</h1>
        <button onClick={load} className="btn btn-ghost btn-sm">再読み込み</button>
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.7 }}>
        Kinda voices（コラムの取材レポート）と Kinda story はユーザーサイトのリポジトリに
        直接追加される運用のため、下記は編集不可の一覧のみです。作成・編集は引き続き
        Claude Code / コード側で行ってください。
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : error ? (
        <div className="card">
          <div className="empty-state">読み込みに失敗しました（{error}）</div>
        </div>
      ) : !data ? null : (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              Kinda voices（{data.voices.length}件）
            </h2>
            {data.voices.length === 0 ? (
              <div className="empty-state">まだ公開された記事がありません</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>タイトル</th>
                      <th>著者</th>
                      <th>公開日</th>
                      <th>slug</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.voices.map((v) => (
                      <tr key={v.slug}>
                        <td style={{ fontSize: 13 }}>{v.title}</td>
                        <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{v.author}</td>
                        <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                          {fmtDate(v.publishedAt)}
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--muted)' }}>{v.slug}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              Kinda story（{data.stories.length}件）
            </h2>
            {data.stories.length === 0 ? (
              <div className="empty-state">まだ公開されたstoryがありません</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>タイトル</th>
                      <th>ステージ</th>
                      <th>相談所</th>
                      <th>投稿月</th>
                      <th>同意記録</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.stories.map((s) => (
                      <tr key={s.id}>
                        <td style={{ fontSize: 13 }}>{s.title}</td>
                        <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{s.stage}</td>
                        <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                          {s.agencyName ?? '非公開'}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                          {s.date}
                        </td>
                        <td>
                          <span className={s.consentRecorded ? 'badge badge-published' : 'badge badge-draft'}>
                            {s.consentRecorded ? '記録あり' : '未記録'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              その他コラム（{data.columns.length}件）
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>タイトル</th>
                    <th>カテゴリ</th>
                    <th>公開日</th>
                  </tr>
                </thead>
                <tbody>
                  {data.columns.map((c) => (
                    <tr key={c.slug}>
                      <td style={{ fontSize: 13 }}>{c.title}</td>
                      <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{c.category}</td>
                      <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {fmtDate(c.publishedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 16 }}>
            最終取得: {new Date(data.generatedAt).toLocaleString('ja-JP')}
          </p>
        </>
      )}
    </div>
  )
}
