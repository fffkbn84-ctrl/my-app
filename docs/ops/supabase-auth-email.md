# Supabase Auth のメール（送信元・文面）の正

> 2026-10-11 新設。パスワード再設定メールが英語・送信元「Supabase Auth」で届き、
> カウンセラーが Kinda からのメールと気づけないおそれがあったため。
> Supabase プロジェクトは kinda.jp（利用者）と counselor 管理画面で**1つを共用**している。
> ここの文面は両方に届くので、どちらが読んでも通じる書き方にしてある。

## 1. 送信元を Kinda にする（Custom SMTP・Resend）

Supabase 標準の送信は、送信元が `noreply@mail.app.supabase.io`・名前「Supabase Auth」。
**1時間に数通までの上限**があり、本番用ではないと Supabase 自身が書いている。
予約メールで使っている Resend（`send.kinda.jp` は認証済み）に寄せる。**費用はかからない**（Resend 無料枠 3,000通/月の中）。

### 手順（ふうかさん）

1. Resend → **API Keys** → Create API Key
   - Name：`supabase-auth`／Permission：**Sending access**／Domain：`send.kinda.jp`
   - 出たキーはこの画面でしか見られない。そのまま次の手順に貼る（どこにも保存しない・チャットに貼らない）
2. Supabase → **Authentication → Emails → SMTP Settings** → Enable Custom SMTP をオン

| 項目 | 値 |
|---|---|
| Sender email | `noreply@send.kinda.jp` |
| Sender name | `Kinda` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | 手順1の API キー |

3. 保存後、counselor の「パスワードを忘れた方」で自分宛てに1通送り、送信元が `Kinda <noreply@send.kinda.jp>` になったかを見る

- Custom SMTP にすると、Supabase の送信上限（Authentication → Rate Limits の「Emails sent」）が既定で 30通/時 になる。足りなければそこで上げる
- 届かないときは Resend → **Emails / Logs** に記録があるかを見る（Supabase 側で止まったのか、Resend 側で止まったのかが分かれる）

## 2. 文面を日本語にする（Email Templates）

Supabase → **Authentication → Emails → Templates**。いま使っているのは下の3種類。
それ以外（Magic Link・Invite user・Reauthentication）はコードから呼んでいないので触らなくてよい。

| テンプレート | 使われる場面 |
|---|---|
| Reset Password | counselor「パスワードを忘れた方」／kinda.jp ログイン画面「パスワードを忘れた方」 |
| Confirm signup | counselor 招待からの新規登録／kinda.jp の新規登録 |
| Change Email Address | kinda.jp マイページのメールアドレス変更 |

`{{ .ConfirmationURL }}` は Supabase が差し込むリンク。**消さない・書き換えない**。

### Reset Password

件名：

```
【Kinda】パスワード再設定のご案内
```

本文（Source に貼る）：

```html
<p>Kinda をご利用いただきありがとうございます。</p>
<p>パスワード再設定のお申し込みを受け付けました。<br>
下のリンクを開いて、新しいパスワードを設定してください。</p>
<p><a href="{{ .ConfirmationURL }}">パスワードを再設定する</a></p>
<p>リンクは、お申し込みをしたのと同じ端末・同じブラウザで開いてください。<br>
有効期限は1時間です。期限が過ぎたときは、ログイン画面の「パスワードを忘れた方」からもう一度お申し込みください。</p>
<p>お申し込みに心当たりがない場合は、このメールは破棄してください。パスワードは変わりません。</p>
<p>──<br>
Kinda（運営：AGOGLIFE株式会社）<br>
https://kinda.jp<br>
このメールは送信専用です。お問い合わせは hello@kinda.jp まで。</p>
```

### Confirm signup

件名：

```
【Kinda】メールアドレスの確認
```

本文：

```html
<p>Kinda へのご登録ありがとうございます。</p>
<p>下のリンクを開くと、メールアドレスの確認が終わり、登録が完了します。</p>
<p><a href="{{ .ConfirmationURL }}">メールアドレスを確認する</a></p>
<p>カウンセラーの方へ：リンクを開いたあと、招待リンクの画面に戻って「引き継ぎを実行」を押してください。</p>
<p>ご登録に心当たりがない場合は、このメールは破棄してください。</p>
<p>──<br>
Kinda（運営：AGOGLIFE株式会社）<br>
https://kinda.jp<br>
このメールは送信専用です。お問い合わせは hello@kinda.jp まで。</p>
```

### Change Email Address

件名：

```
【Kinda】メールアドレス変更の確認
```

本文：

```html
<p>Kinda のメールアドレスを {{ .Email }} から {{ .NewEmail }} に変更するお申し込みを受け付けました。</p>
<p>下のリンクを開くと、変更が完了します。</p>
<p><a href="{{ .ConfirmationURL }}">メールアドレスの変更を確定する</a></p>
<p>お申し込みに心当たりがない場合は、このメールは破棄し、hello@kinda.jp までご連絡ください。</p>
<p>──<br>
Kinda（運営：AGOGLIFE株式会社）<br>
https://kinda.jp<br>
このメールは送信専用です。</p>
```

## 3. 画面との対応

counselor の「パスワードを忘れた方」は、送ったあとに
「送信元 `noreply@send.kinda.jp`・件名『【Kinda】パスワード再設定のご案内』」と画面に出す（2026-10-11）。
**件名や送信元を変えたら、画面の文言も合わせる**（`futarive-counselor/app/(auth)/login/page.tsx`）。

## 4. 関連する Supabase の設定（2026-10-11 時点）

- Site URL：`https://kinda.jp`（10/11 まで `http://localhost:3000` だった）
- Redirect URLs：`https://futarive-counselor.vercel.app/**`／`https://kinda.jp/**`／`https://www.kinda.jp/**`
  - `counselor.kinda.jp` に移すときは `https://counselor.kinda.jp/**` を足す
- パスワード：10文字以上・英小文字／英大文字／数字／記号を各1つ以上。
  **変えたら `futarive-counselor/lib/password.ts` と kinda.jp 側の表示も合わせる**
