# TODO.md — タスク管理・次セッションへの引き継ぎ

> **やることの正はこのファイル。日程・繰り返し予定の正は Notion「運営カレンダー」**（Kinda 運営ダッシュボード内）。
> 完了したら行頭を `- [x]` にして1行に圧縮。詳細な実装メモは `WORKLOG.md`。
> 定期整理は `/repo-tidy` Skill で行う（**隔週日曜**・定期タスク「TODO・WORKLOG の隔週整理」が自動で起動。2026-10-15 ふうか依頼）。
> **2026-10-15 に全面整理。** 整理前の全文は `docs/archive/todo-full-archive-2026-10-15.md`（その前は `todo-full-archive-2026-07-02.md`）。
> 過ぎた日付の SNS 項目・完了済みの Stripe 本番化などはアーカイブ側にだけ残した。

最終更新: 2026-10-19

### このファイルの読み方

| 印 | 意味 |
|---|---|
| 📌 | 次のセッションが最初にやること |
| 🔴 | **ふうかさんの返事・操作待ち**（Claude だけでは進まない） |
| 🟣 | **Claude がすぐやれる**（ふうかさんの判断は不要か、済んでいる） |
| 🟠 | 毎日・毎週の定常運用 |
| 🟡 | 次に作るもの（企画・制作） |
| 🔵 | 中期の開発・判断を急がないもの |
| 📎 | 変えない決まり・ノウハウ（参照用） |

---

## 📌 次セッション（最初に読む）

> **`docs/handoff/2026-10-18-next-session.md` を読んで、上から1つずつ進める。** 一気にはやらない。

0. [ ] 🔴 **相談所への声がけを始める（10/19 ふうか決定）。その前にこれだけ：Supabase のメールを Kinda 名義・日本語にする**（専用 URL を送ると、いまは Supabase の英語メールが届く）。手順と文面は `docs/ops/supabase-auth-email.md`。費用なし
      1. Resend で API キー（Sending access・`send.kinda.jp`）→ Supabase の SMTP Settings
      2. Email Templates（Reset Password／Confirm signup／Change Email Address）に日本語の件名・本文
      3. 自分宛てに1通送り、送信元が `Kinda <noreply@send.kinda.jp>` か確認 → Claude に伝える（→ 🟣 の「再設定メールの案内」を出す）
0-b. [ ] 🔴 **小山楓華さんの予約枠を11月末まで足す**（10/19 時点で最後の枠が 10/31。相談所の人は必ずサイトを触る）。counselor 管理画面のカレンダーから
1. [x] お知らせ登録を場所（source）ごとに保存（10/16 PR #95 マージ・本番 DB の一意制約も張り替え済み・本番で invalid_source を確認）。あわせて「美容」の記述3か所を外した（ふうか決裁）
2. [x] 返金 → 次の予約に充当、の規約書き換え（10/16）。main は PR `claude/refund-credit`、counselor は PR `claude/counselor-refund-credit`（FAQ ページ `/faq` 新設込み）。「前払い」の語も外した。調べは `docs/research/2026-10-16-prepay-privacy-credit.md`
2-b. [x] 充当の仕組み（10/17 PR #104・#105 マージ）。DB は migration 048・049（ふうかが SQL Editor で実行）。Stripe の本番 Webhook に `refund.failed` を追加。
       手順は `docs/ops/billing-and-refunds.md` §2。**本物での通し確認はまだ**（1件目の充当が使われたとき、Claude が DB とメールを確かめる）
3. [x] 空の手帳 v1-a：note トップに入口（街に行ったことがある端末だけ）。PR #98 マージ（10/17）
4. [x] 空の手帳 v1-b：クレイの世界地図。PR #99 マージ（10/17）。点はダウンライトのような光（天気の色を暖かい白に寄せる・ふうか指定）。以下は実装済みの手順の記録。画像2枚は10/16に届いて確認済み（作り直し不要）。元画像は `docs/assets/sky-map/world-raw.png`（3:2）・`japan-raw.png`（2:3）
       → WebP 化（**海の外側を透明に**。背景が #EBDCC9 前後でサイトの #F5EEE6 より濃く、四角い縁が出るため）・日本地図は左上の余白を詰める
       → 点を画像を見て置く（那覇は左下の囲み）→ 世界→日本のズーム（reduced-motion では切り替えのみ）
       → ヨーロッパに9都市が集まって点が重なる件は**案A：重なった点を押すと近くの街を並べて出す**（10/16 ふうか決定）
4-b. [ ] 🟣 **空の手帳 v1-c：today の結果画面で、地図の上の街が灯ってスタンプが押される演出**（10/16 ふうか案）。v1-b の `SkyMap` を使い回す。**地図を見てから、やるか・強さを決める**（結果画面の主役は今日の天気）

---

## 🔴 ふうかさんの返事・操作待ち

> 上から急ぐ順。返事をもらったら Claude がすぐ動けるものを先に置いた。

### お金・契約（1社目の契約より前に）

