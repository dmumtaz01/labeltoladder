// Database access layer — replaces localStorage.
import { supabase } from "@/integrations/supabase/client";
import type { CandidateProfile, Onboarding, Screener, TestResults } from "./types";

export async function fetchCandidateProfile(userId: string): Promise<CandidateProfile> {
  const { data } = await supabase
    .from("candidate_profiles")
    .select("onboarding, screener, test_results, completed_at")
    .eq("user_id", userId)
    .maybeSingle();
  return {
    onboarding: (data?.onboarding as Onboarding | null) ?? null,
    screener: (data?.screener as Screener | null) ?? null,
    testResults: (data?.test_results as TestResults | null) ?? null,
    completedAt: data?.completed_at ?? null,
  };
}

export async function saveCandidateProfile(userId: string, p: CandidateProfile) {
  const payload = {
    user_id: userId,
    onboarding: p.onboarding as never,
    screener: p.screener as never,
    test_results: p.testResults as never,
    level: p.testResults?.level ?? null,
    completed_at: p.completedAt,
  };
  const { error } = await supabase.from("candidate_profiles").upsert(payload, { onConflict: "user_id" });
  if (error) throw error;
}

// ----- Employer tasks -----
export type DbTask = {
  id: string;
  employer_id: string;
  employer_name: string;
  title: string;
  category: "annotation" | "rating" | "review" | "translation" | "training";
  min_level: number;
  languages: string[];
  hourly: string;
  hours_estimate: number;
  description: string;
  created_at: string;
};

export async function fetchTasks(): Promise<DbTask[]> {
  const { data, error } = await supabase
    .from("employer_tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbTask[];
}

export async function fetchMyTasks(employerId: string): Promise<DbTask[]> {
  const { data, error } = await supabase
    .from("employer_tasks")
    .select("*")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbTask[];
}

export async function createTask(t: Omit<DbTask, "id" | "created_at">) {
  const { data, error } = await supabase.from("employer_tasks").insert(t).select().single();
  if (error) throw error;
  return data as DbTask;
}

// ----- Applications -----
export async function fetchMyApplications(candidateId: string): Promise<string[]> {
  const { data } = await supabase
    .from("applications")
    .select("task_id")
    .eq("candidate_id", candidateId);
  return (data ?? []).map((a) => a.task_id as string);
}

export async function applyToTask(taskId: string, candidateId: string) {
  const { error } = await supabase
    .from("applications")
    .insert({ task_id: taskId, candidate_id: candidateId });
  if (error && !error.message.includes("duplicate")) throw error;
}

export async function withdrawApplication(taskId: string, candidateId: string) {
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("task_id", taskId)
    .eq("candidate_id", candidateId);
  if (error) throw error;
}

export async function fetchApplicantsForTask(taskId: string) {
  const { data } = await supabase
    .from("applications")
    .select("candidate_id, applied_at")
    .eq("task_id", taskId);
  return data ?? [];
}

// ----- Admin: list all candidate profiles -----
export type AdminCandidateRow = {
  user_id: string;
  full_name: string | null;
  level: number | null;
  onboarding: Onboarding | null;
  test_results: TestResults | null;
  created_at: string;
};

export async function fetchAllCandidates(): Promise<AdminCandidateRow[]> {
  const { data: profiles } = await supabase
    .from("candidate_profiles")
    .select("user_id, level, onboarding, test_results, created_at")
    .order("created_at", { ascending: false });
  if (!profiles) return [];
  const ids = profiles.map((p) => p.user_id);
  const { data: names } = await supabase.from("profiles").select("id, full_name").in("id", ids);
  const nameMap = new Map((names ?? []).map((n) => [n.id, n.full_name]));
  return profiles.map((p) => ({
    user_id: p.user_id,
    full_name: nameMap.get(p.user_id) ?? null,
    level: p.level,
    onboarding: p.onboarding as Onboarding | null,
    test_results: p.test_results as TestResults | null,
    created_at: p.created_at,
  }));
}
