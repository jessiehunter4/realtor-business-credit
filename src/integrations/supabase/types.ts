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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          license_number: string | null
          office_name: string | null
          office_phone: string | null
          phone: string | null
          property_address: string | null
          property_city: string | null
          property_close_date: string | null
          property_country: string | null
          property_county: string | null
          property_days_on_market: number | null
          property_price: number | null
          property_state: string | null
          property_street_dir_prefix: string | null
          property_street_name: string | null
          property_street_number: string | null
          property_street_suffix: string | null
          property_zip: string | null
          source: string
          state: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          office_name?: string | null
          office_phone?: string | null
          phone?: string | null
          property_address?: string | null
          property_city?: string | null
          property_close_date?: string | null
          property_country?: string | null
          property_county?: string | null
          property_days_on_market?: number | null
          property_price?: number | null
          property_state?: string | null
          property_street_dir_prefix?: string | null
          property_street_name?: string | null
          property_street_number?: string | null
          property_street_suffix?: string | null
          property_zip?: string | null
          source: string
          state?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          office_name?: string | null
          office_phone?: string | null
          phone?: string | null
          property_address?: string | null
          property_city?: string | null
          property_close_date?: string | null
          property_country?: string | null
          property_county?: string | null
          property_days_on_market?: number | null
          property_price?: number | null
          property_state?: string | null
          property_street_dir_prefix?: string | null
          property_street_name?: string | null
          property_street_number?: string | null
          property_street_suffix?: string | null
          property_zip?: string | null
          source?: string
          state?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      contact_syncs: {
        Row: {
          agent_id: string | null
          created_at: string
          first_synced_at: string | null
          ghl_contact_id: string | null
          id: string
          last_error_message: string | null
          last_synced_at: string | null
          lead_id: string | null
          next_retry_at: string | null
          retry_count: number
          status: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          first_synced_at?: string | null
          ghl_contact_id?: string | null
          id?: string
          last_error_message?: string | null
          last_synced_at?: string | null
          lead_id?: string | null
          next_retry_at?: string | null
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          first_synced_at?: string | null
          ghl_contact_id?: string | null
          id?: string
          last_error_message?: string | null
          last_synced_at?: string | null
          lead_id?: string | null
          next_retry_at?: string | null
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_syncs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_syncs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_plans: {
        Row: {
          agent_id: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          created_by: string
          id: string
          intake_survey_id: string
          lead_id: string | null
          plan_data: Json | null
          plan_html: string | null
          published_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          created_by: string
          id?: string
          intake_survey_id: string
          lead_id?: string | null
          plan_data?: Json | null
          plan_html?: string | null
          published_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          created_by?: string
          id?: string
          intake_survey_id?: string
          lead_id?: string | null
          plan_data?: Json | null
          plan_html?: string | null
          published_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_plans_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_plans_intake_survey_id_fkey"
            columns: ["intake_survey_id"]
            isOneToOne: false
            referencedRelation: "intake_surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_plans_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_events: {
        Row: {
          created_at: string | null
          event_type: string
          ghl_contact_id: string | null
          ghl_contact_name: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          ghl_contact_id?: string | null
          ghl_contact_name?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          ghl_contact_id?: string | null
          ghl_contact_name?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      import_batches: {
        Row: {
          agents_created: number | null
          agents_updated: number | null
          created_at: string
          error_message: string | null
          filename: string
          id: string
          rows_processed: number | null
          status: string
          transactions_created: number | null
          updated_at: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          agents_created?: number | null
          agents_updated?: number | null
          created_at?: string
          error_message?: string | null
          filename: string
          id?: string
          rows_processed?: number | null
          status?: string
          transactions_created?: number | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          agents_created?: number | null
          agents_updated?: number | null
          created_at?: string
          error_message?: string | null
          filename?: string
          id?: string
          rows_processed?: number | null
          status?: string
          transactions_created?: number | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      intake_coach_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          intake_survey_id: string
          note: string
          section: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          intake_survey_id: string
          note: string
          section: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          intake_survey_id?: string
          note?: string
          section?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_coach_notes_intake_survey_id_fkey"
            columns: ["intake_survey_id"]
            isOneToOne: false
            referencedRelation: "intake_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      intake_surveys: {
        Row: {
          access_token: string
          accounting_software_name: string | null
          additional_notes: string | null
          address_type: string | null
          agent_id: string | null
          brokerage_name: string | null
          business_credit_cards: string | null
          city: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          credit_reporting_bureaus: string[] | null
          desired_funding_types: string[] | null
          desired_monthly_credit_capacity: string | null
          entity_type: string | null
          filled_by: string
          funding_gap_methods: string[] | null
          gci_last_12_months: string | null
          has_business_address: string | null
          has_business_bank_account: string | null
          has_business_email: boolean | null
          has_business_entity: string | null
          has_business_phone: boolean | null
          has_business_website: boolean | null
          id: string
          interest_in_cohort: string | null
          investment_readiness: string | null
          lead_id: string | null
          license_type: string | null
          personal_credit_score_range: string | null
          personal_guarantee_comfort: string | null
          preferred_cohort_days: string | null
          preferred_support_format: string | null
          sides_closed_last_12_months: string | null
          state: string | null
          status: string
          submitted_at: string | null
          top_financial_goal: string | null
          top_financial_need: string | null
          updated_at: string
          uses_accounting_software: string | null
          vendor_tradelines: string | null
          years_in_real_estate: string | null
        }
        Insert: {
          access_token?: string
          accounting_software_name?: string | null
          additional_notes?: string | null
          address_type?: string | null
          agent_id?: string | null
          brokerage_name?: string | null
          business_credit_cards?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          credit_reporting_bureaus?: string[] | null
          desired_funding_types?: string[] | null
          desired_monthly_credit_capacity?: string | null
          entity_type?: string | null
          filled_by?: string
          funding_gap_methods?: string[] | null
          gci_last_12_months?: string | null
          has_business_address?: string | null
          has_business_bank_account?: string | null
          has_business_email?: boolean | null
          has_business_entity?: string | null
          has_business_phone?: boolean | null
          has_business_website?: boolean | null
          id?: string
          interest_in_cohort?: string | null
          investment_readiness?: string | null
          lead_id?: string | null
          license_type?: string | null
          personal_credit_score_range?: string | null
          personal_guarantee_comfort?: string | null
          preferred_cohort_days?: string | null
          preferred_support_format?: string | null
          sides_closed_last_12_months?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          top_financial_goal?: string | null
          top_financial_need?: string | null
          updated_at?: string
          uses_accounting_software?: string | null
          vendor_tradelines?: string | null
          years_in_real_estate?: string | null
        }
        Update: {
          access_token?: string
          accounting_software_name?: string | null
          additional_notes?: string | null
          address_type?: string | null
          agent_id?: string | null
          brokerage_name?: string | null
          business_credit_cards?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          credit_reporting_bureaus?: string[] | null
          desired_funding_types?: string[] | null
          desired_monthly_credit_capacity?: string | null
          entity_type?: string | null
          filled_by?: string
          funding_gap_methods?: string[] | null
          gci_last_12_months?: string | null
          has_business_address?: string | null
          has_business_bank_account?: string | null
          has_business_email?: boolean | null
          has_business_entity?: string | null
          has_business_phone?: boolean | null
          has_business_website?: boolean | null
          id?: string
          interest_in_cohort?: string | null
          investment_readiness?: string | null
          lead_id?: string | null
          license_type?: string | null
          personal_credit_score_range?: string | null
          personal_guarantee_comfort?: string | null
          preferred_cohort_days?: string | null
          preferred_support_format?: string | null
          sides_closed_last_12_months?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          top_financial_goal?: string | null
          top_financial_need?: string | null
          updated_at?: string
          uses_accounting_software?: string | null
          vendor_tradelines?: string | null
          years_in_real_estate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intake_surveys_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_surveys_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agent_type: string
          created_at: string
          email: string
          first_name: string
          ghl_contact_id: string | null
          ghl_sync_status: string | null
          ghl_synced_at: string | null
          id: string
          last_name: string
          phone: string
          source: string
          state: string
          updated_at: string
          wants_fundability_scan: boolean
        }
        Insert: {
          agent_type: string
          created_at?: string
          email: string
          first_name: string
          ghl_contact_id?: string | null
          ghl_sync_status?: string | null
          ghl_synced_at?: string | null
          id?: string
          last_name: string
          phone: string
          source?: string
          state: string
          updated_at?: string
          wants_fundability_scan?: boolean
        }
        Update: {
          agent_type?: string
          created_at?: string
          email?: string
          first_name?: string
          ghl_contact_id?: string | null
          ghl_sync_status?: string | null
          ghl_synced_at?: string | null
          id?: string
          last_name?: string
          phone?: string
          source?: string
          state?: string
          updated_at?: string
          wants_fundability_scan?: boolean
        }
        Relationships: []
      }
      opt_outs: {
        Row: {
          agent_id: string | null
          channel: string
          created_at: string
          email: string | null
          id: string
          lead_id: string | null
          opted_out_at: string
          phone: string | null
          reason: string | null
        }
        Insert: {
          agent_id?: string | null
          channel: string
          created_at?: string
          email?: string | null
          id?: string
          lead_id?: string | null
          opted_out_at?: string
          phone?: string | null
          reason?: string | null
        }
        Update: {
          agent_id?: string | null
          channel?: string
          created_at?: string
          email?: string | null
          id?: string
          lead_id?: string | null
          opted_out_at?: string
          phone?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opt_outs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opt_outs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          buyer_agent_id: string | null
          close_date: string
          created_at: string
          id: string
          import_batch_id: string | null
          listing_agent_id: string | null
          mls_id: string | null
          price: number | null
          property_address: string | null
          property_city: string | null
          property_state: string | null
          property_type: string | null
          property_zip: string | null
          updated_at: string
        }
        Insert: {
          buyer_agent_id?: string | null
          close_date: string
          created_at?: string
          id?: string
          import_batch_id?: string | null
          listing_agent_id?: string | null
          mls_id?: string | null
          price?: number | null
          property_address?: string | null
          property_city?: string | null
          property_state?: string | null
          property_type?: string | null
          property_zip?: string | null
          updated_at?: string
        }
        Update: {
          buyer_agent_id?: string | null
          close_date?: string
          created_at?: string
          id?: string
          import_batch_id?: string | null
          listing_agent_id?: string | null
          mls_id?: string | null
          price?: number | null
          property_address?: string | null
          property_city?: string | null
          property_state?: string | null
          property_type?: string | null
          property_zip?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_agent_id_fkey"
            columns: ["buyer_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_import_batch_id_fkey"
            columns: ["import_batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_listing_agent_id_fkey"
            columns: ["listing_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
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
      [_ in never]: never
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