- [x] **Stripe の Webhook に `charge.dispute.created` を追加**（10/15 Claude が Stripe API で追加・読み直して3イベントを確認）。届くかは本物のチャージバックが来るまで確かめられない
- [ ] **相談所への領収書・適格請求書**：AGOGLIFE の適格請求書発行事業者の登録有無 → Stripe の領収書メールで足りるか決める（`docs/ops/refund-loss-research-2026-10.md`）
- [ ] **退会・解約後の個人情報の書き足し**（10/16 調べ・未着手）：①法令で保存する記録（課金・返金は7年）②充当の返金が終わるまで保持する情報 ③相談所が解約したとき受け取った利用者の連絡先の扱い。足すか決める。詳細 `docs/research/2026-10-16-prepay-privacy-credit.md` §2
- [ ] 返金の充当：**対象を広げるか**（無断不参加など。いまは「やむを得ない事情で運営が認めたとき」だけで書く）
- [ ] 弁護士・税理士に1回確認（期限なしの充当が前払式支払手段に当たるか・充当時の帳簿とインボイス）。規約の書き換え後に
- [x] **解約の30日を相談所側だけ短くする**（10/19 ふうか決定・契約書 第13条を改定）。相談所からの解約は通知の時点で掲載と新規予約を止め、確定済みの面談が終わった日に効力。Kinda からは30日のまま。**弁護士に1回見せるときに一緒に聞く**（チェックポイントに追記済み）
- [ ] **根拠のないチャージバックの費用を相談所の負担にする条項**（10/17 ふうか案）。弁護士に1回見せるときに一緒に聞く。
      - ふうかの意図：申し立てを受けた時点で Stripe から引かれる手数料 ¥1,500 を、**あとから相談所に払ってもらう**（Stripe からの引き落とし自体は止められないので止めない）
      - **Stripe の決まり（10/17 Claude 調べ・済）**：公開の規約（Stripe サービス契約・決済の規約）とドキュメントには、加盟店が自分の顧客に申し立ての費用を請求することを禁じる条文は見つからなかった。
        手数料は申し立てを受けた時点で ¥1,500（日本）、**勝っても戻らない**（日本では反論の手数料はかからない）。出典 https://stripe.com/jp/pricing ・ https://docs.stripe.com/disputes/how-disputes-work
        ※Stripe の規約がカード会社のルールを参照している可能性までは確かめていない（カード会社のルールは対象外）
      - **弁護士に聞くこと**：①はっきり書く／書かずに第15条第1項（契約違反の損害賠償）に含める、のどちらがよいか（チャージバックという考えを相手に思いつかせない、という観点も含めて）
        ②どう払ってもらうか（同じカードに課金すると再び異議を出されうる。振込・充当との差し引きなど）
      - Claude の見立て（参考）：事業者どうしの契約なので条項を入れること自体はできる見込みが高い。書くなら「Kinda が事実を確認し、正当な課金と判断した場合に限り、実費を負担」と絞る
- [ ] **商標**：J-PlatPat で「Kinda」45類・35類の先行調査 → 出願判断（3区分で実費 約12.8万円。Claude は手続きしない）
- [ ] **東京都へ開設のお知らせ**：都は生活文化局 地域活動推進課 03-5320-4236。区は江戸川区（産業経済部 経営支援課）から
- [ ] `hello@kinda.jp` 名義で**返信**する手段（受信は済み）。案A Google Workspace／案B ImprovMX 有料＋Gmail の別アドレス送信／案C Resend（手書き返信には不向き）。
      **10/19 ふうか方針**：案A（Google Workspace）にする。無料期間を活かすため、**相談所から返信が必要になった時点で設定する**（有料化の前に料金を確認・§7-10）
      フォーム営業の間は不要。メール営業に広げる段で決める（料金は契約前に確認・CLAUDE.md §7-10）

### 営業・相談所まわり

- [ ] **ふうかさんのリール3枚と Emma の画像を差し替え**（WebP は 10/11 にお渡し済み・counselor 管理画面で）。カウンセラーカード1枚目のリールにサイトのスクショ（ロゴ・タブが名前と重なる）が入っている件も同じ作業
- [ ] **小山楓華の自己紹介**（保留中）。kinda.jp は `bio`（「相談はKindaと思った時に。」）を `intro` より先に出す。直すなら `src/app/counselors/[id]/page.tsx` を `sc.intro ?? sc.bio` に（Claude 推し）か DB の `bio` を空に。案は handoff `2026-10-15-koyama-profile-and-guide.md` §1
- [ ] **小山楓華の未公開口コミ3件の公開可否**（admin → 口コミ）。公開すれば「公開済み口コミ0件」が解消する
- [ ] **counselor のログインを正式 URL（`https://futarive-counselor.vercel.app`）で試す**。まだ再読み込みが要るなら Claude が `app/(auth)/login/page.tsx` の遷移を `window.location` に直す
- [ ] **counselor：カード登録欄のダークモード**（#87）。ダークモードで /billing の見出しが読めるか確認
- [ ] **営業文面**（`docs/sales/kinda-form-outreach-v1.md`・未確定）
  - [ ] 署名を小山楓華のままにするか（10/7 に変更の可能性ありと申告）
  - [ ] 1社目の相談所 URL をもらって【共感パート】を埋める（段落の順番は「挨拶 → 共感 → お知らせと URL」で決定済み）
  - [ ] 連絡先リストの作り方（連盟・エリア・1回何社・頻度）／送信の記録の置き場（Notion 専用DB か運営カレンダーか）
  - [ ] 最初の送信前に、公開されている問い合わせ先への連絡が特定電子メール法の例外に当たるか確認
  - [ ] **本文に URL を置かない案（10/18 ふうか検討中）**：知らない相手の URL は開かれにくいので、本文では「オンラインで画面をお見せしながら説明します」と書き、URL は署名欄だけに置く。案と Claude の意見は同ファイルの「10/18 検討中」。決めたら本文に反映
