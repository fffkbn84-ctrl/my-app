export interface Agency {
  id: string
  name: string
  description: string | null
  website_url: string | null
  owner_user_id: string | null
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
  start_time: string
  end_time: string
  status: 'open' | 'locked' | 'booked'
  created_at: string
}

export interface Reservation {
  id: string
  slot_id: string | null
  counselor_id: string | null
  user_name: string
  user_email: string
  user_phone: string | null
  notes: string | null
  review_token: string | null
  review_code: string | null
  created_at: string
  // Pass 1 で追加したフィールド
  status: 'active' | 'canceled' | 'completed'
  start_at: string | null
  end_at: string | null
  meeting_type: string | null
  agency_id: string | null
  counselor_name: string | null
  agency_name: string | null
  cancelled_by: 'user' | 'counselor' | 'system' | null
  reschedule_status: 'requested' | 'approved' | 'expired' | null
  reschedule_requested_by: 'user' | 'counselor' | null
  reschedule_requested_at: string | null
  reschedule_approved_at: string | null
  reschedule_expires_at: string | null
  original_reservation_id: string | null
  reschedule_proposed_start: string | null
  reschedule_proposed_end: string | null
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
