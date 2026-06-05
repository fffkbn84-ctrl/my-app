/* 口コミ投稿フローの型定義 */

/**
 * 予約起点の口コミ投稿コンテキスト。
 * ログイン本人の completed 予約に紐づく（認証コード制は廃止）。
 */
export interface ReviewReservationContext {
  reservationId: string;
  counselorId: string;
  counselorName: string;
  agencyName: string;
  meetingDate: string; // ISO 8601 もしくは "YYYY-MM-DD"
}

export interface ReviewToken {
  token: string;
  counselorId: string;
  counselorName: string;
  agencyName: string;
  meetingDate: string; // "YYYY-MM-DD"
  expiresAt: string;   // ISO 8601
  used: boolean;
}

export interface ReviewCategoryRatings {
  friendliness: number;  // 話しやすさ
  noPressure: number;    // 押しつけのなさ
  adviceQuality: number; // 提案・アドバイスの質
  wouldReturn: number;   // また相談したいか
}

export interface ReviewDraft {
  token: string;
  overallRating: number;            // 1–5
  categoryRatings: ReviewCategoryRatings;
  goodTags: string[];               // よかった点タグ
  body: string;                     // 面談の感想
  afterStatus: string;              // 面談後の状況
  ageGroup: string;                 // 年代（任意）
  occupation: string;               // 職業（任意）
}
