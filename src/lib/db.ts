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

// ----- Annotation Jobs -----
export type AnnotationJob = {
  id: string;
  task_id: string;
  candidate_id: string;
  status: "assigned" | "submitted" | "approved" | "rejected";
  payload: Record<string, unknown> | null;
  submission: Record<string, unknown> | null;
  payout_cents: number;
  assigned_at: string;
  submitted_at: string | null;
  updated_at: string;
};

export type LeaderboardRow = {
  user_id: string;
  full_name: string;
  level: number;
  points: number;
  approved_jobs: number;
  earned_cents: number;
};

export async function assignAnnotationJob(
  taskId: string,
  candidateId: string,
  payload: Record<string, unknown>,
  payoutCents: number
): Promise<AnnotationJob> {
  const { data, error } = await supabase
    .from("annotation_jobs")
    .insert({
      task_id: taskId,
      candidate_id: candidateId,
      payload,
      payout_cents: payoutCents,
      status: "assigned",
    })
    .select()
    .single();
  if (error) throw error;
  return data as AnnotationJob;
}

export async function fetchMyAnnotationJobs(candidateId: string): Promise<AnnotationJob[]> {
  const { data, error } = await supabase
    .from("annotation_jobs")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("assigned_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AnnotationJob[];
}

export async function fetchAnnotationJobById(jobId: string): Promise<AnnotationJob | null> {
  const { data, error } = await supabase
    .from("annotation_jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();
  if (error) throw error;
  return (data as AnnotationJob | null) ?? null;
}

export async function submitAnnotationJob(
  jobId: string,
  submission: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase
    .from("annotation_jobs")
    .update({
      status: "submitted",
      submission,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", jobId);
  if (error) throw error;
}

export async function approveAnnotationJob(jobId: string): Promise<void> {
  const { error } = await supabase
    .from("annotation_jobs")
    .update({ status: "approved" })
    .eq("id", jobId);
  if (error) throw error;
}

export async function rejectAnnotationJob(jobId: string): Promise<void> {
  const { error } = await supabase
    .from("annotation_jobs")
    .update({ status: "rejected" })
    .eq("id", jobId);
  if (error) throw error;
}

// ----- Quality Reviews -----
export type QualityReview = {
  id: string;
  annotation_job_id: string;
  reviewer: "ai" | "employer" | "admin";
  score: number; // 0.00 - 1.00
  feedback: string | null;
  created_at: string;
};

export async function createQualityReview(
  annotationJobId: string,
  reviewer: "ai" | "employer" | "admin",
  score: number,
  feedback?: string
): Promise<QualityReview> {
  const { data, error } = await supabase
    .from("quality_reviews")
    .insert({
      annotation_job_id: annotationJobId,
      reviewer,
      score,
      feedback: feedback ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as QualityReview;
}

export async function fetchQualityReviewsForJob(jobId: string): Promise<QualityReview[]> {
  const { data, error } = await supabase
    .from("quality_reviews")
    .select("*")
    .eq("annotation_job_id", jobId);
  if (error) throw error;
  return (data ?? []) as QualityReview[];
}

// ----- Payments -----
export type Payment = {
  id: string;
  candidate_id: string;
  annotation_job_id: string | null;
  amount_cents: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  reference: string | null;
  created_at: string;
};

export async function recordPayment(
  candidateId: string,
  amountCents: number,
  annotationJobId?: string
): Promise<Payment> {
  const { data, error } = await supabase
    .from("payments")
    .insert({
      candidate_id: candidateId,
      amount_cents: amountCents,
      annotation_job_id: annotationJobId ?? null,
      currency: "USD",
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return data as Payment;
}

export async function fetchMyPayments(candidateId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Payment[];
}

export async function markPaymentAsPaid(paymentId: string, reference: string): Promise<void> {
  const { error } = await supabase
    .from("payments")
    .update({ status: "paid", reference })
    .eq("id", paymentId);
  if (error) throw error;
}

// ----- Leaderboard -----
export async function fetchLeaderboardStats(): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase
    .from("leaderboard_stats")
    .select("*")
    .order("points", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as LeaderboardRow[];
}

export async function fetchUserLeaderboardStats(userId: string): Promise<LeaderboardRow | null> {
  const { data, error } = await supabase
    .from("leaderboard_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as LeaderboardRow | null) ?? null;
}
