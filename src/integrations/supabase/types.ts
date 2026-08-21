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
          last_mls_sync_at: string | null
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
          sms_eligible: boolean
          source: string
          source_system: string
          state: string | null
          trestle_list_agent_key: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_mls_sync_at?: string | null
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
          sms_eligible?: boolean
          source: string
          source_system?: string
          state?: string | null
          trestle_list_agent_key?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_mls_sync_at?: string | null
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
          sms_eligible?: boolean
          source?: string
          source_system?: string
          state?: string | null
          trestle_list_agent_key?: string | null
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
      checklist_subscribers: {
        Row: {
          created_at: string
          email: string
          ghl_contact_id: string | null
          id: string
          page_path: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          ghl_contact_id?: string | null
          id?: string
          page_path?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          ghl_contact_id?: string | null
          id?: string
          page_path?: string | null
          source?: string | null
          updated_at?: string | null
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
          created_by: string | null
          id: string
          intake_survey_id: string
          lead_id: string | null
          plan_data: Json | null
          plan_html: string | null
          published_at: string | null
          readiness_selection: string | null
          recommendation_overridden_at: string | null
          recommendation_overridden_by: string | null
          recommendation_reasoning: Json | null
          recommendation_score: Json | null
          recommended_program_slug: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          intake_survey_id: string
          lead_id?: string | null
          plan_data?: Json | null
          plan_html?: string | null
          published_at?: string | null
          readiness_selection?: string | null
          recommendation_overridden_at?: string | null
          recommendation_overridden_by?: string | null
          recommendation_reasoning?: Json | null
          recommendation_score?: Json | null
          recommended_program_slug?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          intake_survey_id?: string
          lead_id?: string | null
          plan_data?: Json | null
          plan_html?: string | null
          published_at?: string | null
          readiness_selection?: string | null
          recommendation_overridden_at?: string | null
          recommendation_overridden_by?: string | null
          recommendation_reasoning?: Json | null
          recommendation_score?: Json | null
          recommended_program_slug?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
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
      guide_progress: {
        Row: {
          completed: string[]
          created_at: string
          guide_slug: string
          last_section_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: string[]
          created_at?: string
          guide_slug: string
          last_section_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: string[]
          created_at?: string
          guide_slug?: string
          last_section_id?: string | null
          updated_at?: string
          user_id?: string
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
          business_phone: string | null
          business_street: string | null
          business_zip: string | null
          city: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          credit_reporting_bureaus: string[] | null
          credit_utilization_percent: number | null
          desired_funding_types: string[] | null
          draft_email: string | null
          entity_type: string | null
          filled_by: string
          financial_pains: string[]
          financial_pains_other: string | null
          first_name: string | null
          full_name: string | null
          funding_gap_methods: string[] | null
          gci_last_12_months: string | null
          goals_notes: string | null
          has_business_address: string | null
          has_business_bank_account: string | null
          has_business_email: boolean | null
          has_business_entity: string | null
          has_business_phone: boolean | null
          has_business_website: boolean | null
          id: string
          interest_in_cohort: string | null
          investment_readiness: string | null
          last_name: string | null
          lead_id: string | null
          license_type: string | null
          license_type_other: string | null
          personal_credit_score_range: string | null
          personal_guarantee_comfort: string | null
          preferred_cohort_days: string | null
          preferred_cohort_time_1: string | null
          preferred_cohort_time_2: string | null
          preferred_support_format: string | null
          primary_goals: string[]
          primary_goals_other: string | null
          sides_closed_last_12_months: string | null
          state: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string | null
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
          business_phone?: string | null
          business_street?: string | null
          business_zip?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          credit_reporting_bureaus?: string[] | null
          credit_utilization_percent?: number | null
          desired_funding_types?: string[] | null
          draft_email?: string | null
          entity_type?: string | null
          filled_by?: string
          financial_pains?: string[]
          financial_pains_other?: string | null
          first_name?: string | null
          full_name?: string | null
          funding_gap_methods?: string[] | null
          gci_last_12_months?: string | null
          goals_notes?: string | null
          has_business_address?: string | null
          has_business_bank_account?: string | null
          has_business_email?: boolean | null
          has_business_entity?: string | null
          has_business_phone?: boolean | null
          has_business_website?: boolean | null
          id?: string
          interest_in_cohort?: string | null
          investment_readiness?: string | null
          last_name?: string | null
          lead_id?: string | null
          license_type?: string | null
          license_type_other?: string | null
          personal_credit_score_range?: string | null
          personal_guarantee_comfort?: string | null
          preferred_cohort_days?: string | null
          preferred_cohort_time_1?: string | null
          preferred_cohort_time_2?: string | null
          preferred_support_format?: string | null
          primary_goals?: string[]
          primary_goals_other?: string | null
          sides_closed_last_12_months?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
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
          business_phone?: string | null
          business_street?: string | null
          business_zip?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          credit_reporting_bureaus?: string[] | null
          credit_utilization_percent?: number | null
          desired_funding_types?: string[] | null
          draft_email?: string | null
          entity_type?: string | null
          filled_by?: string
          financial_pains?: string[]
          financial_pains_other?: string | null
          first_name?: string | null
          full_name?: string | null
          funding_gap_methods?: string[] | null
          gci_last_12_months?: string | null
          goals_notes?: string | null
          has_business_address?: string | null
          has_business_bank_account?: string | null
          has_business_email?: boolean | null
          has_business_entity?: string | null
          has_business_phone?: boolean | null
          has_business_website?: boolean | null
          id?: string
          interest_in_cohort?: string | null
          investment_readiness?: string | null
          last_name?: string | null
          lead_id?: string | null
          license_type?: string | null
          license_type_other?: string | null
          personal_credit_score_range?: string | null
          personal_guarantee_comfort?: string | null
          preferred_cohort_days?: string | null
          preferred_cohort_time_1?: string | null
          preferred_cohort_time_2?: string | null
          preferred_support_format?: string | null
          primary_goals?: string[]
          primary_goals_other?: string | null
          sides_closed_last_12_months?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
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
          email_consent: boolean
          email_consent_at: string | null
          first_name: string
          ghl_contact_id: string | null
          ghl_sync_status: string | null
          ghl_synced_at: string | null
          id: string
          last_name: string
          phone: string
          sms_consent: boolean
          sms_consent_at: string | null
          sms_consent_source: string | null
          sms_consent_text: string | null
          sms_eligible: boolean
          sms_opted_out_at: string | null
          source: string
          state: string
          updated_at: string
          user_id: string | null
          wants_fundability_scan: boolean
        }
        Insert: {
          agent_type: string
          created_at?: string
          email: string
          email_consent?: boolean
          email_consent_at?: string | null
          first_name: string
          ghl_contact_id?: string | null
          ghl_sync_status?: string | null
          ghl_synced_at?: string | null
          id?: string
          last_name: string
          phone: string
          sms_consent?: boolean
          sms_consent_at?: string | null
          sms_consent_source?: string | null
          sms_consent_text?: string | null
          sms_eligible?: boolean
          sms_opted_out_at?: string | null
          source?: string
          state: string
          updated_at?: string
          user_id?: string | null
          wants_fundability_scan?: boolean
        }
        Update: {
          agent_type?: string
          created_at?: string
          email?: string
          email_consent?: boolean
          email_consent_at?: string | null
          first_name?: string
          ghl_contact_id?: string | null
          ghl_sync_status?: string | null
          ghl_synced_at?: string | null
          id?: string
          last_name?: string
          phone?: string
          sms_consent?: boolean
          sms_consent_at?: string | null
          sms_consent_source?: string | null
          sms_consent_text?: string | null
          sms_eligible?: boolean
          sms_opted_out_at?: string | null
          source?: string
          state?: string
          updated_at?: string
          user_id?: string | null
          wants_fundability_scan?: boolean
        }
        Relationships: []
      }
      mls_import_jobs: {
        Row: {
          created_at: string
          daily_new_limit: number
          enabled: boolean
          id: string
          import_new: boolean
          interval_hours: number
          last_run_at: string | null
          last_run_status: string | null
          lease_expires_at: string | null
          lease_owner: string | null
          max_days_on_market: number | null
          max_price: number | null
          min_price: number | null
          name: string
          next_sync_at: string | null
          overlap_minutes: number
          update_existing: boolean
          updated_at: string
          watermark_committed: string | null
          zip_group_id: string | null
        }
        Insert: {
          created_at?: string
          daily_new_limit?: number
          enabled?: boolean
          id?: string
          import_new?: boolean
          interval_hours?: number
          last_run_at?: string | null
          last_run_status?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          max_days_on_market?: number | null
          max_price?: number | null
          min_price?: number | null
          name: string
          next_sync_at?: string | null
          overlap_minutes?: number
          update_existing?: boolean
          updated_at?: string
          watermark_committed?: string | null
          zip_group_id?: string | null
        }
        Update: {
          created_at?: string
          daily_new_limit?: number
          enabled?: boolean
          id?: string
          import_new?: boolean
          interval_hours?: number
          last_run_at?: string | null
          last_run_status?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          max_days_on_market?: number | null
          max_price?: number | null
          min_price?: number | null
          name?: string
          next_sync_at?: string | null
          overlap_minutes?: number
          update_existing?: boolean
          updated_at?: string
          watermark_committed?: string | null
          zip_group_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mls_import_jobs_zip_group_id_fkey"
            columns: ["zip_group_id"]
            isOneToOne: false
            referencedRelation: "mls_zip_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      mls_import_record_errors: {
        Row: {
          created_at: string
          error_category: string | null
          error_message: string | null
          id: string
          intended_action: string | null
          listing_id: string | null
          listing_key: string | null
          needs_admin_action: boolean
          next_retry_at: string | null
          outcome: string | null
          reason: string | null
          retry_count: number
          run_id: string | null
          stage: string | null
        }
        Insert: {
          created_at?: string
          error_category?: string | null
          error_message?: string | null
          id?: string
          intended_action?: string | null
          listing_id?: string | null
          listing_key?: string | null
          needs_admin_action?: boolean
          next_retry_at?: string | null
          outcome?: string | null
          reason?: string | null
          retry_count?: number
          run_id?: string | null
          stage?: string | null
        }
        Update: {
          created_at?: string
          error_category?: string | null
          error_message?: string | null
          id?: string
          intended_action?: string | null
          listing_id?: string | null
          listing_key?: string | null
          needs_admin_action?: boolean
          next_retry_at?: string | null
          outcome?: string | null
          reason?: string | null
          retry_count?: number
          run_id?: string | null
          stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mls_import_record_errors_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "mls_import_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      mls_import_runs: {
        Row: {
          api_request_count: number
          completed_at: string | null
          created_at: string
          elapsed_ms: number | null
          error_message: string | null
          filters_used: Json | null
          id: string
          job_id: string | null
          mode: string
          next_run_at: string | null
          pages_expected: number | null
          pages_received: number | null
          provider_wait_ms: number
          rate_limit_responses: number
          records_accepted: number
          records_created: number
          records_deferred: number
          records_failed: number
          records_fetched: number
          records_filtered: number
          records_reported: number
          records_unchanged: number
          records_updated: number
          scheduled_at: string | null
          started_at: string | null
          status: string
          trigger: string
          triggered_by: string | null
          watermark_after: string | null
          watermark_before: string | null
          window_end: string | null
          window_start: string | null
          zip_groups_used: Json | null
        }
        Insert: {
          api_request_count?: number
          completed_at?: string | null
          created_at?: string
          elapsed_ms?: number | null
          error_message?: string | null
          filters_used?: Json | null
          id?: string
          job_id?: string | null
          mode: string
          next_run_at?: string | null
          pages_expected?: number | null
          pages_received?: number | null
          provider_wait_ms?: number
          rate_limit_responses?: number
          records_accepted?: number
          records_created?: number
          records_deferred?: number
          records_failed?: number
          records_fetched?: number
          records_filtered?: number
          records_reported?: number
          records_unchanged?: number
          records_updated?: number
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          trigger: string
          triggered_by?: string | null
          watermark_after?: string | null
          watermark_before?: string | null
          window_end?: string | null
          window_start?: string | null
          zip_groups_used?: Json | null
        }
        Update: {
          api_request_count?: number
          completed_at?: string | null
          created_at?: string
          elapsed_ms?: number | null
          error_message?: string | null
          filters_used?: Json | null
          id?: string
          job_id?: string | null
          mode?: string
          next_run_at?: string | null
          pages_expected?: number | null
          pages_received?: number | null
          provider_wait_ms?: number
          rate_limit_responses?: number
          records_accepted?: number
          records_created?: number
          records_deferred?: number
          records_failed?: number
          records_fetched?: number
          records_filtered?: number
          records_reported?: number
          records_unchanged?: number
          records_updated?: number
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          trigger?: string
          triggered_by?: string | null
          watermark_after?: string | null
          watermark_before?: string | null
          window_end?: string | null
          window_start?: string | null
          zip_groups_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mls_import_runs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "mls_import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      mls_settings: {
        Row: {
          automatic_ingestion_enabled: boolean
          circuit_breaker_recovery_seconds: number
          circuit_breaker_threshold: number
          created_at: string
          id: string
          import_new_enabled: boolean
          max_concurrency: number
          page_size: number
          request_timeout_ms: number
          retry_attempts: number
          retry_initial_delay_ms: number
          retry_max_delay_ms: number
          singleton: boolean
          timezone: string
          update_existing_enabled: boolean
          updated_at: string
        }
        Insert: {
          automatic_ingestion_enabled?: boolean
          circuit_breaker_recovery_seconds?: number
          circuit_breaker_threshold?: number
          created_at?: string
          id?: string
          import_new_enabled?: boolean
          max_concurrency?: number
          page_size?: number
          request_timeout_ms?: number
          retry_attempts?: number
          retry_initial_delay_ms?: number
          retry_max_delay_ms?: number
          singleton?: boolean
          timezone?: string
          update_existing_enabled?: boolean
          updated_at?: string
        }
        Update: {
          automatic_ingestion_enabled?: boolean
          circuit_breaker_recovery_seconds?: number
          circuit_breaker_threshold?: number
          created_at?: string
          id?: string
          import_new_enabled?: boolean
          max_concurrency?: number
          page_size?: number
          request_timeout_ms?: number
          retry_attempts?: number
          retry_initial_delay_ms?: number
          retry_max_delay_ms?: number
          singleton?: boolean
          timezone?: string
          update_existing_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      mls_settings_audit: {
        Row: {
          actor: string | null
          created_at: string
          entity: string
          entity_id: string | null
          field: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          actor?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          field?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          actor?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          field?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: []
      }
      mls_status_history: {
        Row: {
          action_taken: string | null
          changed_at: string
          id: string
          listing_id: string | null
          listing_key: string | null
          new_status: string
          old_status: string | null
          run_id: string | null
          transaction_id: string | null
        }
        Insert: {
          action_taken?: string | null
          changed_at?: string
          id?: string
          listing_id?: string | null
          listing_key?: string | null
          new_status: string
          old_status?: string | null
          run_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          action_taken?: string | null
          changed_at?: string
          id?: string
          listing_id?: string | null
          listing_key?: string | null
          new_status?: string
          old_status?: string | null
          run_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mls_status_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      mls_status_policy: {
        Row: {
          action: string
          created_at: string
          id: string
          internal_status: string
          needs_review: boolean
          notes: string | null
          raw_status: string
          updated_at: string
        }
        Insert: {
          action?: string
          created_at?: string
          id?: string
          internal_status: string
          needs_review?: boolean
          notes?: string | null
          raw_status: string
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          internal_status?: string
          needs_review?: boolean
          notes?: string | null
          raw_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mls_zip_groups: {
        Row: {
          county: string | null
          created_at: string
          enabled: boolean
          id: string
          label: string
          note: string | null
          state: string
          updated_at: string
        }
        Insert: {
          county?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          label: string
          note?: string | null
          state?: string
          updated_at?: string
        }
        Update: {
          county?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          label?: string
          note?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      mls_zips: {
        Row: {
          created_at: string
          enabled: boolean
          group_id: string
          id: string
          zip: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          group_id: string
          id?: string
          zip: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          group_id?: string
          id?: string
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "mls_zips_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "mls_zip_groups"
            referencedColumns: ["id"]
          },
        ]
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
      payments: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          customer_id: string | null
          email: string | null
          id: string
          metadata: Json | null
          payment_intent: string | null
          price_id: string | null
          product: string | null
          status: string
          stripe_session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          payment_intent?: string | null
          price_id?: string | null
          product?: string | null
          status?: string
          stripe_session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          payment_intent?: string | null
          price_id?: string | null
          product?: string | null
          status?: string
          stripe_session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      plan_task_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          phase: string | null
          plan_id: string
          priority: number | null
          snoozed_until: string | null
          source: string | null
          status: string
          task_key: string
          task_label: string | null
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          phase?: string | null
          plan_id: string
          priority?: number | null
          snoozed_until?: string | null
          source?: string | null
          status?: string
          task_key: string
          task_label?: string | null
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          phase?: string | null
          plan_id?: string
          priority?: number | null
          snoozed_until?: string | null
          source?: string | null
          status?: string
          task_key?: string
          task_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          ghl_contact_id: string | null
          last_login_at: string | null
          last_name: string | null
          onboarding_completed_at: string | null
          phone: string | null
          sms_consent: boolean
          sms_consent_at: string | null
          sms_consent_source: string | null
          sms_consent_text: string | null
          terms_accepted_at: string | null
          terms_consent_text: string | null
          updated_at: string
          user_id: string
          welcome_video_viewed_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          ghl_contact_id?: string | null
          last_login_at?: string | null
          last_name?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          sms_consent?: boolean
          sms_consent_at?: string | null
          sms_consent_source?: string | null
          sms_consent_text?: string | null
          terms_accepted_at?: string | null
          terms_consent_text?: string | null
          updated_at?: string
          user_id: string
          welcome_video_viewed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          ghl_contact_id?: string | null
          last_login_at?: string | null
          last_name?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          sms_consent?: boolean
          sms_consent_at?: string | null
          sms_consent_source?: string | null
          sms_consent_text?: string | null
          terms_accepted_at?: string | null
          terms_consent_text?: string | null
          updated_at?: string
          user_id?: string
          welcome_video_viewed_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          active: boolean
          cadence: string | null
          created_at: string
          cta_href: string | null
          cta_label: string
          fit_rules: Json
          id: string
          name: string
          price_display: string | null
          pricing_anchor: string | null
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          cadence?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string
          fit_rules?: Json
          id?: string
          name: string
          price_display?: string | null
          pricing_anchor?: string | null
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          cadence?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string
          fit_rules?: Json
          id?: string
          name?: string
          price_display?: string | null
          pricing_anchor?: string | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          payment_intent: string | null
          price_id: string | null
          product: string
          purchased_at: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_intent?: string | null
          price_id?: string | null
          product: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_intent?: string | null
          price_id?: string | null
          product?: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          buyer_agent_id: string | null
          close_date: string | null
          contract_status_change_date: string | null
          created_at: string
          id: string
          import_batch_id: string | null
          import_run_id: string | null
          listing_agent_id: string | null
          listing_id: string | null
          listing_key: string | null
          mls_id: string | null
          mls_status_raw: string | null
          modification_timestamp: string | null
          previous_status: string | null
          price: number | null
          property_address: string | null
          property_city: string | null
          property_state: string | null
          property_type: string | null
          property_zip: string | null
          source_system: string
          standard_status: string | null
          status_changed_at: string | null
          updated_at: string
        }
        Insert: {
          buyer_agent_id?: string | null
          close_date?: string | null
          contract_status_change_date?: string | null
          created_at?: string
          id?: string
          import_batch_id?: string | null
          import_run_id?: string | null
          listing_agent_id?: string | null
          listing_id?: string | null
          listing_key?: string | null
          mls_id?: string | null
          mls_status_raw?: string | null
          modification_timestamp?: string | null
          previous_status?: string | null
          price?: number | null
          property_address?: string | null
          property_city?: string | null
          property_state?: string | null
          property_type?: string | null
          property_zip?: string | null
          source_system?: string
          standard_status?: string | null
          status_changed_at?: string | null
          updated_at?: string
        }
        Update: {
          buyer_agent_id?: string | null
          close_date?: string | null
          contract_status_change_date?: string | null
          created_at?: string
          id?: string
          import_batch_id?: string | null
          import_run_id?: string | null
          listing_agent_id?: string | null
          listing_id?: string | null
          listing_key?: string | null
          mls_id?: string | null
          mls_status_raw?: string | null
          modification_timestamp?: string | null
          previous_status?: string | null
          price?: number | null
          property_address?: string | null
          property_city?: string | null
          property_state?: string | null
          property_type?: string | null
          property_zip?: string | null
          source_system?: string
          standard_status?: string | null
          status_changed_at?: string | null
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
      promote_user_to_admin: { Args: { _user_id: string }; Returns: undefined }
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
