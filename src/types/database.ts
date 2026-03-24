export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      columns: {
        Row: {
          body: string
          created_at: string
          id: string
          published_at: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          published_at?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          published_at?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      counselors: {
        Row: {
          address: string | null
          agency_id: string
          area: string | null
          bio: string | null
          created_at: string
          fee: string | null
          id: string
          intro: string | null
          message: string | null
          name: string
          name_kana: string | null
          photo_url: string | null
          qualifications: string[] | null
          specialties: string[] | null
          success_count: number | null
          updated_at: string
          years_of_experience: number | null
        }
        Insert: {
          address?: string | null
          agency_id: string
          area?: string | null
          bio?: string | null
          created_at?: string
          fee?: string | null
          id?: string
          intro?: string | null
          message?: string | null
          name: string
          name_kana?: string | null
          photo_url?: string | null
          qualifications?: string[] | null
          specialties?: string[] | null
          success_count?: number | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Update: {
          address?: string | null
          agency_id?: string
          area?: string | null
          bio?: string | null
          created_at?: string
          fee?: string | null
          id?: string
          intro?: string | null
          message?: string | null
          name?: string
          name_kana?: string | null
          photo_url?: string | null
          qualifications?: string[] | null
          specialties?: string[] | null
          success_count?: number | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "counselors_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          body: string
          created_at: string
          id: string
          published_at: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          published_at?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          published_at?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          counselor_id: string
          created_at: string
          id: string
          notes: string | null
          review_code: string | null
          review_token: string | null
          review_token_used: boolean
          slot_id: string
          updated_at: string
          user_email: string
          user_name: string
          user_phone: string | null
        }
        Insert: {
          counselor_id: string
          created_at?: string
          id?: string
          notes?: string | null
          review_code?: string | null
          review_token?: string | null
          review_token_used?: boolean
          slot_id: string
          updated_at?: string
          user_email: string
          user_name: string
          user_phone?: string | null
        }
        Update: {
          counselor_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          review_code?: string | null
          review_token?: string | null
          review_token_used?: boolean
          slot_id?: string
          updated_at?: string
          user_email?: string
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "slots"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          agency_reply: string | null
          body: string
          counselor_id: string
          created_at: string
          id: string
          rating: number
          reservation_id: string | null
          source_type: Database["public"]["Enums"]["review_source_type"]
          updated_at: string
        }
        Insert: {
          agency_reply?: string | null
          body: string
          counselor_id: string
          created_at?: string
          id?: string
          rating: number
          reservation_id?: string | null
          source_type?: Database["public"]["Enums"]["review_source_type"]
          updated_at?: string
        }
        Update: {
          agency_reply?: string | null
          body?: string
          counselor_id?: string
          created_at?: string
          id?: string
          rating?: number
          reservation_id?: string | null
          source_type?: Database["public"]["Enums"]["review_source_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string | null
          agency_id: string | null
          area: string | null
          badge_type: Database["public"]["Enums"]["shop_badge_type"]
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          photo_url: string | null
          price_range: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          agency_id?: string | null
          area?: string | null
          badge_type?: Database["public"]["Enums"]["shop_badge_type"]
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          photo_url?: string | null
          price_range?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          agency_id?: string | null
          area?: string | null
          badge_type?: Database["public"]["Enums"]["shop_badge_type"]
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          price_range?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shops_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      slots: {
        Row: {
          counselor_id: string
          created_at: string
          end_at: string
          id: string
          locked_until: string | null
          start_at: string
          status: Database["public"]["Enums"]["slot_status"]
          updated_at: string
        }
        Insert: {
          counselor_id: string
          created_at?: string
          end_at: string
          id?: string
          locked_until?: string | null
          start_at: string
          status?: Database["public"]["Enums"]["slot_status"]
          updated_at?: string
        }
        Update: {
          counselor_id?: string
          created_at?: string
          end_at?: string
          id?: string
          locked_until?: string | null
          start_at?: string
          status?: Database["public"]["Enums"]["slot_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "slots_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      review_source_type: "face_to_face" | "proxy"
      shop_badge_type: "certified" | "agency" | "listed"
      slot_status: "open" | "locked" | "booked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      review_source_type: ["face_to_face", "proxy"],
      shop_badge_type: ["certified", "agency", "listed"],
      slot_status: ["open", "locked", "booked"],
    },
  },
} as const
