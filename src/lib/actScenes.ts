/**
 * Kinda act のシーン語彙。ここが正。
 *
 * どの店をどの場面で使えるかを表す言葉。判定の基準は
 * **店を出たあとに行き先が要るかどうか**。
 *
 * - お見合い       … 1時間で解散する。二軒目に移らないので、周りに何もなくても成立する
 * - 初回デート     … 二軒目に移ることがある。ここだけが周辺環境に依存する
 * - 何度か会ってから … 場所に会話を助けてもらう必要がない段階
 *
 * `shops.scenes` は Postgres の text[] で、型の上ではどんな文字列も入る。
 * 「何度か会ってから」と「何回か会ってから」のような表記ゆれが混ざると、
 * 同じ意味のシーンが2つに割れて絞り込みが壊れる。そうならないよう
 * 語彙をここ1箇所に置き、DB 側にも実在店だけに CHECK 制約をかけている
 * （shops_real_scenes_vocabulary）。**片方だけ直さない。**
 *
 * 語彙を増やすときは、この配列と DB の制約の両方を変える。
 */
export const ACT_SCENES = ["お見合い", "初回デート", "何度か会ってから"] as const;

export type ActScene = (typeof ACT_SCENES)[number];

/** 語彙に入っているシーン名か */
export function isActScene(value: string): value is ActScene {
  return (ACT_SCENES as readonly string[]).includes(value);
}

/**
 * 表示順を ACT_SCENES の並び（関係が進む順）にそろえる。
 *
 * 語彙の外の値は捨てずに末尾へ回す。掲載中のサンプル9件が旧語彙
 * （準備／デート／プロフィール作成）を持ったままなので、消すと
 * 「こんなシーンに」の欄が空になる。データを黙って隠すより、
 * 出したうえで DB 制約に実在店を守らせるほうが安全。
 */
export function sortActScenes(scenes: readonly string[]): string[] {
  const known = ACT_SCENES.filter((s) => scenes.includes(s));
  const unknown = scenes.filter((s) => !isActScene(s));
  return [...known, ...unknown];
}
