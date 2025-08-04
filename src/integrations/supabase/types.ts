export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      birthdays: {
        Row: {
          birth_date: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      crew_members: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order_index: number
          position: string
          schedule_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order_index: number
          position: string
          schedule_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
          position?: string
          schedule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "crew_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_schedules: {
        Row: {
          created_at: string | null
          id: string
          sick_callouts: string[] | null
          updated_at: string | null
          vacation_callouts: string[] | null
          week_index: number
          week_of: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          sick_callouts?: string[] | null
          updated_at?: string | null
          vacation_callouts?: string[] | null
          week_index: number
          week_of: string
        }
        Update: {
          created_at?: string | null
          id?: string
          sick_callouts?: string[] | null
          updated_at?: string | null
          vacation_callouts?: string[] | null
          week_index?: number
          week_of?: string
        }
        Relationships: []
      }
      schedule_items: {
        Row: {
          created_at: string | null
          crew_member_id: string | null
          day_index: number
          id: string
          row1_color: string | null
          row1_field_date: string | null
          row1_job_name: string | null
          row1_job_number: string | null
          row2_color: string | null
          row2_field_date: string | null
          row2_job_name: string | null
          row2_job_number: string | null
        }
        Insert: {
          created_at?: string | null
          crew_member_id?: string | null
          day_index: number
          id?: string
          row1_color?: string | null
          row1_field_date?: string | null
          row1_job_name?: string | null
          row1_job_number?: string | null
          row2_color?: string | null
          row2_field_date?: string | null
          row2_job_name?: string | null
          row2_job_number?: string | null
        }
        Update: {
          created_at?: string | null
          crew_member_id?: string | null
          day_index?: number
          id?: string
          row1_color?: string | null
          row1_field_date?: string | null
          row1_job_name?: string | null
          row1_job_number?: string | null
          row2_color?: string | null
          row2_field_date?: string | null
          row2_job_name?: string | null
          row2_job_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_items_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
        ]
      }
      shoutouts: {
        Row: {
          created_at: string | null
          date_posted: string
          from_person: string
          id: string
          text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_posted?: string
          from_person: string
          id?: string
          text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_posted?: string
          from_person?: string
          id?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      weather_cache: {
        Row: {
          created_at: string
          current_condition: string
          current_temp: number
          forecast: Json
          id: string
          last_updated: string
          location: string
        }
        Insert: {
          created_at?: string
          current_condition: string
          current_temp: number
          forecast: Json
          id?: string
          last_updated?: string
          location?: string
        }
        Update: {
          created_at?: string
          current_condition?: string
          current_temp?: number
          forecast?: Json
          id?: string
          last_updated?: string
          location?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
