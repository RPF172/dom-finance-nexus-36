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
      admin_actions: {
        Row: {
          action_type: string
          admin_user_id: string
          application_id: string
          created_at: string | null
          id: string
          notes: string | null
          rejection_reason: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          application_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rejection_reason?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          application_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          collar_type: string
          created_at: string | null
          email: string
          financial_level: string | null
          first_act_of_obedience: string
          greatest_weakness: string
          highest_tribute: number
          id: string
          is_owned: string
          most_humiliating_act: string
          motivating_punishment: string
          name: string
          obedience_level: number
          proof_of_obedience: string | null
          public_failure_consent: string
          reaction_to_failure: string
          reason: string | null
          reference_id: string
          rejected_at: string | null
          rejection_reason: string | null
          ritual_frequency: string
          role_in_hierarchy: string
          status: string
          submission_level: string | null
          submission_pledge: string
          username: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          collar_type: string
          created_at?: string | null
          email: string
          financial_level?: string | null
          first_act_of_obedience: string
          greatest_weakness: string
          highest_tribute?: number
          id?: string
          is_owned: string
          most_humiliating_act: string
          motivating_punishment: string
          name: string
          obedience_level: number
          proof_of_obedience?: string | null
          public_failure_consent: string
          reaction_to_failure: string
          reason?: string | null
          reference_id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          ritual_frequency: string
          role_in_hierarchy: string
          status?: string
          submission_level?: string | null
          submission_pledge: string
          username: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          collar_type?: string
          created_at?: string | null
          email?: string
          financial_level?: string | null
          first_act_of_obedience?: string
          greatest_weakness?: string
          highest_tribute?: number
          id?: string
          is_owned?: string
          most_humiliating_act?: string
          motivating_punishment?: string
          name?: string
          obedience_level?: number
          proof_of_obedience?: string | null
          public_failure_consent?: string
          reaction_to_failure?: string
          reason?: string | null
          reference_id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          ritual_frequency?: string
          role_in_hierarchy?: string
          status?: string
          submission_level?: string | null
          submission_pledge?: string
          username?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          assignment_text: string | null
          body_text: string | null
          created_at: string | null
          estimated_time: number | null
          id: string
          module_id: string | null
          objective: string | null
          order_index: number
          published: boolean
          ritual_text: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assignment_text?: string | null
          body_text?: string | null
          created_at?: string | null
          estimated_time?: number | null
          id?: string
          module_id?: string | null
          objective?: string | null
          order_index?: number
          published?: boolean
          ritual_text?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assignment_text?: string | null
          body_text?: string | null
          created_at?: string | null
          estimated_time?: number | null
          id?: string
          module_id?: string | null
          objective?: string | null
          order_index?: number
          published?: boolean
          ritual_text?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          published: boolean
          slug: string
          title: string
          updated_at: string | null
          year_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          published?: boolean
          slug: string
          title: string
          updated_at?: string | null
          year_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string | null
          year_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_verified: boolean
          created_at: string | null
          display_name: string | null
          id: string
          terms_accepted: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_verified?: boolean
          created_at?: string | null
          display_name?: string | null
          id?: string
          terms_accepted?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_verified?: boolean
          created_at?: string | null
          display_name?: string | null
          id?: string
          terms_accepted?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          answer: Json
          created_at: string | null
          explanation: string | null
          id: string
          lesson_id: string | null
          options: Json | null
          order_index: number
          question: string
          type: string
        }
        Insert: {
          answer: Json
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id?: string | null
          options?: Json | null
          order_index?: number
          question: string
          type: string
        }
        Update: {
          answer?: Json
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id?: string | null
          options?: Json | null
          order_index?: number
          question?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          assignment_submitted: boolean
          completed: boolean
          completed_at: string | null
          content_read: boolean
          created_at: string | null
          id: string
          lesson_id: string | null
          quiz_completed: boolean
          quiz_score: number | null
          ritual_completed: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignment_submitted?: boolean
          completed?: boolean
          completed_at?: string | null
          content_read?: boolean
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          quiz_completed?: boolean
          quiz_score?: number | null
          ritual_completed?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignment_submitted?: boolean
          completed?: boolean
          completed_at?: string | null
          content_read?: boolean
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          quiz_completed?: boolean
          quiz_score?: number | null
          ritual_completed?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_email_exists: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      get_application_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_count: number
          pending_count: number
          approved_count: number
          rejected_count: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_lesson_unlocked: {
        Args: {
          _user_id: string
          _lesson_id: string
          _module_id: string
          _year_id: string
        }
        Returns: boolean
      }
      is_lesson_unlocked_new: {
        Args: { _user_id: string; _lesson_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "pledge"
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
      app_role: ["admin", "user", "pledge"],
    },
  },
} as const
