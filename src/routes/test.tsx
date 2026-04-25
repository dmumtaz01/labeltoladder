import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./onboarding";
import { TEST_BANK, CATEGORY_LABELS } from "@/lib/tests";
import { computeResults } from "@/lib/scoring";
import { useCandidateGate, emptyProfile } from "@/lib/useCandidate";
import type { TaskAnswer } from "@/lib/types";

export const Route = createFileRoute("/test")({
  head: () => ({ meta: [{ title: "Practical assessment — Label-to-Ladder" }] }),
  component: TestPage,
});

function TestPage() {
  const navigate = useNavigate();
  const { profile, ready, save } = useCandidateGate();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<TaskAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [startTime, setStartTime] = useState<number>(() => Date.now());

  const tasks = useMemo(() => TEST_BANK, []);
  const total = tasks.length;
  const task = tasks[idx];

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const ms = Date.now() - startTime;
    const correct = selected === task.correct;
    setAnswers((a) => [...a, { taskId: task.id, selected, correct, msSpent: ms }]);
    setRevealed(true);
  };

  const handleNext = () => {
    if (idx + 1 >= total) {
      finish([...answers]);
      return;
    }
    setIdx(idx + 1);
    setSelected(null);
    setRevealed(false);
    setStartTime(Date.now());
  };

  const finish = async (final: TaskAnswer[]) => {
    const base = profile ?? emptyProfile();
    const results = computeResults(final, base.screener);
    await save({
      ...base,
      testResults: results,
      completedAt: new Date().toISOString(),
    });
    navigate({ to: "/results" });
  };

  if (!ready) return null;

  if (!profile?.screener) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-bold">Almost there</h1>
          <p className="mt-3 text-muted-foreground">
            Please complete the short skill screener first.
          </p>
          <Link to="/screener" className="mt-6 inline-block">
            <Button variant="hero" size="lg">
              Go to screener
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <ProgressBar
          step={idx + 1}
          total={total}
          label={`Practical · ${CATEGORY_LABELS[task.category]}`}
        />
        <div className="mt-8 rounded-2xl border border-border bg-card p-7 shadow-card md:p-10">
          <p className="font-mono text-xs uppercase tracking-wider text-secondary">
            Task {idx + 1} of {total} · {CATEGORY_LABELS[task.category]}
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold leading-snug md:text-[28px]">
            {task.prompt}
          </h1>
          {task.context && (
            <p className="mt-3 rounded-md border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
              {task.context}
            </p>
          )}

          <div className="mt-6 space-y-3">
            {task.options.map((opt, i) => {
              const isSel = selected === i;
              const isCorrect = i === task.correct;
              const showState = revealed && (isSel || isCorrect);
              const state =
                revealed && isCorrect
                  ? "correct"
                  : revealed && isSel && !isCorrect
                    ? "wrong"
                    : isSel
                      ? "selected"
                      : "idle";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={
                    "w-full rounded-lg border px-4 py-4 text-left text-[15px] transition-smooth " +
                    (state === "correct"
                      ? "border-success bg-success/10 text-foreground"
                      : state === "wrong"
                        ? "border-destructive bg-destructive/10 text-foreground"
                        : state === "selected"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted") +
                    (revealed ? " cursor-default" : " cursor-pointer")
                  }
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={
                        "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold " +
                        (state === "correct"
                          ? "border-success bg-success text-success-foreground"
                          : state === "wrong"
                            ? "border-destructive bg-destructive text-destructive-foreground"
                            : state === "selected"
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border")
                      }
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showState && state === "correct" && (
                      <span className="text-xs font-semibold text-success">CORRECT</span>
                    )}
                    {showState && state === "wrong" && (
                      <span className="text-xs font-semibold text-destructive">YOUR PICK</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mt-5 rounded-lg border border-secondary/30 bg-secondary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Why
              </p>
              <p className="mt-1 text-sm text-foreground">{task.explain}</p>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
            <span className="text-xs text-muted-foreground">
              Take your time. We measure thinking, not speed alone.
            </span>
            {!revealed ? (
              <Button
                variant="hero"
                size="lg"
                disabled={selected === null}
                onClick={handleConfirm}
              >
                Submit answer
              </Button>
            ) : (
              <Button variant="hero" size="lg" onClick={handleNext}>
                {idx + 1 < total ? "Next task →" : "See my results"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
