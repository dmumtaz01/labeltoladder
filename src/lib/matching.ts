// Candidate-side matching: given a CandidateProfile, score tasks by fit.
import type { CandidateProfile } from "./types";
import type { DbTask } from "./db";

export type JobMatch = {
  task: DbTask;
  score: number; // 0-100
  meetsLevel: boolean;
  langOverlap: boolean;
  interestOverlap: boolean;
  reasons: string[];
  gap: number;
};

const INTEREST_TO_CATEGORY: Record<string, DbTask["category"][]> = {
  Writing: ["review", "rating", "training"],
  "Translating for friends": ["translation"],
  "Customer service": ["rating", "training", "review"],
  "Tutoring / teaching": ["training", "review"],
  Coding: ["review", "training"],
  "Reading news": ["review", "rating"],
  "Social media": ["rating", "annotation"],
  "Design / art": ["annotation"],
  "Local culture": ["translation", "annotation"],
};

export function matchJobsForCandidate(
  profile: CandidateProfile,
  tasks: DbTask[],
): JobMatch[] {
  const r = profile.testResults;
  const o = profile.onboarding;
  const s = profile.screener;
  const myLangs = o?.languages ?? [];
  const myInterests = s?.interests ?? [];
  const myLevel = r?.level ?? 0;

  return tasks
    .map((task) => {
      const meetsLevel = myLevel >= task.min_level;
      const langOverlap = task.languages.some((l) =>
        myLangs.some((ml) => ml.toLowerCase() === l.toLowerCase()),
      );
      const interestCats = myInterests.flatMap((i) => INTEREST_TO_CATEGORY[i] ?? []);
      const interestOverlap = interestCats.includes(task.category);

      let score = 0;
      const reasons: string[] = [];
      if (meetsLevel) {
        score += 45;
        reasons.push(`Meets Level ${task.min_level}+`);
      }
      if (langOverlap) {
        score += 25;
        reasons.push("Language match");
      }
      if (interestOverlap) {
        score += 15;
        reasons.push("Matches your interests");
      }
      if (r) score += Math.round(r.accuracy * 15);

      return {
        task,
        score: Math.min(100, score),
        meetsLevel,
        langOverlap,
        interestOverlap,
        reasons,
        gap: Math.max(0, task.min_level - myLevel),
      };
    })
    .sort((a, b) => {
      if (a.meetsLevel !== b.meetsLevel) return a.meetsLevel ? -1 : 1;
      return b.score - a.score;
    });
}
