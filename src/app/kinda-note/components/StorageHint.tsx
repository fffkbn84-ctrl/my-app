"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * ゲスト向けの「記録はこのブラウザに残る」の一言（2026-10-14）。
 * docs/research/2026-10-12-shohyo-tokyo-ugoki.md §5。80億分の1 と同じく、消える場面を先に軽く伝える。
 * - IG・LINE などのアプリ内ブラウザは Safari と記録が別になる
 * - iOS Safari はしばらく開かないと記録を消すことがある
 * 重く言わない（気軽に続けてほしい）。ログイン中は出さない。
 * 結果画面（操作のあと）にだけ置くので、navigator を初期値で読んでも SSR とずれない。
 */

const IN_APP = /Instagram|FBAN|FBAV|Line\/|Twitter|TikTok|musical_ly/i;

export default function StorageHint({ color }: { color: string }) {
  const { user } = useAuth();
  const [inApp] = useState(
    () => typeof navigator !== "undefined" && IN_APP.test(navigator.userAgent)
  );
  if (user) return null;

  return (
    <p style={{ fontSize: 11.5, lineHeight: 1.9, color, margin: "-8px 0 24px" }}>
      {inApp ? (
        <>
          アプリの中で開いていると、記録はそのアプリの中に残ります。
          続けてつけるなら Safari や Chrome で開いておくと見返しやすいです。
        </>
      ) : (
        <>
          記録はこのブラウザに残ります。しばらく開かないと消えることもあるので、
          <Link href="/login" style={{ color, textDecoration: "underline", textUnderlineOffset: 3 }}>
            ログイン
          </Link>
          しておくと安心です。
        </>
      )}
    </p>
  );
}
