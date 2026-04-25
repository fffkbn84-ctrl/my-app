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
  created_at: string
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
  slot_id: string
  counselor_id: string
  user_name: string
  user_email: string
  user_phone: string | null
  memo: string | null
  review_token: string | null
  review_code: string | null
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