- [ ] **新しい相談所が来たら**：カード登録（counselor /billing）まで済んだかを確認。済むまで kinda.jp には出ない（migration 046）

### サイトの言葉・見せ方

- [ ] **美容の残り3か所を外すか**：サイト全体の meta description（`src/app/layout.tsx`）／`src/app/kinda-act/layout.tsx`／`/about` 本文2か所（「婚活準備の美容室」「婚活前の美容室」）
- [ ] **Kinda のうりとキャッチコピー**。いまは仮で `/about` ②のカードに「担当は、選んでいい。」。うりを先に決めてキャッチを作る。キャッチの検討の正は `docs/brand/catchcopy.md` §5
- [ ] **語源の文は仮で B 案**（「Kinda（カインダ）は、英語の kind of から。…」）。`/about` とトップの ABOUT 欄
- [ ] **`/about` 信じること 04 の書き足しを見て決める**（10/18 ふうか依頼）。act・glow を増やすこと、pair をふたりで開けるようにすることを足した。ブランチ `claude/eloquent-maxwell-c2da87`（PR はまだ）。よければ PR → main
- [ ] **代表紹介の書き方**（前職の実績をどこまで出すか）。JSON-LD の成婚率（月平均5組）は事実なのでそのまま
- [ ] **`/about` に「担当を選べない違和感」の流れを入れるか**（10/10 Claude 提案）。「ふだんは『この人になら話せる』と思ってから相談するのに、専門家のときだけ相手を選べない」のたとえ。一人称は `/about/founder` に
- [ ] **Kinda story に「あなたの物語も、聞かせてください」の入口**（10/10 ふうか案・Claude 賛成）。応募は受けるがそのまま載せない（編集ゲート制）。
      決めること：①フォームの置き場 ②送信先（別テーブルか `/contact` の種別追加か）③プライバシーポリシーに利用目的 ④相手の情報は書かない旨を画面に
- [ ] **Kinda story のサンプル4本（`id: "1" "4" "5" "6"`）の扱い**。サイトに存在しないカウンセラー名（田中 美紀・林 俊介）が署名として残っている。
      8/16 に consent を記録済み（ふうか本人の経験にもとづく物語）なので sitemap に載っている。署名を外すか、下げるか
- [ ] **利用者向けパンフレット**（`/guide` 案・印刷で A4 両面）。誰に渡すか／紙も要るか／中身（handoff `2026-10-15-koyama-profile-and-guide.md` §2）
- [ ] **ハロウィーンのヒーローにするか**（いまは `autumn` のまま。10/1 の予定が過ぎた）。やるなら `docs/sns/seasonal-visuals.md` §5-3 で2枚生成 → 渡す → `CURRENT_SEASON = "halloween"`、11月に `autumn` へ戻す
- [ ] **陽だまりの画像**（今日の天気用・プロンプトは `docs/specs/kinda-note-daily-weather.md` §4-b）→ チャットに貼る → Claude が組み込む
- [ ] **ふうかさん自身の取材記事は、いまは出さない**（10/11 合意）。他のカウンセラーの記事が数本並んだ後に関係を明示して出す
- [ ] **ことさんをサイトに出すか**：クレイ版はなし（10/14 決裁）。出すならぬいぐるみの正規版で。場所と出し方は未定

### SNS

- [ ] **IG bio の3行目を差し替え**（曜日の約束をやめる。案は `docs/sns/ig-week-2026-09.md` §00）
- [ ] **X の方針の確認**（`docs/sns/x-strategy-2026-10.md`：昼は画像・動画／記号で答える問い／リプ回り1日10件／1日3本）。**10/21 判定**（strategy §4）。報告に「返信数」と「その日のリプ回り件数」を足す
- [ ] X のプロフィール固定を駅前の絵（`docs/sns/assets/x/2026-10-w2/1008-ekimae-bango.jpg`）に差し替えたか
- [ ] **今日の天気リール（10/11）の数字**（リーチ・3秒継続率・スキップ率・プロフ遷移）を貼る → Claude が Notion に記入
- [ ] **ふうかさんの声を使う回**を作る（案は `docs/sns/ideas.md` 案6）
- [ ] トーク画面ふうリール（`ideas.md` 案7・LINE そのものに見せない・創作と明記）を作るか
- [ ] プロフィール固定の1枠を「初めて来た人へ」にするか／ハイライト「気持ちの整理」を左端に動かすか（`ig-strategy` §14）
- [ ] **フォロワーが2桁に乗ったらカルーセルを戻すか**
- [ ] note 記事案（`docs/sns/packs/2026-09-25-kousai-shuryo-koukai.md` §3）の本文を書くか

