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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      annotation_jobs: {
        Row: {
          assigned_at: string
          candidate_id: string
          id: string
          payload: Json | null
          payout_cents: number
          status: string
          submission: Json | null
          submitted_at: string | null
          task_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          candidate_id: string
          id?: string
          payload?: Json | null
          payout_cents?: number
          status?: string
          submission?: Json | null
          submitted_at?: string | null
          task_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          candidate_id?: string
          id?: string
          payload?: Json | null
          payout_cents?: number
          status?: string
          submission?: Json | null
          submitted_at?: string | null
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "annotation_jobs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "employer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string
          candidate_id: string
          id: string
          task_id: string
        }
        Insert: {
          applied_at?: string
          candidate_id: string
          id?: string
          task_id: string
        }
        Update: {
          applied_at?: string
          candidate_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "employer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          completed_at: string | null
          created_at: string
          level: number | null
          onboarding: Json | null
          screener: Json | null
          test_results: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          level?: number | null
          onboarding?: Json | null
          screener?: Json | null
          test_results?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          level?: number | null
          onboarding?: Json | null
          screener?: Json | null
          test_results?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consents: {
        Row: {
          accepted_at: string
          id: string
          user_id: string
          version: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          user_id: string
          version?: string
        }
        Update: {
          accepted_at?: string
          id?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      employer_tasks: {
        Row: {
          category: string
          created_at: string
          description: string
          employer_id: string
          employer_name: string
          hourly: string
          hours_estimate: number
          id: string
          languages: string[]
          min_level: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          employer_id: string
          employer_name: string
          hourly: string
          hours_estimate?: number
          id?: string
          languages?: string[]
          min_level?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          employer_id?: string
          employer_name?: string
          hourly?: string
          hours_estimate?: number
          id?: string
          languages?: string[]
          min_level?: number
          title?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          annotation_job_id: string | null
          candidate_id: string
          created_at: string
          currency: string
          id: string
          reference: string | null
          status: string
        }
        Insert: {
          amount_cents: number
          annotation_job_id?: string | null
          candidate_id: string
          created_at?: string
          currency?: string
          id?: string
          reference?: string | null
          status?: string
        }
        Update: {
          amount_cents?: number
          annotation_job_id?: string | null
          candidate_id?: string
          created_at?: string
          currency?: string
          id?: string
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_annotation_job_id_fkey"
            columns: ["annotation_job_id"]
            isOneToOne: false
            referencedRelation: "annotation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quality_reviews: {
        Row: {
          annotation_job_id: string
          created_at: string
          feedback: string | null
          id: string
          reviewer: string
          score: number
        }
        Insert: {
          annotation_job_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          reviewer?: string
          score: number
        }
        Update: {
          annotation_job_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          reviewer?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "quality_reviews_annotation_job_id_fkey"
            columns: ["annotation_job_id"]
            isOneToOne: false
            referencedRelation: "annotation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard_stats: {
        Row: {
          approved_jobs: number | null
          earned_cents: number | null
          full_name: string | null
          level: number | null
          points: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "employer" | "candidate"
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
      app_role: ["admin", "employer", "candidate"],
    },
  },
} as const
