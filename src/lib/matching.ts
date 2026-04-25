// Candidate-side matching: given a CandidateProfile, score MOCK_TASKS by fit.
import type { CandidateProfile } from "./types";
import { MOCK_TASKS, type MockTask } from "./mockData";

export type JobMatch = {
  task: MockTask;
  score: number; // 0-100
  meetsLevel: boolean;
  langOverlap: boolean;
  interestOverlap: boolean;
  reasons: string[];
  gap: number; // levels short (0 if eligible)
};

const INTEREST_TO_CATEGORY: Record<string, MockTask["category"][]> = {
  Writing: ["review", "rating", "training"],
  Translation: ["translation"],
  "Customer support": ["rating", "training", "review"],
  Teaching: ["training", "review"],
  Education: ["training", "review"],
  Coding: ["review", "training"],
  Math: ["review"],
  Health: ["review", "annotation"],
  "Image tagging": ["annotation"],
  "E-commerce": ["annotation", "rating"],
  Marketing: ["rating", "review"],
  Agriculture: ["annotation"],
  "Tech support": ["rating", "review"],
};

export function matchJobsForCandidate(profile: CandidateProfile): JobMatch[] {
  const r = profile.testResults;
  const o = profile.onboarding;
  const s = profile.screener;
  const myLangs = o?.languages ?? [];
  const myInterests = s?.interests ?? [];
  const myLevel = r?.level ?? 0;

  return MOCK_TASKS.map((task) => {
    const meetsLevel = myLevel >= task.minLevel;
    const langOverlap = task.languages.some((l) =>
      myLangs.some((ml) => ml.toLowerCase() === l.toLowerCase()),
    );
    const interestCats = myInterests.flatMap((i) => INTEREST_TO_CATEGORY[i] ?? []);
    const interestOverlap = interestCats.includes(task.category);

    let score = 0;
    const reasons: string[] = [];
    if (meetsLevel) {
      score += 45;
      reasons.push(`Meets Level ${task.minLevel}+`);
    }
    if (langOverlap) {
      score += 25;
      reasons.push("Language match");
    }
    if (interestOverlap) {
      score += 15;
      reasons.push("Matches your interests");
    }
    if (r) {
      score += Math.round(r.accuracy * 15);
    }
    // small bonus for fresh postings
    if (task.postedDays <= 2) score += 3;

    return {
      task,
      score: Math.min(100, score),
      meetsLevel,
      langOverlap,
      interestOverlap,
      reasons,
      gap: Math.max(0, task.minLevel - myLevel),
    };
  }).sort((a, b) => {
    // eligible first, then by score
    if (a.meetsLevel !== b.meetsLevel) return a.meetsLevel ? -1 : 1;
    return b.score - a.score;
  });
}

const APPLY_KEY = "l2l.applications.v1";

export type Application = {
  taskId: string;
  appliedAt: string;
};

export function loadApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPLY_KEY);
    return raw ? (JSON.parse(raw) as Application[]) : [];
  } catch {
    return [];
  }
}

export function saveApplication(taskId: string): Application[] {
  const current = loadApplications();
  if (current.some((a) => a.taskId === taskId)) return current;
  const next = [...current, { taskId, appliedAt: new Date().toISOString() }];
  localStorage.setItem(APPLY_KEY, JSON.stringify(next));
  return next;
}

export function removeApplication(taskId: string): Application[] {
  const next = loadApplications().filter((a) => a.taskId !== taskId);
  localStorage.setItem(APPLY_KEY, JSON.stringify(next));
  return next;
}