### 計測・GitHub（1回やれば終わり）

- [ ] **GA4 プロパティ（ストリーム）の URL を kinda.jp に**（内部トラフィックは 10/3 判断で除外しない。Claude は「自分のアクセス込み」として読む）
- [ ] **OGP 実機検証**：X／LINE／opengraph.xyz で story・columns・type のカード表示
- [ ] **GA4 DebugView で pair のイベント6種**（`pair_start`／`pair_layer_complete`／`pair_solo_complete`／`pair_copy`／`pair_image_save`／`notify_signup{source:"pair_lp"}`）。
      ⚠️ `notify_signup` の `source` は上の📌1を直すまで DB 側では区別されない（GA4 では区別される）
- [ ] iPhone で `/kinda-pair` 3ページと0件表示の実機確認
- [ ] **VC 管理画面**：一休.comレストラン・ホットペッパーグルメに提携申請 → 承認後 MyLink で `https://restaurant.ikyu.com/117183` のリンク → Claude が `shops.booking_url` を差し替え
- [ ] **不要ブランチの削除**（GitHub UI から。この環境では削除 push が弾かれる）。2026-10-15 の棚卸し：
  - main にマージ済み（消してよい）：`claude/admiring-johnson-pv4xku`・`claude/admiring-knuth-b69bzf`・`claude/awesome-clarke-huzrac`・`claude/fervent-dirac-5v5za3`・
    `claude/focused-fermat-qyj4p9`・`claude/hopeful-gates-mvna7i`・`claude/hoteraba-style-movement-g8xhc7`・`claude/ig-post-2026-10-13-09rxoh`・`claude/nice-einstein-qr7pmi`・
    `claude/note-sky-techo`・`claude/note-today-storage-hint`・`claude/supabase-redirect-urls-03a015`・`claude/sweet-cori-rul5i5`・`claude/x-post-content-oct-12-tuuyqz`・`fix/stripe-idempotency-dispute`
  - 未マージだが役目を終えた：`claude/review-reply-display`・`claude/review-display-tags-reply`・`claude/reel-count-notif-tweak`・
    `claude/stripe-production-deployment-sshgj2`（¥5,500 統一は 10/13 に main で済み）
  - **消さない**：`main`／`claude/fix-profile-creation-1clpG`（counselor 本番）／`claude/futarive-admin-dashboard-iKBfw`（admin 本番）／`claude/counselor-reset-mail-notice`（Supabase メール設定待ち）
  - ほかにリモートブランチが約110本ある。次の棚卸しで「最後のコミットが2か月以上前」を一覧にする

---

## 🟣 Claude がすぐやれる（ふうかさんの判断は不要か、済んでいる）

> 📌 の4件のあと、空いた時間にここから取る。1つずつ PR。

- [ ] **返金 Webhook が `stripe_refund_id` を保存できていない**（10/13 の返金で null）。`src/app/api/stripe/webhook/route.ts` は `charge.refunds?.data?.[0]` を読むが、いまの API バージョンでは Charge に refunds が入らない → `stripe.refunds.list({ payment_intent })` で取る。急ぎではない（判定は `refunded_at` で動いている）
- [ ] **kinda.jp 側のパスワード条件の表示が「8文字以上」のまま**（Supabase は「10文字以上・英小／英大／数字／記号」）。
      `src/app/login/LoginForm.tsx`・`src/app/auth/reset-password/ResetPasswordForm.tsx`・`src/app/mypage/AccountSettingsSection.tsx` を counselor の `futarive-counselor/lib/password.ts` と同じ条件・言い方に
