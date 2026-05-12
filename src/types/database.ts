export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string;
          name: string;
          area: string | null;
          description: string | null;
          logo_url: string | null;
          website_url: string | null;
          /* 007_reservations_user_id_status.sql で追加 */
          phone: string | null;
          email: string | null;
          cancel_deadline_hours: number;
          cancel_policy: string | null;
          /* 004_add_agency_hours.sql で追加（user-site では business_hours_text→hours、
             closed_weekdays(number[])→holiday(文字列) に変換して扱う） */
          business_hours_text: string | null;
          closed_weekdays: number[] | null;
          /* 013_agencies_location_and_directions.sql で追加 */
          address: string | null;
          access: string | null;
          directions: string | null;
          /* 014_agencies_discounts.sql で追加 */
          discounts: Json;
          /* 016_agencies_features.sql で追加 */
          features: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["agencies"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agencies"]["Insert"]>;
      };
      counselors: {
        Row: {
          id: string;
          agency_id: string;
          name: string;
          bio: string | null;
          photo_url: string | null;
          specialties: string[] | null;
          years_of_experience: number | null;
          rating_avg: number | null;
          review_count: number | null;
          diagnosis_type: string | null;
          is_published: boolean | null;
          quote: string | null;
          experience_label: string | null;
          /* 002_kinda_talk_extensions.sql で追加 */
          catchphrase: string | null;
          intro: string | null;
          area: string | null;
          role: string | null;
          qualifications: string[] | null;
          fee: string | null;
          matching_types: string[] | null;
          is_demo: boolean | null;
          reel_enabled: boolean | null;
          reel_order: number | null;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["counselors"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["counselors"]["Insert"]>;
      };
      counselor_media: {
        Row: {
          id: string;
          counselor_id: string;
          media_url: string;
          media_type: "image" | "video";
          caption: string | null;
          display_order: number;
          fallback_bg: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["counselor_media"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["counselor_media"]["Insert"]>;
      };
      /* 015_agency_media.sql で追加 */
      agency_media: {
        Row: {
          id: string;
          agency_id: string;
          media_url: string;
          media_type: "image" | "video";
          caption: string | null;
          display_order: number;
          fallback_bg: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["agency_media"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agency_media"]["Insert"]>;
      };
      slots: {
        Row: {
          id: string;
          counselor_id: string;
          start_at: string;
          end_at: string;
          status: "open" | "locked" | "booked";
          locked_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["slots"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["slots"]["Insert"]>;
      };
      reservations: {
        Row: {
          id: string;
          slot_id: string | null;
          counselor_id: string | null;
          user_name: string;
          user_email: string;
          user_phone: string | null;
          notes: string | null;
          review_token: string | null;
          review_code: string | null;
          review_token_used: boolean;
          /* 007_reservations_user_id_status.sql で追加 */
          user_id: string | null;
          status: "active" | "canceled" | "completed";
          canceled_at: string | null;
          cancel_reason: string | null;
          start_at: string | null;
          end_at: string | null;
          meeting_type: "対面" | "オンライン" | null;
          agency_id: string | null;
          counselor_name: string | null;
          agency_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reservations"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          counselor_id: string;
          reservation_id: string | null;
          rating: number;
          body: string;
          source_type: "face_to_face" | "proxy";
          agency_reply: string | null;
          is_published: boolean | null;
          reviewer_age_range: string | null;
          reviewer_gender: string | null;
          reviewer_area: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      shops: {
        Row: {
          id: string;
          agency_id: string | null;
          name: string;
          category: string | null;
          description: string | null;
          address: string | null;
          photo_url: string | null;
          badge_type: "certified" | "agency" | "listed";
          rating_avg: number | null;
          review_count: number | null;
          stage: string | null;
          is_published: boolean | null;
          features: string[] | null;
          hours: string | null;
          holiday: string | null;
          access: string | null;
          scenes: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["shops"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shops"]["Insert"]>;
      };
      columns: {
        Row: {
          id: string;
          title: string;
          slug: string;
          body: string;
          thumbnail_url: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["columns"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["columns"]["Insert"]>;
      };
      episodes: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          body: string | null;
          thumbnail_url: string | null;
          published_at: string | null;
          agency_id: string | null;
          counselor_id: string | null;
          period: string | null;
          year: string | null;
          excerpt: string | null;
          story: string[] | null;
          quote: string | null;
          tags: string[] | null;
          sympathy_count: number | null;
          is_published: boolean | null;
          person1_initial: string | null;
          person1_age: number | null;
          person1_color: string | null;
          person2_initial: string | null;
          person2_age: number | null;
          person2_color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["episodes"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["episodes"]["Insert"]>;
      };
      diagnosis_results: {
        Row: {
          id: string;
          session_id: string | null;
          result_type: string;
          answers: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["diagnosis_results"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["diagnosis_results"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      slot_status: "open" | "locked" | "booked";
      review_source_type: "face_to_face" | "proxy";
      shop_badge_type: "certified" | "agency" | "listed";
    };
  };
}
