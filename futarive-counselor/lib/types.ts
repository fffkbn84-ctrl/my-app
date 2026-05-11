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
}

export interface Agency {
  id: string
  name: string
  description: string | null
  website_url: string | null
  owner_user_id: string | null
  business_hours_text: string | null
  consultation_start_time: string | null  // "HH:mm:ss" or "HH:mm"
  consultation_end_time: string | null
  closed_weekdays: number[] | null         // 0=日 ... 6=土
  default_slot_minutes: number | null      // 1枠あたりの所要時間（分）
  phone: string | null                     // キャンセル期限超過時の連絡先
  email: string | null
  cancel_deadline_hours: number | null     // キャンセル期限（時間前）
  cancel_policy: string | null             // キャンセルポリシー本文
  fees: FeePlan[]                          // 料金プラン配列（複数プラン対応・税込）
  campaign_text: string | null             // キャンペーン本文
  campaign_expires_at: string | null       // キャンペーン有効期限 ISO 文字列
  founded_at: string | null                // 創業日 'YYYY-MM-DD'（NULL なら新店舗バッジ非表示）
  /* 013_agencies_location_and_directions で追加：会場へのアクセス情報 */
  address: string | null                   // 所在地（フリーテキスト）
  access: string | null                    // 最寄駅などの簡潔なアクセス（例：銀座駅 徒歩3分）
  directions: string | null                // 最寄駅からの行き方（フリーテキスト、改行可）
  created_at: string                       // Supabase 登録日（参考のみ）
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
  created_at: string
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

export interface Slot {
  id: string
  counselor_id: string
  start_at: string
  end_at: string
  status: 'open' | 'locked' | 'booked'
  locked_until: string | null
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
  memo: string | null
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
}

export interface AgencyContext {
  mode: 'owner' | 'counselor' | 'both'
  ownedAgencies: Agency[]
  selectedAgencyId: string | null
  currentCounselor: Counselor | null
  counselorsInScope: Counselor[]
}
