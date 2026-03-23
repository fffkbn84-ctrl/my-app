/* 口コミ投稿フォームの型定義 */

export interface ReviewToken {
  token: string;
  counselorId: string;
  counselorName: string;
  agencyName: string;
  meetingDate: string; // "YYYY-MM-DD"
  expiresAt: string;   // ISO 8601
  used: boolean;
}

export interface ReviewRatings {
  overall: number;      // 総合 1-5
  friendliness: number; // 話しやすさ
  expertise: number;    // 専門知識
  proposal: number;     // 提案力
  support: number;      // サポート
}

export interface ReviewDraft {
  token: string;
  ratings: ReviewRatings;
  title: string;
  body: string;
  authorLabel: string; // "30代・女性" など（表示用・匿名）
}
