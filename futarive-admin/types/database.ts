export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          created_at?: string
        }
      }
      counselors: {
        Row: {
          id: string
          agency_id: string | null
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
          experience_label: string | null
          fee: number | null
          success_count: number | null
          quote: string | null
          rating_avg: number | null
          review_count: number | null
          diagnosis_type: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          agency_id?: string | null
          name: string
          name_kana?: string | null
          area?: string | null
          bio?: string | null
          intro?: string | null
          message?: string | null
          photo_url?: string | null
          specialties?: string[] | null
          qualifications?: string[] | null
          years_of_experience?: number | null
          experience_label?: string | null
          fee?: number | null
          success_count?: number | null
          quote?: string | null
          rating_avg?: number | null
          review_count?: number | null
          diagnosis_type?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string | null
          name?: string
          name_kana?: string | null
          area?: string | null
          bio?: string | null
          intro?: string | null
          message?: string | null
          photo_url?: string | null
          specialties?: string[] | null
          qualifications?: string[] | null
          years_of_experience?: number | null
          experience_label?: string | null
          fee?: number | null
          success_count?: number | null
          quote?: string | null
          rating_avg?: number | null
          review_count?: number | null
          diagnosis_type?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          counselor_id: string | null
          reservation_id: string | null
          rating: number
          body: string
          source_type: 'face_to_face' | 'proxy'
          agency_reply: string | null
          is_published: boolean
          reviewer_age_range: string | null
          reviewer_gender: string | null
          reviewer_area: string | null
          created_at: string
        }
        Insert: {
          id?: string
          counselor_id?: string | null
          reservation_id?: string | null
          rating: number
          body: string
          source_type: 'face_to_face' | 'proxy'
          agency_reply?: string | null
          is_published?: boolean
          reviewer_age_range?: string | null
          reviewer_gender?: string | null
          reviewer_area?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          counselor_id?: string | null
          reservation_id?: string | null
          rating?: number
          body?: string
          source_type?: 'face_to_face' | 'proxy'
          agency_reply?: string | null
          is_published?: boolean
          reviewer_age_range?: string | null
          reviewer_gender?: string | null
          reviewer_area?: string | null
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          slot_id: string | null
          counselor_id: string | null
          user_name: string
          user_email: string
          user_phone: string | null
          notes: string | null
          review_token: string | null
          review_code: string | null
          review_token_used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slot_id?: string | null
          counselor_id?: string | null
          user_name: string
          user_email: string
          user_phone?: string | null
          notes?: string | null
          review_token?: string | null
          review_code?: string | null
          review_token_used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slot_id?: string | null
          counselor_id?: string | null
          user_name?: string
          user_email?: string
          user_phone?: string | null
          notes?: string | null
          review_token?: string | null
          review_code?: string | null
          review_token_used?: boolean
          created_at?: string
        }
      }
      slots: {
        Row: {
          id: string
          counselor_id: string | null
          start_at: string
          end_at: string
          status: 'open' | 'locked' | 'booked'
          locked_until: string | null
          created_at: string
        }
        Insert: {
          id?: string
          counselor_id?: string | null
          start_at: string
          end_at: string
          status?: 'open' | 'locked' | 'booked'
          locked_until?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          counselor_id?: string | null
          start_at?: string
          end_at?: string
          status?: 'open' | 'locked' | 'booked'
          locked_until?: string | null
          created_at?: string
        }
      }
      shops: {
        Row: {
          id: string
          agency_id: string | null
          name: string
          category: string | null
          description: string | null
          address: string | null
          area: string | null
          photo_url: string | null
          badge_type: 'certified' | 'agency' | 'listed'
          price_range: string | null
          tags: string[] | null
          features: string[] | null
          hours: string | null
          holiday: string | null
          access: string | null
          scenes: string[] | null
          rating_avg: number | null
          review_count: number | null
          stage: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          agency_id?: string | null
          name: string
          category?: string | null
          description?: string | null
          address?: string | null
          area?: string | null
          photo_url?: string | null
          badge_type?: 'certified' | 'agency' | 'listed'
          price_range?: string | null
          tags?: string[] | null
          features?: string[] | null
          hours?: string | null
          holiday?: string | null
          access?: string | null
          scenes?: string[] | null
          rating_avg?: number | null
          review_count?: number | null
          stage?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string | null
          name?: string
          category?: string | null
          description?: string | null
          address?: string | null
          area?: string | null
          photo_url?: string | null
          badge_type?: 'certified' | 'agency' | 'listed'
          price_range?: string | null
          tags?: string[] | null
          features?: string[] | null
          hours?: string | null
          holiday?: string | null
          access?: string | null
          scenes?: string[] | null
          rating_avg?: number | null
          review_count?: number | null
          stage?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
      episodes: {
        Row: {
          id: string
          agency_id: string | null
          counselor_id: string | null
          title: string
          slug: string
          body: string | null
          excerpt: string | null
          thumbnail_url: string | null
          quote: string | null
          tags: string[] | null
          story: string[] | null
          period: string | null
          year: number | null
          sympathy_count: number
          is_published: boolean
          published_at: string | null
          person1_initial: string | null
          person1_age: number | null
          person1_color: string | null
          person2_initial: string | null
          person2_age: number | null
          person2_color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agency_id?: string | null
          counselor_id?: string | null
          title: string
          slug: string
          body?: string | null
          excerpt?: string | null
          thumbnail_url?: string | null
          quote?: string | null
          tags?: string[] | null
          story?: string[] | null
          period?: string | null
          year?: number | null
          sympathy_count?: number
          is_published?: boolean
          published_at?: string | null
          person1_initial?: string | null
          person1_age?: number | null
          person1_color?: string | null
          person2_initial?: string | null
          person2_age?: number | null
          person2_color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string | null
          counselor_id?: string | null
          title?: string
          slug?: string
          body?: string | null
          excerpt?: string | null
          thumbnail_url?: string | null
          quote?: string | null
          tags?: string[] | null
          story?: string[] | null
          period?: string | null
          year?: number | null
          sympathy_count?: number
          is_published?: boolean
          published_at?: string | null
          person1_initial?: string | null
          person1_age?: number | null
          person1_color?: string | null
          person2_initial?: string | null
          person2_age?: number | null
          person2_color?: string | null
          created_at?: string
        }
      }
      columns: {
        Row: {
          id: string
          title: string
          slug: string
          body: string | null
          thumbnail_url: string | null
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          body?: string | null
          thumbnail_url?: string | null
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          body?: string | null
          thumbnail_url?: string | null
          published_at?: string | null
          created_at?: string
        }
      }
      diagnosis_results: {
        Row: {
          id: string
          session_id: string | null
          result_type: string
          answers: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          result_type: string
          answers: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          result_type?: string
          answers?: Json
          created_at?: string
        }
      }
    }
  }
}

export type AgencyRow = Database['public']['Tables']['agencies']['Row']
export type CounselorRow = Database['public']['Tables']['counselors']['Row']
export type ReviewRow = Database['public']['Tables']['reviews']['Row']
export type ReservationRow = Database['public']['Tables']['reservations']['Row']
export type SlotRow = Database['public']['Tables']['slots']['Row']
export type ShopRow = Database['public']['Tables']['shops']['Row']
export type EpisodeRow = Database['public']['Tables']['episodes']['Row']
export type ColumnRow = Database['public']['Tables']['columns']['Row']
