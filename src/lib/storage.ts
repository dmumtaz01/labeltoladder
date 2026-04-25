import type { CandidateProfile } from "./types";

const KEY = "l2l.candidate.v1";

export function loadProfile(): CandidateProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CandidateProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: CandidateProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function emptyProfile(): CandidateProfile {
  return {
    onboarding: null,
    screener: null,
    testResults: null,
    completedAt: null,
  };
}