- [ ] **課金に失敗した予約を運営が課金し直す仕組み**（いまは予約した本人の画面からしか課金が起きない）。`docs/ops/billing-and-refunds.md` §4
- [x] counselor 管理画面に FAQ ページ（10/16 `/faq` 新設・未ログインでも読める）。元の案：返金の充当（📌2 と一緒に）・返金の反映日数（数日〜10日）・課金のタイミング・日程変更では課金しない・Link のメール欄は不要。文言は `billing-and-refunds.md` から
- [ ] **返金 → 充当の実装**（📌2 の規約が決まってから。遅くとも最初の返金相談の前）。充当の表・課金の手前の分岐・課金しないときの連絡先開示とメール・`refund.failed` の受信・/billing に残高（`refund-credit-slide` §4）
- [ ] **kinda.jp 予約：渡す Kinda note の結果を選べるように**（10/13 ふうか案）。まず予約フロー（`src/components/booking/`）と note の結果の保存を調べ、選択肢と画面案を出す
- [ ] **`/note/weather`（天気一覧）の見出しが「入会前」「お見合い後」**。天気ページは中立語彙（CLAUDE.md §2）なので直す
- [ ] **admin の Ignored Build Step**：main では CANCELED になるのは確認済み（10/15）。残りは admin ブランチへの push でビルドが走るか
- [ ] **`counselor.kinda.jp` 化**（1社目に招待リンクを送る前に）。Claude：Vercel へのドメイン追加・コード内の `futarive-counselor.vercel.app` の書き換え・`supabase-auth-email.md` とログイン画面の案内文。ふうか：Supabase の Redirect URLs に1行
- [ ] **`claude/counselor-reset-mail-notice`（`2715efe`）を counselor に出す**：Supabase のメール設定（🔴）が済んでから。`claude/fix-profile-creation-1clpG` に cherry-pick
- [ ] **既存ページの読点を少しずつ直す**（触ったついでに。一斉にはやらない）。多い順：`soudanjo-to-konkatsu-app-chigai` 1.55／`kekkon-soudanjo-ryokin-no-mikata` 1.49／`omiai-shodate-fukuso` 1.48／
      `kekkon-soudanjo-kuchikomi-no-mikata` 1.43／`date-plan-by-stage` 1.42／`counselor-de-erabu-soudanjo` 1.39／`weather-sun-break-omiai-tegotae` 1.38／`counselor-tantou-henkou` 1.34
- [x] **X 第3週の投稿**（2026-10-18 作成・10/19〜10/25 の12本・Notion に下書き済）。正は `docs/sns/packs/2026-10-w3-x.md`。朝 B 毎日＋昼に絵3本（#4 ラウンジ・#5 公園・#6 美術館）。**10/24 昼の絵は IG #6 ロビーの絵ができてから 4:5 を作る**
- [ ] **IG 10/19〜10/25 の画像生成**（並びは `docs/sns/packs/2026-10-w3-ig.md`）：10/19 ぎっしり#6 ロビー（書き出し済）・10/21 人の説明書 No.02（`packs/2026-10-21-ig-reel-manual-02.md`）。ふうかさんが ChatGPT で 2:3 → チャットに貼る → Claude が書き出し。10/21 夜に #6 の数字を見て #7（A 改札／B ラウンジの朝）を決める
- [ ] SNS 展開（`/sns-pack`）：みおさんの story ＋「仮交際の連絡頻度」のコラムは組み合わせやすい
- [ ] **コラム「会う頻度・一人の時間」**がまだ無い（連載の l2 系のリンク先に使える）。`/kinda-column`

---

## 🟠 定常運用（リズム・日程の正は Notion 運営カレンダー）

- [ ] **Search Console の登録リクエスト：1日10件**。候補は Claude が出す（登録済みかは Claude から見えないので**多めに出す**）。**出した URL は WORKLOG に残す**。
      リクエスト済み・登録済みの記録：WORKLOG 2026-10-07・10-14・10-15
  - [x] **10/17 の10件**：新規リクエスト3本（`oya-ni-kekkon-sekasareru`・`/kinda-story/atsumi-20s-mayoi`・`/kinda-note/quiz`）／更新したので再リクエスト2本（`/kinda-note`・`/kinda-note/today`）／残り5本は登録済みだった。
        **これまでの候補はすべて片付いた。** 次に出すときは sitemap の全URLから「記録に出てこないもの」と「最近中身を変えたもの」を拾い直す（予備の `/about`・`/for-counselors` は 10/16 更新）
- [ ] **予約枠の補充：次は 10/24 ごろ**（11月分）。小山楓華・毎日 10:00〜20:00 の75分×8コマ・水曜休み。SQL の形は WORKLOG 2026-10-10
- [ ] **IG：投稿の3日後に数字を Notion へ**（とくに送信数）。日ごとの予定の正は `docs/sns/ig-week-2026-09.md` §00（伸びる型を先に・1日1本・ことさんは週1金曜）
  - [x] 冷たい風のカード画像を作り直した（マフラーの絵・10/17 PR #102）
  - [x] 天気カードの作り直し：冷たい風（PR #102）・雷雨・違和感の風・薄日（PR #103・10/17）。陽だまりの小石はそのまま（ふうか）
  - [ ] **次の計測**：ぎっしり#5（10/18・#4 との差を絵で見比べる）／ことさん#7 速い版（10/19・3秒残存35%・平均再生4秒が続ける線）／空の手帳（10/20・並べる型#1 の36%と比べる・コメントに街の名前が来るか）
