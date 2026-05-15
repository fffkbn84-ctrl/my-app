/**
 * ⓘ ツールチップで表示する共通メッセージ。
 * キャンセル規定や料金の補足など、店舗ごとに異なる内容は
 * ここでパターン化しておき、各画面はラッパー関数経由で表示する。
 */

import type { ReactElement } from "react";

interface CancelTooltipParams {
  /** 相談所の cancelPolicy（あれば優先） */
  policy?: string;
  /** 相談所の電話番号（期限後の連絡先表示用） */
  phone?: string;
  /** 相談所のメールアドレス */
  email?: string;
}

/**
 * 予約のキャンセル規定。
 * 相談所固有の policy があれば最初に表示、
 * 期限後の連絡方法と無断キャンセルの帰結は共通文言で続ける。
 */
export function CancelPolicyTooltipContent({
  policy,
  phone,
  email,
}: CancelTooltipParams): ReactElement {
  const liStyle = { margin: "0 0 6px", padding: 0 } as const;
  return (
    <>
      <p style={{ fontWeight: 500, margin: "0 0 6px", color: "var(--ink, #2A2A2A)" }}>
        キャンセルについて
      </p>
      <ul style={{ listStyle: "disc outside", paddingLeft: 18, margin: 0 }}>
        <li style={liStyle}>
          {policy ?? "面談日の前日までキャンセル可能です。"}
        </li>
        <li style={liStyle}>
          キャンセル可能期限後は、相談所へ直接ご連絡ください。
          {(phone || email) && (
            <>
              <br />
              {phone && (
                <span>
                  電話：
                  <a
                    href={`tel:${phone}`}
                    style={{ color: "#8B7355", textDecoration: "underline" }}
                  >
                    {phone}
                  </a>
                </span>
              )}
              {phone && email && <br />}
              {email && (
                <span>
                  メール：
                  <a
                    href={`mailto:${email}`}
                    style={{ color: "#8B7355", textDecoration: "underline" }}
                  >
                    {email}
                  </a>
                </span>
              )}
            </>
          )}
        </li>
        <li style={liStyle}>
          ご連絡のない無断キャンセルが続いた場合、Kinda 経由でのご予約をお受けできなくなることがあります。
        </li>
      </ul>
    </>
  );
}

/**
 * 料金プランの補足。税込・追加料金・最新版確認の3点を共通で。
 * 各店舗固有の note があれば、末尾に追記する想定で渡せる。
 */
export function FeeTooltipContent({
  note,
}: {
  note?: string;
}): ReactElement {
  const liStyle = { margin: "0 0 6px", padding: 0 } as const;
  return (
    <>
      <p style={{ fontWeight: 500, margin: "0 0 6px", color: "var(--ink, #2A2A2A)" }}>
        料金について
      </p>
      <ul style={{ listStyle: "disc outside", paddingLeft: 18, margin: 0 }}>
        <li style={liStyle}>金額はすべて税込で表示しています。</li>
        <li style={liStyle}>
          表示は相談所が登録した時点の金額です。選択するプラン・オプションによって追加料金がかかる場合があります。
        </li>
        <li style={liStyle}>
          最新の料金は、面談時にカウンセラーへご確認ください。
        </li>
        {note && (
          <li style={liStyle} className="kinda-fee-note">
            {note}
          </li>
        )}
      </ul>
    </>
  );
}

/**
 * 「面談料 ¥0 完全無料」表記の補足。
 * 初回面談が無料であること、入会後のプラン料金は別であることを明示。
 */
export function FreeMeetingTooltipContent(): ReactElement {
  const liStyle = { margin: "0 0 6px", padding: 0 } as const;
  return (
    <>
      <p style={{ fontWeight: 500, margin: "0 0 6px", color: "var(--ink, #2A2A2A)" }}>
        面談料について
      </p>
      <ul style={{ listStyle: "disc outside", paddingLeft: 18, margin: 0 }}>
        <li style={liStyle}>
          Kinda 経由でのカウンセラー初回面談は、相談所への手数料も含めて完全無料です。
        </li>
        <li style={liStyle}>
          面談後に相談所へ入会した場合は、相談所が定める入会金・月会費等が発生します。
        </li>
        <li style={liStyle}>
          入会前に納得できなければ、お断りいただいて構いません。
        </li>
      </ul>
    </>
  );
}

/**
 * キャンペーン表記の補足。期限・適用条件・併用可否などを共通文言で。
 * 期限テキスト（例「〜2026-04-30」）が分かれば渡す。
 */
export function CampaignTooltipContent({
  expiry,
}: {
  expiry?: string;
}): ReactElement {
  const liStyle = { margin: "0 0 6px", padding: 0 } as const;
  return (
    <>
      <p style={{ fontWeight: 500, margin: "0 0 6px", color: "var(--ink, #2A2A2A)" }}>
        キャンペーンについて
      </p>
      <ul style={{ listStyle: "disc outside", paddingLeft: 18, margin: 0 }}>
        {expiry && (
          <li style={liStyle}>
            適用期限：<span style={{ fontWeight: 500 }}>{expiry}</span>
          </li>
        )}
        <li style={liStyle}>
          適用条件は相談所により異なります。詳細は面談時にご確認ください。
        </li>
        <li style={liStyle}>
          他キャンペーンとの併用や、すでに会員の方への適用可否は相談所の規定によります。
        </li>
      </ul>
    </>
  );
}

/**
 * お店の価格帯表記の補足。
 * カウンセラー / 相談所の料金プランと違い、お店は時間帯・メニュー・人数で変動するため、
 * 表示はあくまで目安であることを明示。
 */
export function PlacePriceTooltipContent(): ReactElement {
  const liStyle = { margin: "0 0 6px", padding: 0 } as const;
  return (
    <>
      <p style={{ fontWeight: 500, margin: "0 0 6px", color: "var(--ink, #2A2A2A)" }}>
        価格帯について
      </p>
      <ul style={{ listStyle: "disc outside", paddingLeft: 18, margin: 0 }}>
        <li style={liStyle}>
          表示は1人あたりの目安です。注文内容・時間帯・人数によって変動します。
        </li>
        <li style={liStyle}>
          席料・サービス料・お通し代が別途かかる場合があります。
        </li>
        <li style={liStyle}>
          最新のメニュー・価格は、お店のサイトでご確認ください。
        </li>
      </ul>
    </>
  );
}

/**
 * お店の営業時間・定休日表記の補足。
 * 祝日・季節・予約状況で変わることが多いので、再確認を促す。
 */
export function PlaceHoursTooltipContent(): ReactElement {
  const liStyle = { margin: "0 0 6px", padding: 0 } as const;
  return (
    <>
      <p style={{ fontWeight: 500, margin: "0 0 6px", color: "var(--ink, #2A2A2A)" }}>
        営業時間について
      </p>
      <ul style={{ listStyle: "disc outside", paddingLeft: 18, margin: 0 }}>
        <li style={liStyle}>
          祝日や年末年始など、表示と異なる場合があります。
        </li>
        <li style={liStyle}>
          ラストオーダーは閉店時刻より早いことがあります。
        </li>
        <li style={liStyle}>
          ご来店前に、お店のサイトでの確認をおすすめします。
        </li>
      </ul>
    </>
  );
}
