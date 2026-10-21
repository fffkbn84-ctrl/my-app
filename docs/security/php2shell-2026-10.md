# PHP の重大な脆弱性「php2shell」と Kinda への影響（2026-10-21 調査）

> ふうか依頼「PHP のニュースを読んで、Kinda で使っている箇所がないか、影響と対処まで調べて」への回答。
> 調査日：2026-10-21（日本時間の夜。PHP の修正版が出た直後）

## 結論

**Kinda には影響しません。いますぐやることはありません。**

Kinda はどこにも PHP を使っていません。ユーザーサイト・カウンセラー管理画面・運営管理画面はすべて Next.js（Node.js）です。
今回の脆弱性は「PHP 本体」の不具合なので、PHP が動いていない場所には届きません。

## ニュースの中身

| 項目 | 内容 |
|---|---|
| 通称 | php2shell |
| 番号 | CVE-2026-109618 ／ CVE-2026-109619 |
| 深刻度 | CVSS v4.0 で 9.2（Critical）。一部報道は 10.0 としているが公式は 9.2 |
| 何が起きるか | ログイン不要で外からサーバーを乗っ取られる（リモートコード実行）。サーバーのメモリにあるパスワードや API キーを読まれる例も示されている |
| 原因 | メモリの扱いの不具合2件。1つは「メモリ不足の処理で中途半端な状態が残る」。もう1つは「解放したメモリを使い続ける」（Session Upload Progress 機能まわり） |
| 影響する環境 | Web リクエストを受ける PHP すべて。PHP-FPM・Apache の mod_php・php-cgi・FrankenPHP・LiteSpeed。mod_php が最も危ない。WordPress・Laravel・EC-CUBE なども PHP の上で動くので対象 |
| 修正版 | **8.5.12 ／ 8.4.27 ／ 8.3.36 ／ 8.2.35**（2026-10-21 公開。日本時間 22:40 ごろ）。8.1 以前はもう修正が出ない |
| 悪用の状況 | 修正版より先に情報が漏れた。悪用できると称するコードが出回り始めている。Cloudflare は早い段階の攻撃を見て WAF ルールを入れた。公的機関（IPA など）は 10/21 時点で実害を確認していない |
| 国内の動き | 国家サイバー統括室が「PHP を使っているか確認を」と呼びかけ。さくらインターネットが一部機能を停止。Cygames・pixiv などが緊急メンテナンス |

WordPress などのアプリを更新しても直りません。**PHP 本体の更新が必要**です。
設定で一時的に弱める方法（`session.upload_progress.enabled=0` など）も出ていますが、PHP 公式は「安全にはならない。更新だけが完全な対策」としています。

## Kinda で確認したこと

| 確認した場所 | 結果 |
|---|---|
| リポジトリ `fffkbn84-ctrl/my-app`（main と全154ブランチ） | `.php` ファイル・`composer.json` は0件 |
| npm の依存パッケージ（ユーザーサイト・counselor・admin） | PHP を動かすものは0件 |
| Vercel のプロジェクト（3つすべて） | my-app-rp9u・futarive-counselor・futarive-admin。どれも Next.js |
| 本番 `kinda.jp` の応答 | `server: Vercel`。`X-Powered-By: PHP` は出ていない |
| `kinda.jp/index.php`・`kinda.jp/wp-login.php` | Vercel のファイアウォールが 403 で弾いている（`x-vercel-mitigated: deny`）。攻撃の探りが来ても入口がない |
| Supabase（Futarive プロジェクト） | DB は PostgreSQL 17。Edge Functions 2つ（delete-account・notify-stale-profiles）はどちらも TypeScript |
| `kinda.jp` のドメイン | DNS は Vercel。お名前.com は登録だけで、Kinda のサーバーは置いていない |
| 外部サービス（Stripe・Resend・Notion・Instagram など） | 運営会社が管理するもの。Kinda 側で直す手段はなく、直す必要もない |

## Emma のサイト（2026-10-21 追加調査）

