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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string
          id: string
          is_mutual: boolean | null
          updated_at: string
          user1_id: string
          user1_liked: boolean | null
          user2_id: string
          user2_liked: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_mutual?: boolean | null
          updated_at?: string
          user1_id: string
          user1_liked?: boolean | null
          user2_id: string
          user2_liked?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          is_mutual?: boolean | null
          updated_at?: string
          user1_id?: string
          user1_liked?: boolean | null
          user2_id?: string
          user2_liked?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range_max: number | null
          age_range_min: number | null
          ascendant_sign_index: number | null
          atmakaraka_planet: string | null
          bio: string | null
          birth_latitude: number
          birth_location: string
          birth_longitude: number
          birth_time: string
          birth_timezone: number
          created_at: string
          darakaraka_planet: string | null
          date_of_birth: string
          element: string | null
          gender: string | null
          id: string
          is_manglik: boolean | null
          location_preference: string | null
          looking_for: string | null
          manglik_cancelled: boolean | null
          moon_nakshatra_index: number | null
          moon_sign_index: number | null
          name: string
          onboarding_complete: boolean | null
          photo_1: string | null
          photo_2: string | null
          updated_at: string
          user_id: string
          vedic_chart: Json | null
        }
        Insert: {
          age_range_max?: number | null
          age_range_min?: number | null
          ascendant_sign_index?: number | null
          atmakaraka_planet?: string | null
          bio?: string | null
          birth_latitude: number
          birth_location: string
          birth_longitude: number
          birth_time: string
          birth_timezone?: number
          created_at?: string
          darakaraka_planet?: string | null
          date_of_birth: string
          element?: string | null
          gender?: string | null
          id?: string
          is_manglik?: boolean | null
          location_preference?: string | null
          looking_for?: string | null
          manglik_cancelled?: boolean | null
          moon_nakshatra_index?: number | null
          moon_sign_index?: number | null
          name: string
          onboarding_complete?: boolean | null
          photo_1?: string | null
          photo_2?: string | null
          updated_at?: string
          user_id: string
          vedic_chart?: Json | null
        }
        Update: {
          age_range_max?: number | null
          age_range_min?: number | null
          ascendant_sign_index?: number | null
          atmakaraka_planet?: string | null
          bio?: string | null
          birth_latitude?: number
          birth_location?: string
          birth_longitude?: number
          birth_time?: string
          birth_timezone?: number
          created_at?: string
          darakaraka_planet?: string | null
          date_of_birth?: string
          element?: string | null
          gender?: string | null
          id?: string
          is_manglik?: boolean | null
          location_preference?: string | null
          looking_for?: string | null
          manglik_cancelled?: boolean | null
          moon_nakshatra_index?: number | null
          moon_sign_index?: number | null
          name?: string
          onboarding_complete?: boolean | null
          photo_1?: string | null
          photo_2?: string | null
          updated_at?: string
          user_id?: string
          vedic_chart?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_discovery_profiles: {
        Args: { p_limit?: number; p_looking_for?: string; p_user_id: string }
        Returns: {
          ascendant_sign_index: number
          atmakaraka_planet: string
          bio: string
          birth_location: string
          darakaraka_planet: string
          date_of_birth: string
          element: string
          gender: string
          id: string
          is_manglik: boolean
          looking_for: string
          manglik_cancelled: boolean
          moon_nakshatra_index: number
          moon_sign_index: number
          name: string
          photo_1: string
          photo_2: string
          user_id: string
          vedic_chart: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
