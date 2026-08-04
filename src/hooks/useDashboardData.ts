import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { PlanData } from "@/components/plan/PlanDocument";
import type { IntakeSurveyLike } from "@/lib/roadmap";

export interface DashboardProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  onboarding_completed_at: string | null;
  welcome_video_viewed_at: string | null;
}

export interface DashboardPlan {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  recommended_program_slug: string | null;
  plan_data: PlanData | null;
  contact_name: string | null;
  intake_survey_id: string | null;
}

export interface TaskProgress {
  id: string;
  task_key: string;
  task_label: string | null;
  completed: boolean;
  completed_at: string | null;
  status?: string | null;
  updated_at?: string | null;
}

export interface DashboardData {
  session: Session | null;
  profile: DashboardProfile | null;
  plan: DashboardPlan | null;
  tasks: TaskProgress[];
  survey: IntakeSurveyLike | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboardData(): DashboardData {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [plan, setPlan] = useState<DashboardPlan | null>(null);
  const [tasks, setTasks] = useState<TaskProgress[]>([]);
  const [survey, setSurvey] = useState<IntakeSurveyLike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (activeSession: Session | null) => {
    if (!activeSession) {
      setProfile(null);
      setPlan(null);
      setTasks([]);
      setSurvey(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const uid = activeSession.user.id;
      const [{ data: prof }, { data: planRow }, { data: surveyRow }] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, first_name, last_name, email, onboarding_completed_at, welcome_video_viewed_at")
          .eq("user_id", uid)
          .maybeSingle(),
        supabase
          .from("custom_plans")
          .select("id, status, created_at, updated_at, recommended_program_slug, plan_data, contact_name, intake_survey_id")
          .eq("user_id", uid)
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("intake_surveys")
          .select(
            "has_business_entity, has_business_address, has_business_phone, has_business_email, has_business_website, has_business_bank_account, uses_accounting_software, accounting_software_name, business_credit_cards, vendor_tradelines, credit_reporting_bureaus, funding_gap_methods, desired_funding_types, financial_pains, primary_goals, personal_credit_score_range",
          )
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setProfile((prof ?? null) as DashboardProfile | null);
      setSurvey((surveyRow ?? null) as IntakeSurveyLike | null);
      const p = planRow as unknown as DashboardPlan | null;
      setPlan(p);

      if (p?.id) {
        const { data: taskRows } = await supabase
          .from("plan_task_progress")
          .select("id, task_key, task_label, completed, completed_at, status, updated_at")
          .eq("plan_id", p.id);
        setTasks((taskRows ?? []) as TaskProgress[]);
      } else {
        setTasks([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      load(s);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      load(s);
    });
    return () => subscription.unsubscribe();
  }, [load]);

  return {
    session,
    profile,
    plan,
    tasks,
    survey,
    loading,
    error,
    refresh: async () => load(session),
  };
}