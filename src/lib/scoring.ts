import type { Screener, TaskAnswer, TestResults } from "./types";
import { TEST_BANK } from "./tests";

// Map raw answers + screener context into a 0–1 readiness score and a 0–6 level.
// Formula (from PRD §12):
//   Score = 0.35*A + 0.20*C + 0.15*S + 0.20*L + 0.10*R
// where A=accuracy, C=consistency, S=speed, L=language, R=reasoning.
// We also factor reliability (completion rate) lightly.

export function computeResults(answers: TaskAnswer[], screener: Screener | null): TestResults {
  const total = answers.length || 1;
  const correctCount = answers.filter((a) => a.correct).length;
  const accuracy = correctCount / total;

  // Consistency: how stable accuracy is across categories. Stdev of per-category accuracy.
  const byCat = new Map<string, { c: number; t: number }>();
  for (const a of answers) {
    const task = TEST_BANK.find((t) => t.id === a.taskId);
    if (!task) continue;
    const e = byCat.get(task.category) ?? { c: 0, t: 0 };
    e.t += 1;
    if (a.correct) e.c += 1;
    byCat.set(task.category, e);
  }
  const catAcc = Array.from(byCat.values()).map((e) => e.c / Math.max(1, e.t));
  const mean = catAcc.reduce((s, v) => s + v, 0) / Math.max(1, catAcc.length);
  const variance =
    catAcc.reduce((s, v) => s + (v - mean) * (v - mean), 0) / Math.max(1, catAcc.length);
  const consistency = Math.max(0, 1 - Math.sqrt(variance) * 1.5);

  // Speed: median time per task, normalized. <8s great, >40s weak.
  const times = answers.map((a) => a.msSpent).sort((x, y) => x - y);
  const median = times[Math.floor(times.length / 2)] ?? 15000;
  const speed = clamp(1 - (median - 8000) / 32000, 0, 1);

  // Language vs reasoning sub-scores by tagged dimensions.
  const dimScore = (dim: "language" | "reasoning" | "accuracy") => {
    const subset = answers.filter((a) => {
      const t = TEST_BANK.find((tt) => tt.id === a.taskId);
      return t?.dims.includes(dim);
    });
    if (subset.length === 0) return accuracy;
    return subset.filter((a) => a.correct).length / subset.length;
  };
  const language = dimScore("language");
  const reasoning = dimScore("reasoning");

  // Reliability: completed all tasks → 1.0; partial → linear.
  const reliability = clamp(total / TEST_BANK.length, 0, 1);

  const rawScore =
    0.35 * accuracy + 0.2 * consistency + 0.15 * speed + 0.2 * language + 0.1 * reasoning;

  // Self-reported screener gives a small boost (max +0.04) to reward self-awareness.
  const screenerBoost = screener
    ? ((screener.writingComfort + screener.criticalThinking - 2) / 8) * 0.04
    : 0;

  const finalScore = clamp(rawScore + screenerBoost, 0, 1);

  // Map to level 0–6 with an accuracy floor for higher levels.
  let level: TestResults["level"] = 0;
  if (accuracy < 0.4) level = 0;
  else if (finalScore < 0.45) level = 1;
  else if (finalScore < 0.6) level = 2;
  else if (finalScore < 0.72) level = 3;
  else if (finalScore < 0.82) level = 4;
  else if (finalScore < 0.9) level = 5;
  else level = 6;

  return {
    answers,
    accuracy,
    consistency,
    speed,
    language,
    reasoning,
    reliability,
    rawScore: finalScore,
    level,
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