ふうか依頼で `https://emmarriage.com/`（agencies テーブルの `website_url`）を外から確認した。攻撃にあたる操作はしていない。普通に開いた応答と公開情報だけを見た。

| 項目 | 結果 |
|---|---|
| 仕組み | **WordPress**（PHP で動く）。テーマ Pro・Contact Form 7 6.0.3・Photo Gallery |
| サーバー | エックスサーバー社の WordPress 専用サーバー **wpX**（IP 183.181.91.9 は XServer Networks／NS は `ns1〜3.wpx.ne.jp`） |
| PHP の版 | 外からは見えない（`X-Powered-By` を出していない）。wpX の管理画面で確認するしかない |
| 今回の脆弱性の対象か | **対象になりうる。** WordPress は PHP-FPM などの上で動くため |
| kinda.jp からのリンク | **なし。** `/agencies/<Emma の id>`・`/kinda-talk`・`/counselors` の本番 HTML に外部サイトへのリンクは出ていない |

- wpX のような WordPress 専用サーバーでは、**PHP 本体の更新はサーバー会社がする**。契約者が自分で PHP を差し替えることはできない
- エックスサーバー社は 10/21 16時から「予防的な安全対策」として公式サイト・管理画面などを止めている。「お客様のご利用サーバーへの影響はございません」「稼働を継続しながら安全対策を進めております」と案内（第三者ブログの引用。公式サイトは調査時点で 503）
- **Emma の運営者がやること**
  1. エックスサーバー（wpX）の管理画面が再開したら、お知らせで PHP 修正版の適用が終わったかを確認する
  2. 管理画面で PHP のバージョンを見る。8.5.12／8.4.27／8.3.36／8.2.35 以上なら済み。8.1 以前を選んでいたら 8.3 以上に切り替える
  3. 適用が終わるまでにお問い合わせフォームから届いた内容に、不審なものがないか見ておく
  4. 今回の件とは別に、WordPress 本体とプラグインの更新もついでに確認する
- フォームには相談者の個人情報が入る。サーバーを乗っ取られた場合に一番困るのはここ
- **ふうかさん（ブログ更新の権限のみ）ができること**（2026-10-21 追記）。サーバー操作は委託会社が持っている
  1. 委託会社に確認の連絡を入れる（PHP の版・修正版の適用・フォームの不審な送信・WordPress とプラグインの更新）
  2. 委託会社から「適用済み」の返事が来てから WordPress のパスワードを変える。先に変えると新しいパスワードも読まれうる
  3. 「PHP の更新が必要です。こちらからログイン」というメールは開かない。騒ぎに乗じた偽メールが出やすい
  4. ブログの更新は続けてよい。投稿しても危険は増えない
  5. 自分のサイトを開いて、見覚えのないページ・別サイトへの勝手な転送・変な広告がないかを見る


## 間接的に気にしておくとよいこと（急ぎではない）

1. **提携する相談所のサイト。** 小さな相談所は WordPress で自社サイトを作っていることが多い。
   いま Kinda のユーザーサイトは相談所の外部サイトへリンクしていない（`website_url` は admin 画面でだけ表示）。なので Kinda の利用者が乗っ取られたサイトへ流れる経路はない。
   将来ユーザーサイトに相談所のリンクを出すときは、リンク先が乗っ取られる可能性を頭に置いておく。
2. **営業の話題として使える。** 相談所に「サイトの PHP は更新済みですか」と一言添えるのは親切。ただし Kinda が保証や代行をする話ではない。
3. **今後 PHP を足さない。** WordPress でブログや LP を別に立てる案が出たら、今回のような緊急更新を自分たちで回す必要が出る。いまの「コラムは MDX、ホスティングは Vercel」の形はこの面でも楽。

## もし PHP を使う場所が見つかったら（将来の手順）

