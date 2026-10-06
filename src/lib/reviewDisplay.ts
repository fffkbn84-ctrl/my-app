/**
 * 平均評価（星）の出し方の共通ルール。
 *
 * 口コミが 1〜2 件のうちは平均が振れすぎる。たまたま最初の一人が辛口
 * だっただけのお店が「★2.0」に見えてしまい、逆に一人が満点をつけただけの
 * お店が「★5.0」になる。どちらも実態を表していないうえ、掲載したての
 * 実在店にとっては不利益になる。
 *
 * 件数が溜まるまでは平均を出さず、口コミの件数だけを出す。
 * お店・カウンセラーで基準を揃えるため、しきい値はここ一箇所に置く。
 */
export const MIN_REVIEWS_FOR_RATING = 5;

/** 平均評価を表示してよい件数に達しているか */
export function hasEnoughReviewsForRating(reviewCount: number | null | undefined): boolean {
  return (reviewCount ?? 0) >= MIN_REVIEWS_FOR_RATING;
}
