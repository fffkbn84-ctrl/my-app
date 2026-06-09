# Claude Code 指示書 2026-06-09：メール送信の配線（Resend send.kinda.jp 認証完了後）

> **最初に必ずやること**：CLAUDE.md §10「ブランチ運用」を確認し、指定ブランチで作業する（新規ブランチ作成禁止）。
> **実装前に必ずリポジトリ実態を確認**すること。この指示書のファイルパス・定数名は引き継ぎ時点の推定を含むので、各リポジトリの実ファイルを `read`/`grep` してから着手する（設計と実装の乖離を前提に動く）。

## 背景（確定事実）
- Resend で **`send.kinda.jp` のドメイン認証が完了（DKIM/SPF/MX/DMARC すべて緑）**。Region は東京（ap-northeast-1）。
- これまでメール送信は **admin のみ実装済み**：
  - `futarive-admin/lib/email.ts`（Resend 送信ラッパー。`RESEND_API_KEY` 未設定なら送らず警告＝事故防止）。
  - `futarive-admin/app/api/webhooks/billing-disputed/route.ts`（課金異議 → 運営宛通知）。
  - admin の Vercel には `RESEND_API_KEY` 設定済み。送信元は **`onboarding@resend.dev`**（＝アカウント所有者宛しか届かない暫定値）。
- user-site（リポジトリ `fffkbn84-ctrl/my-app` / Vercel `my-app-rp9u`）と counselor（`futarive-counselor`）は **未実装**。

## 共通の送信設定（全プロジェクト統一）
- **From**：`Kinda ふたりへ <noreply@send.kinda.jp>`
- **Reply-To**：`hello@kinda.jp`
- 定数化して使い回す（ハードコード散在を避ける）。

---

## タスクA：admin の送信元を本番ドメインへ差し替え【今すぐ可能・Claude Code】
1. `futarive-admin/lib/email.ts` を確認し、送信元（現 `onboarding@resend.dev`）を `Kinda ふたりへ <noreply@send.kinda.jp>` に変更。
2. 同ラッパーの送信処理に **Reply-To `hello@kinda.jp`** を付与。
3. 既存の `billing-disputed` 通知が新しい送信元で送れることを、admin 環境のテスト送信で確認（`RESEND_API_KEY` は設定済み）。

**受け入れ条件**：admin から実アドレス（所有者以外でも）へ送信でき、Fromが `noreply@send.kinda.jp`、Reply-Toが `hello@kinda.jp` になっている。

## タスクB：lib/email.ts を user-site と counselor へ展開【Claude Code（ただし送信にはタスクD必須）】
1. admin の `lib/email.ts` を **user-site（my-app）** と **counselor** に移植（各リポジトリの `lib/` or `src/lib/` 規約に合わせる）。From/Reply-To はタスクAと同一。
2. `RESEND_API_KEY` 未設定でも**ビルドが壊れず警告で握りつぶす**挙動（admin と同じガード）を維持。

**受け入れ条件**：両プロジェクトに送信ラッパーが存在し、import して呼べる状態。キー未設定時はクラッシュせず送信スキップ。

## タスクC：sitemap から `/mypage` を除外【今すぐ可能・Claude Code・SEO整合】
- user-site（my-app）の `sitemap` 生成箇所（`app/sitemap.ts` 等）から **`/mypage` を除外**。`robots.txt` が `/mypage` を Disallow しているため整合させる。
- **受け入れ条件**：`https://kinda.jp/sitemap.xml` に `/mypage` が含まれない。GSC の「robotsでブロック」警告が出なくなる。

## タスクD：RESEND_API_KEY を各 Vercel プロジェクトに追加【ふうかさんの手・Claude Code ではない】
> Claude Code は実施不可。ふうかさんが以下を行う。指示書には手順として残す。
1. Resend → **API keys** で user-site 用・counselor 用のキーを発行（admin のキー流用も可だが、プロジェクト別が望ましい）。
2. Vercel の **my-app-rp9u** と **futarive-counselor** の Environment Variables に `RESEND_API_KEY`（Production）を追加。
3. 再デプロイ。→ これでタスクBのラッパーが実送信可能になる。

## タスクE：口コミ促進メール（運営名義）【Resend認証完了で解禁・Bの後】
- 既存の自動完了フロー（`auto_complete_reservations()` ＋ pg_cron、`reservations.status='completed'`）契機で「面談お疲れさまでした、口コミを」を運営名義で送る。
- 送信元プロジェクトは運営/ユーザー宛のため admin or user-site のいずれか適切な側に。`lib/email.ts`（タスクB）展開後に実装。
- **依存**：タスクB（ラッパー）＋タスクD（キー）。文面ドラフトが必要なら次セッションでこちらが用意。

## タスクF：取引メール本文（決済/予約確定/連絡先開示/日程変更/返金）【Stripe実装とセット・今はやらない】
- すべて Stripe `payment_intent.succeeded` 等の Webhook 起点のため、**Stripe 実装に同梱**して作る方針（Stripe-first）。
- 役割分担：user-site→ユーザー宛（確定/決済/日程変更/返金）、counselor→相談所宛（新規予約/開示/日程変更）、admin→運営宛（異議申立て・既存）。
- 文面ドラフトは Stripe 着手時にこちらで用意。**今セッションでは着手しない。**

---

## 着手順の推奨
1. タスクA（admin 差し替え・即・低リスク）
2. タスクC（sitemap /mypage 除外・即・SEO整合）
3. タスクB（ラッパー展開）→ タスクD（ふうかさんがキー投入）→ 実送信開通確認
4. タスクE（口コミ促進メール）
5. タスクF は Stripe 着手時にまとめて
