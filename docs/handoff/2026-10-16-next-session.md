# 次セッションへの引き継ぎ（2026-10-15 夜 → 次回）

> 次回は **「`docs/handoff/2026-10-16-next-session.md` を読んで、上から進めて」** で始める。
> 順番と状態の正は `TODO.md` 冒頭「2026-10-15 ふうか依頼の4件」。

---

## 0. 先に確認すること

- [x] **PR #94**（トップの「× 美容」を外す＋小見出しの折り返し）：10/15 マージ・kinda.jp で反映を確認
- 美容が残っている3か所（外すかはふうか判断・未回答）
  1. `src/app/layout.tsx` サイト全体の meta description（Google の検索結果に出る文）「お見合いのカフェ、デートの場所、ふたりに必要な美容まで」
  2. `src/app/kinda-act/layout.tsx` の description「婚活前の美容まで」
  3. `/about`（`src/app/about/page.tsx`）の本文2か所「婚活準備の美容室」「婚活前の美容室」

## 1. お知らせ登録の区別を直す（最初にやる・小さい）

**判断（Claude）：直す。** pair は 8/13 から LP・topics・solo を公開済みで、pair LP のお知らせフォームも本番に出ている
（10/15 の返事で「pair の正式公開より前に」と書いたのは誤り。まだなのは「ふたりで使う機能」だけ）。
pair のフォームは「Kinda pair の新しい機能が公開されたときのみご連絡します」と約束している。
誰がどの約束で登録したかが分からないと、その約束を守れない（個人情報の利用目的の範囲）。

- 原因：`src/components/kinda-talk/NotifySignup.tsx` が `source` を API に送っていない → `src/app/api/notify/route.ts` が全部 `talk_empty` で保存
- もう1つ：`notify_signups` の一意制約が `lower(email)` だけ。2つ目の機能への登録は 23505 で黙って捨てられる
- 直し方：
  1. `NotifySignup` の fetch の body に `source` を足す
  2. API は決まった値だけ受け付ける（`talk_empty`・`home_reel`（トップは今 source を渡していないので付ける）・`pair_lp`）。それ以外は 400
  3. マイグレーション：一意制約を `(lower(email), source)` に張り替える。RLS はいまのまま
  4. トップ `src/components/home/HomeReelCarousel.tsx` の `<NotifySignup fill />` に `source="home_reel"`
- 既存2件（6/26・8/7）は pair LP より前なので `talk_empty` のままでよい
- テーブル定義は Supabase MCP の `list_tables` で確かめてから（CLAUDE.md §6）

## 2. 返金 → 充当の規約書き換え（ふうか依頼済み・10/15）

決まったこと（正は `docs/ops/refund-credit-slide-2026-10.md` §7）：
- 運営が認めた例外は、返金ではなく**次の予約の送客料1件分に充当**。**期限なし**
- 解約時に未充当が残っていれば返金。**原則は元のカードへ Stripe で返金、カード返金が失敗したときは Kinda 名義の銀行振込**（振込手数料は Kinda 負担）
- 充当後に元の課金へチャージバックが来たら、未使用の充当は取り消す
- 充当の対象は「やむを得ない事情で運営が認めたとき」だけ（無断不参加などへ広げるかは未決。広げないで書く）

条文のたたき台は同ファイル §5。**「6か月」の部分は消して期限なしにする。**

書き換える場所（ブランチが2系統あるので注意 CLAUDE.md §10）：

| 系統 | ファイル |
|---|---|
| main（docs） | `docs/contracts/agency-agreement.md` 第6条第5項（＋末尾の弁護士レビュー観点 185行目あたり） |
| main（docs） | `docs/contracts/tokushoho-agency-b2b.md` |
| main（docs） | `docs/ops/billing-and-refunds.md` §2・§4-6 |
| main（docs） | `docs/sales/kinda-deck-brief.md`・`kinda-deck.html`・`kinda-faq-v3.html`・`kinda-sales-script-v1.html` の返金の記述 |
| main（docs） | CLAUDE.md §12「返金ルール」の表（仕様が変わったので憲法も直す） |
| main（src・PR） | `src/app/tokushou/page.tsx` の「結婚相談所さま向け」節／`src/app/for-counselors/page.tsx` の返金の記述 |
| counselor（`claude/fix-profile-creation-1clpG`） | `futarive-counselor/app/terms/page.tsx` 第6条／`app/(main)/billing/page.tsx` の返金の案内文 |
| counselor | **FAQ ページを新設**（既存 TODO「counselor 管理画面に FAQ ページ」と合わせる）。充当の仕組み・解約時の返金・返金の反映日数（数日〜10日）・課金のタイミング・日程変更では課金しない・Link のメール欄は不要 |

- 利用者向け（kinda.jp の一般の利用規約）は利用者が払わないので対象外。念のため `src/app/terms` に送客料の返金の記述がないか grep で確かめる
- 既存の契約相談所はまだ0社なので、お知らせメールは不要（1社目の前に出せる）
- 書き換え後に「顧問弁護士に見せる観点」を `agency-agreement.md` 末尾に1行足す（期限なしの充当が前払式支払手段に当たるか）

### 違法ではないか（10/15 ふうかの質問への Claude の見立て）

調べた範囲では違法になる点は見つからなかった。ただし Claude は弁護士ではないので、最終確認は顧問弁護士に1回見せる前提（CLAUDE.md §12 でも契約書は弁護士レビュー前提）。
- 相談所との契約（事業者どうし）なので、消費者契約法は関係ない。いまの「原則返金なし」より相談所に有利な変更
- 前払式支払手段：充当は相談所がお金を払って買う券ではなく、番号や券も出さない。当たらない可能性が高い。
  仮に当たっても自家型は基準日（3/31・9/30）の未使用残高が1,000万円を超えるまで届出不要
- 景品表示法：利用者への景品ではないので対象外

## 3. 空の手帳 v1

- v1-a（note トップの入口）は未着手。Claude だけで出せる
- v1-b（地図）：ふうかが画像を生成中（プロンプトは研究メモ §5）。届いたら WebP 化 → 日本の位置と街の点を画像を見て置く → 世界→日本のズーム（CSS transform＋切り替え、reduced-motion では切り替えのみ）

## 4. まだ返事待ち

- 小山楓華の自己紹介（`bio` が先に出る件）は保留
- パンフレット（handoff `2026-10-15-koyama-profile-and-guide.md` §2 の決めること3つ）