- [ ] X 日次運用：朝・昼・夜の3枠・リプ全返し・リプ回り。計測は投稿の3日後
- [ ] 週1：`/sns-pack` で翌週分 → Notion 下書き承認／週1（月曜）：数字を貼る → `/sns-review`（CSV は `docs/sns/metrics/`）
- [ ] act：ストック約10店を週1で掲載（ふうかさんは取材ログの体験欄だけ。手順 `docs/guides/kinda-act-log.md`）
- [ ] voices（`/columns`）：週1。act の店と組み合わせたテーマ・内部リンク優先
- [ ] 隔週日曜 8:51（日本時間）：`/repo-tidy` が定期タスクで自動起動（初回 10/25、次 11/8…）。新しいセッションで整理して main に入れ、ふうか待ちの上位5件を報告する

---

## 🟡 次の制作テーマ

- [ ] **Emma 取材（Kinda voices 1本目）**：録音 → Whisper → `/kinda-voices`。実体は `/columns` の「取材レポート」
- [ ] **集客の流れ**（カウンセラーが揃うまで利用者を引き止める・広告）：`docs/research/2026-10-14-shuukyaku-nagare.md`。「集客の流れを考えたい。…を読んで」で始める
- [ ] **Kinda pair の序盤を楽しく**：28の点を灯す案（めくれるカードの反応を見てから。`docs/research/2026-10-12-shohyo-tokyo-ugoki.md` §4）
- [ ] **IG で「note を使ってみた」**（毎日の今日の天気を実際に使った画面で見せる型・ふうか案 10/3）
- [ ] **glow：A 案に決定済み**（店舗一覧を閉じ、「会う前に自分を整える」をコラムで育てる）。戸棚・ナビの扱いを決めて実装
- [ ] Kinda act：コラム「お見合いとデートで、店選びの基準はどう変わるか」／お見合い・デートの読み替え切り替え（店が数件たまってから）
- [ ] Kinda act：席タイプのクレイ画像の残り（テラス／個室／カウンター1列／円卓）。プロンプトは `docs/guides/miniature-image-guide.md`。**1:1 で作る**（一覧は縦長 cover で横長は切れる）
- [ ] Kinda act：ランデブーラウンジ（帝国ホテル 東京）の観察記録が空。ふたり検証をしたら `act_observations` を埋める（埋まるまで4章は出ない）
- [ ] og/twitter の title/description：「カウンセラー個人を選べる」を前に出す表現（キャッチが決まってから）
- [ ] IG のストック（出す日を決めれば使える）：ことさん肯定版「飲み込みがちな人は」（`packs/2026-10-04-ig-reel-koutei-01-nomikomi.md`）／
      間取り「同じ間取り、4つの暮らし」（`packs/ig-reel-madori-trial.md` §7・§8）／ナマケモノの甘やかし2回目「月曜の朝、起きられない日」／木曜の Kinda note 紹介リール（`ig-strategy` §15）

---

## 🔵 中期開発・急がない判断

- [ ] **11月上旬：空の手帳に戻ってくる人がいるかを見る**（10/19 Setlog の調べから・ふうか合意）。Claude が Vercel で `/kinda-note/sky` の数字を確認。戻ってくる人がいれば「今日の街を1枚ストーリーズに出す」を小さく足す。いなければ手帳を直すのが先。正は `docs/research/2026-10-19-setlog.md` §4
- [ ] **カード未登録相談所の予約不可ガード**（いまは kinda.jp に出ない仕組み＝migration 046 で実質塞がっているが、予約 API 側の検証はない）
- [ ] **セキュリティ advisor 残**：slots UPDATE の RPC 化／Security Definer View 権限／anon revoke／search_path 付与／Storage listing 確認／Leaked Password Protection（Supabase Pro 化時に ON・有料なので CLAUDE.md §7-10）
- [ ] **同一ルールの実装ズレ横断監査**：キャンペーン期限・is_demo は共通化済み。残りは is_published と料金表記
- [ ] **運営オペレーション手引き**：自動完了の戻し方／no-show 時の billing_events void／口コミ審査運用（`docs/ops/billing-and-refunds.md` と合わせる）
- [ ] **法務同期の残り**：事業者向け特商法の counselor 管理画面掲載／利用規約・プライバシー・特商法の棚卸し（顧問弁護士レビュー前提）
- [ ] **被リンクの獲得**（コードで解決できない）：①小山さんの所属相談所の公式サイトからの相互リンク ②PR TIMES 等のプレスリリース ③SNS からの回遊
- [ ] **コラムのカテゴリアーカイブ＋ページネーション**（下の📎に設計）。引き金：GSC の登録済みが50本を超えたら／1カテゴリの「他の記事」が25本を超えたら
- [ ] `weatherDescriptions.ts` の `body_essence`／`body_scenes`／`body_science` が未描画（5件分だけデータあり）。天気ページを厚くするならこれを描画してから `/note/weather/[slug]` の noindex を外す
- [ ] `/kinda-pair` に `FAQPage` を付けるか（`docs/site-url-structure.md` §5 と実装指示書 v1.0 §6 で割れている。いまは指示書どおり WebApplication + BreadcrumbList）
- [ ] Kinda pair v1.1 以降：ふたりモード（招待・突き合わせ）＋終了体験（`pair_tombstones`・sha256 は Web Crypto API）／ルームのライフサイクル／担当共有URL（v1.2・オプション）／カウンセラー属性（v1.3）
- [ ] **空の手帳（note today）の今後**（10/18 ふうか案）。どちらか、または両方
      - **街を増やす**：いまは天気1つに街2つ（25都市）。増やすのは `src/app/kinda-note/data/skyCities.ts` に街と一言を足すだけ。地図の点は画像を見て置く（緯度経度から計算しない）。ヨーロッパは点が重なるので、近くの街を並べて出す仕組みに乗る
      - **世界の本当の天気と連動する**：答えから決まった天気と、**いま本当にその天気の街**を選ぶ（「街は天気から決まり、天気は答えから決まる」の決まりは崩さない）。合う街がないときはいまの2択に戻す。
        天気はサーバーで1時間に1回まとめて取って持っておく（利用者ごとに取りに行かない）。一言はその街・その天気の組み合わせごとに要るので、書く量が増える。
        **天気 API の料金を先に確かめる**（Open-Meteo は非商用だけ無料で、Kinda は商用。有料なら CLAUDE.md §7-10 で止まって報告）
