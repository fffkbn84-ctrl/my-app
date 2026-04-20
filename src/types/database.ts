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
          catchphrase: string | null;
          reel_enabled: boolean | null;
          reel_order: number | null;
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
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["counselor_media"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["counselor_media"]["Insert"]>;
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
          slot_id: string;
          counselor_id: string;
          user_name: string;
          user_email: string;
          user_phone: string | null;
          notes: string | null;
          review_token: string | null;
          review_code: string | null;
          review_token_used: boolean;
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
