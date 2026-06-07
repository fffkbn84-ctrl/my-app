export interface FeeItem {
  label: string                  // '入会金' '月会費' '成婚料' or 独自名
  amount: number                 // 円単位（0 = 無料）
  suffix?: string | null         // 表示サフィックス '/月' '/回' '/年' 等。
                                 // 未指定 & amount > 0 なら user-side で「(税込)」自動付与
  note?: string | null           // 補足説明（任意）。「初回のみ」等
}

/** 料金プラン（複数を agencies.fees に持てる） */
export interface FeePlan {
  name: string                   // 'ベーシック' / 'フルサポート' / 独自名
  popular?: boolean              // 「人気」バッジ表示するか
  items: FeeItem[]               // 内訳項目
  notes?: string | null          // プラン単位の注意事項（自由テキスト・複数行可）
  description?: string | null    // 「こんな方向け」1〜2行の対象セグメント
  included?: string[] | null     // 「含まれるもの」箇条書き（短文・3〜6 件想定）
  options?: FeeItem[] | null
}

/** 割引（U30割引・乗り換え割引・学割など）— 料金プランと独立した「お得情報」枠 */
export interface Discount {
  label: string                  // 例: 'U30割引' '乗り換え割引' '学割'
  condition?: string | null      // 例: '29歳以下の方' '他社からの乗り換え'
  amount?: number | null         // 円単位の固定割引額（percent と排他）
  percent?: number | null        // % 表記の割引率（amount と排他）
  note?: string | null           // 例: '他キャンペーンと併用不可'
}

export interface Agency {
  id: string
  name: string
  description: string | null
  website_url: string | null
  owner_user_id: string | null
  logo_url: string | null
  business_hours_text: string | null
  consultation_start_time: string | null
  consultation_end_time: string | null
  closed_weekdays: number[] | null
  default_slot_minutes: number | null
  phone: string | null
  email: string | null
  cancel_deadline_hours: number | null
  cancel_policy: string | null
  fees: FeePlan[]
  discounts: Discount[]
  campaign_text: string | null
  campaign_expires_at: string | null
  founded_at: string | null
  address: string | null
  access: string | null
  directions: string | null
  features: string[]
  required_documents: string[] | null
  general_notes: string | null
  created_at: string
  updated_at: string
}

export interface Counselor {
  id: string
  agency_id: string
  name: string
  name_kana: string | null
  area: string | null
  bio: string | null
  intro: string | null
  message: string | null
  photo_url: string | null
  specialties: string[] | null
  qualifications: string[] | null
  years_of_experience: number | null
  fee: string | null
  success_count: number | null
  experience_label: string | null
  rating_avg: number | null
  review_count: number | null
  catchphrase: string | null
  reel_enabled: boolean
  is_published: boolean
  owner_user_id: string | null
  diagnosis_type: string | null
  invite_token: string | null
  campaign_label: string | null
  campaign_detail: string | null
  campaign_expiry: string | null
  created_at: string
  updated_at: string
}

export interface CounselorMedia {
  id: string
  counselor_id: string
  media_url: string
  media_type: string
  caption: string | null
  display_order: number
  created_at: string
}

/** 015_agency_media で追加。相談所のリール画像メタデータ。 */
export interface AgencyMedia {
  id: string
  agency_id: string
  media_url: string
  media_type: 'image' | 'video'
  caption: string | null
  display_order: number
  fallback_bg: string | null
  created_at: string
  updated_at: string
}

export interface Slot {
  id: string
  counselor_id: string
  start_at: string
  end_at: string
  status: 'open' | 'locked' | 'booked'
  locked_until: string | null
  meeting_type: '対面' | 'オンライン' | null
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  slot_id: string | null
  counselor_id: string | null
  agency_id: string | null
  user_id: string | null
  user_name: string
  user_email: string
  user_phone: string | null
  notes: string | null
  /** @deprecated DB に存在しないカラム。常に undefined。新コードでは notes を使う */
  memo?: string | null
  review_token: string | null
  review_code: string | null
  status: 'active' | 'canceled' | 'completed'
  start_at: string | null
  end_at: string | null
  meeting_type: '対面' | 'オンライン' | null
  counselor_name: string | null
  agency_name: string | null
  canceled_at: string | null
  cancel_reason: string | null
  completed_at: string | null
  agency_message: string | null
  agency_message_at: string | null
  shared_kinda_type_key: 'A' | 'B' | 'C' | 'D' | null
  shared_kinda_type_at: string | null
  shared_kinda_note_key: string | null
  shared_kinda_note_at: string | null
  shared_kinda_note_freetext: string | null
  // Pass 1 (Migration 026/027) で追加した reschedule / cancel フィールド
  cancelled_by: 'user' | 'counselor' | 'system' | null
  reschedule_status: 'requested' | 'approved' | 'expired' | null
  reschedule_requested_by: 'user' | 'counselor' | null
  reschedule_requested_at: string | null
  reschedule_approved_at: string | null
  reschedule_expires_at: string | null
  original_reservation_id: string | null
  reschedule_proposed_start: string | null
  reschedule_proposed_end: string | null
  // Migration 032：カウンセラー発の「第3候補まで」提示用（先頭候補は proposed_* にミラー）
  reschedule_candidates: { start: string; end: string }[] | null
  created_at: string
}

export interface Review {
  id: string
  counselor_id: string
  agency_id: string | null
  rating: number
  body: string
  source_type: 'face_to_face' | 'proxy'
  is_published: boolean
  agency_reply: string | null
  agency_replied_at: string | null
  author_age_range: string | null
  author_gender: string | null
  author_area: string | null
  created_at: string
  /** 紐づく予約 ID（相談日時の参照に使用） */
  reservation_id: string | null
  /** 投稿者の user ID（profiles.nickname の参照に使用） */
  user_id: string | null
  /**
   * 投稿者のニックネーム（profiles.nickname を別取得して付与）。
   * 本名(reservations.user_name)ではなくニックネームを返信タブに出すことで、
   * カウンセラーが誤って本名で返信するのを防ぐ。
   */
  reviewer_nickname?: string | null
  /** 紐づく予約の相談日時（reservations.start_at を別取得して付与） */
  meeting_at?: string | null
}

export interface AgencyContext {
  mode: 'owner' | 'counselor' | 'both'
  ownedAgencies: Agency[]
  selectedAgencyId: string | null
  currentCounselor: Counselor | null
  counselorsInScope: Counselor[]
}