- [ ] Kinda Note「任意・匿名の天気共有」データモデル設計（belonging の本命。本文は持たせない）
- [ ] 動的 OGP（@vercel/og）：/note/result 等のシェア画像
- [ ] MyPage 系の PC レイアウト一括調整
- [ ] キャンセル時返金の運用自動化（当面は Stripe ダッシュボード＋個別判断）
- [ ] 営業フェーズ2以降：優遇措置／掲載課金・PR枠／相談所向け使い方ガイド
- [ ] 既存デモ店9件（`is_demo = true`・非公開）に架空の評価が入ったまま。実在店が増えたら消すか評価を0に
- [ ] 小山さんの `area="全国"`・`matching_types=[]` は複数名そろうまで空のままで正しい（1名だけのタイプページが薄くなるため）
- [ ] X/IG 自動投稿 Phase 2（X API 無料枠＋Vercel Cron で Notion → 自動投稿）。効果が出てから
- [ ] 動画パイプライン（image-to-video の選定・月予算）。決まるまで動画系は仮置き
- [ ] admin の MFA 登録（船田さん・任意）
- [ ] `docs/sales/` の既存資料（`kinda-cold-email-v1.html`・`kinda-list-strategy-v1.html`・`kinda-sales-script-v1.html`・`kinda-deck-brief.md`）をフォーム営業の前提に直す（📌2 の返金の書き換えでも触る）

### 💡 アイディアとして保留（やらない）

- **Kinda story に「相談所探しの話」**（10/14 ふうか案）。相談所を比べる話になりやすく、送客料を受ける立場で広告やトラブルに見える。
  やるなら：本人の迷いと過程だけ／相談所名は出さない／Article のみ／status を「相談所を探しているところ」にすればコード変更なしで載る

---

## 📎 変えない決まり・ノウハウ（参照用）

### Search Console
- 登録リクエストは「優先クロール待ち行列に入れる」だけで、保証も高速化もない。1URL 1回で十分。1日の上限は約10件
- 未登録の大半は「検出-未登録」＝読みに来ていない（内容の問題ではない）。効くのは sitemap 再送信・内部リンクの深さ・被リンク
- **投げてはいけない URL**：`/kinda-pair/solo`・`/kinda-note/sky`（noindex）。`/note/weather/[slug]` 20本も noindex
- 「ページ」レポートは2〜3日遅れ

### デプロイ
- main の tip に `src public content package.json next.config.ts tsconfig.json` の差分が無いと本番ビルドがスキップ（CANCELED）。**docs だけのコミットを main の最後に置かない**。マージ後は production が READY か確認
- ユーザーサイトは `git checkout -B <feature> origin/main` から（ローカル main は信用しない）。counselor は `claude/fix-profile-creation-1clpG`、admin は `claude/futarive-admin-dashboard-iKBfw`
- **main 配下の `futarive-counselor/`・`futarive-admin/` のコピーは古い**（稼働ブランチが正）。main 側のサブアプリのコードを信用しない。統合するときは稼働ブランチの middleware（Basic 認証＋admin ロール＋MFA）を残す
- **Preview に `sk_live_` を置かない**（Preview も本番 DB なので、プレビューで予約確定すると本物のカードに課金される）

### admin（futarive-admin）
- 本番の実体は `claude/futarive-admin-dashboard-iKBfw` の Preview デプロイ。`main`／Production 系統はずっと ERROR（無視してよい）
- ふうかさんに Redeploy を頼むときは**どのブランチの行か**まで指定する。env を変えたら Redeploy が必須
- 確認 URL はブランチ固定エイリアス `https://futarive-admin-git-claude-futari-fcf6db-fffkbn84-4095s-projects.vercel.app`。動作確認はシークレットウィンドウで
- Vercel：team `team_PUbgx1RuY5muanExK0tdtY6L`／project `prj_mmGS8duJEM9ymxAiPKX3r4onJ7t6`
- `ADMIN_BASIC_AUTH_USER`／`ADMIN_BASIC_AUTH_PASSWORD` は常にセットで維持（未設定だとフェイルオープン）