1. PHP のバージョンを確認する（レンタルサーバーなら管理画面）
2. **8.5.12 ／ 8.4.27 ／ 8.3.36 ／ 8.2.35 以上**に上げる。8.1 以前なら 8.3 以上へ移る
3. すぐ上げられないときだけ、一時しのぎとして `session.upload_progress.enabled = 0` と `post_max_size` を小さくする（PHP 公式の暫定策。完全ではない）
4. 上げたあと、サーバーにあったパスワード・API キーを念のため作り直す（メモリを読まれた可能性を消すため）

## 外への発信（2026-10-21 Claude 提案）

**X・IG のフィード／リールのお知らせ投稿はしない。** 理由は4つ。

> **更新（同日・ふうか判断）：IG ストーリーズには出す。** マイページ登録者がいて、近日掲載営業もするため「大丈夫なことは伝えておきたい」。
> ストーリーズは24時間で消え、見るのは既存のフォロワーだけなので、下の 2〜4 の心配がほぼ当たらない。ハイライトには入れない。
> 画像は `docs/sns/assets/story-php-2026-10-21.png`（`render-story.js body none` で作成）。Emma の名前は出さない（Kinda の話と相談所の話を混ぜない）
1. Kinda の利用者にやってもらうことがない。お知らせは「利用者が何かする必要がある時」か「影響があった時」に出すもの
2. 利用者の多くは PHP を知らない。「脆弱性」の語が Kinda の名前と並ぶと、影響がなくても不安だけが残る（§3「焦らせない」）
3. IG は 11/17 まで型を絞っている（strategy §21）。告知の画像はどの型にも当たらず、リーチもほぼ出ない
4. 「うちは影響ありません」投稿は大きな会社が問い合わせを減らすためにするもの。いまの Kinda は問い合わせが来てから個別に返せば足りる

代わりに用意しておくもの：

**問い合わせ・DM への返信**
> Kinda は PHP を使っていないため、10月21日に公表された PHP の脆弱性の影響はありません。サイトはこれまでどおりご利用いただけます。

**提携相談所への連絡（送るかはふうか判断）**
> 件名：PHP の脆弱性についてのご案内
>
> 10月21日に PHP の重大な脆弱性が公表されました。Kinda は PHP を使っていないため影響はありません。
>
> ホームページを WordPress などで運営されている場合は、サーバーの PHP が更新されているか一度ご確認ください。レンタルサーバーなら管理画面でバージョンを見られます。修正済みの版は 8.5.12・8.4.27・8.3.36・8.2.35 です。
>
> 作業の方法は制作会社かサーバー会社にご相談ください。

**どうしても X に出す場合の最小形**（画像なし・1回だけ）
> 10月21日に公表された PHP の脆弱性について。Kinda は PHP を使っていないため影響はありません。これまでどおりご利用いただけます。

## 出典

- PHP 公式：[php.net news archive 2026](https://www.php.net/archive/2026.php)
- [GMO Flatt Security：php2shell の概要と対応指針](https://blog.flatt.tech/entry/php2shell)
- [piyolog：修正予告された PHP の2件の深刻な脆弱性についてまとめてみた](https://piyolog.hatenadiary.jp/entry/2026/10/21/174516)
- [@IT：パッチ公開まで待てない GMO が示した暫定策と注意点](https://atmarkit.itmedia.co.jp/ait/articles/2610/21/news072.html)
- [日経クロステック：さくらや Cygames、pixiv など緊急メンテナンス](https://xtech.nikkei.com/atcl/nxt/column/18/00001/12112/)
- [ma.ttias.be：early mitigation steps](https://ma.ttias.be/php-cve-2026-109618-early-mitigation/)
- [Huntress：Leaked Critical PHP Vulnerabilities](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)
- [Sansec：Critical PHP RCE](https://sansec.io/research/php2shell)
- [Patchstack：PHP vulnerable to critical RCE](https://patchstack.com/articles/php-major-vulnerability-alert-10-2026/)
- [Infosecurity Magazine：Critical PHP Vulnerabilities Leaked Ahead of Scheduled Security Patch](https://www.infosecurity-magazine.com/news/critical-php-vulnerabilities-leaked/)