### セキュリティ点検で問題なしだったところ（2026-09-09・再点検不要）
- RLS は public の全テーブルで有効。予約・口コミのポリシーは owner ベース。秘密情報のコミットなし
- Stripe webhook は署名検証あり／`/api/stripe/charge` は予約本人のみ／`/api/stripe/refund` は admin 限定／cron は `CRON_SECRET` 必須
- `profiles` は anon から全行読めるが列は `nickname` のみ。**この表にメール・電話を足さない**
- RLS 有効・ポリシー0の3表（`notify_signups`／`counselor_inquiries`／`login_lockouts`）は「全拒否＋service_role のみ」で意図どおり

### Kinda act
- 営業時間・定休日は持たない（Google マップへ渡す）。星は口コミ5件から（`src/lib/reviewDisplay.ts` の `MIN_REVIEWS_FOR_RATING`）
- バッジ名は「行って確かめた」（enum は `certified` のまま）。観察は感想ではなく現象で書く。席のクレイ画像は店ごとではなく席のかたちごと
- シーンの語彙は `お見合い`／`初回デート`／`何度か会ってから`。正は `src/lib/actScenes.ts`。**DB の CHECK 制約と両方を変える**
- 「店の空気」（`fit.atmosphere`）と「客層」（`fit.crowd`）は別の軸。`価格帯 食事1人` はドリンク込み
- お店ページは ISR（5分）。`revalidate` を外さない。新規掲載の slug ルールは `docs/guides/kinda-act-log.md`

### Kinda pair（v1.0）
- Supabase を使わない（solo は `localStorage` のみ）。話題28件の正は `src/lib/pair/topics.ts`
- ％を出さない・実数のみ。連盟差の注記は決まった2行のみ。カウンセラー0件時は「まだ公開していません」＋ `NotifySignup`
- デモはレコードを消さない。ユーザー向け画面は `getPublicCounselors()`（`getCounselors()` は `/kinda-talk?preview=1` と `/for-counselors` の掲載イメージだけ）

### IG・X の型
- 入口は CLAUDE.md §7-b。日ごとの予定は `docs/sns/ig-week-2026-09.md` §00、戦略は `docs/sns/ig-strategy-2026-09.md`、X は `docs/sns/x-strategy-2026-10.md`
- 同じ話題を同じ週に2回出さない／リールは無音で出さない／カバーは1カット目／生成は 1:1（ことさんは 2:3）／`No gold, no brass, no metallic parts.`
- 季節のヒーローは `src/lib/season.ts` の `CURRENT_SEASON` 1行。安全域・プロンプトは `docs/sns/seasonal-visuals.md`。判断は目視でなく実際の表示枠でレンダリングして確かめる
- Kinda story の手順は `/kinda-story` Skill と CLAUDE.md §5。voices は `/columns` の「取材レポート」（`/kinda-voices` Skill）

### コラムのカテゴリアーカイブ（移行するときの設計）
```
/columns                        ハブ（各カテゴリのプレビュー6枚）
  └ /columns/category/[slug]    アーカイブ1ページ目（24本・カードのグリッド）
      └ /columns/category/[slug]/2, /3 ...
```
- ページ送りは必ず `<a href>`／**各ページは自己参照 canonical（2ページ目を1ページ目に canonical しない）**／`rel=next/prev` は不要
- 移行したら消すもの：`ColumnsClient.tsx` の TODO ブロックと `.kv-more-links` の nav、`globals.css` の `.kv-more-links*`

### 🤖 AI運用資産
- Skill：`/sns-pack`・`/sns-review`・`/kinda-column`・`/kinda-voices`・`/kinda-story`・`/repo-tidy`
- QA：`npm run qa:content`（公開前の機械チェック・読点の warn つき）
- 全体像：`docs/ops/ai-ops-playbook.md`／Notion「AI運用手順」「SNS運用マップ」

---

## 🗂 済み・履歴

- 2026-10-15 以前の完了項目・経緯メモ・過ぎた日付の SNS 項目：**`docs/archive/todo-full-archive-2026-10-15.md`**
- 2026-07-02 以前：`docs/archive/todo-full-archive-2026-07-02.md`
- 2026-10-15 の整理で閉じた主なもの：Stripe 本番化（審査・KYC・本番キー・Webhook・実課金の疎通 10/13）／¥5,500 統一（10/13）／
  チャージバック通知と二重課金の印（#88）／`/kinda-pair/solo` の `X-Robots-Tag`（本番ヘッダーで確認 10/15）／
  空の手帳 v0（#93）・pair のめくれるカード（#91）・トップの「× 美容」（#94）／9/20〜10/10 の日付つき IG・X 項目（予定は ig-week §00 に移った）
