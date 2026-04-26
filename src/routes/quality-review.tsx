import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { streamAgent } from "@/lib/aiClient";
import { ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  fetchAnnotationJobById,
  createQualityReview,
  approveAnnotationJob,
  rejectAnnotationJob,
  recordPayment,
  type AnnotationJob,
} from "@/lib/db";

type Search = { jobId?: string };

export const Route = createFileRoute("/quality-review")({
  validateSearch: (s: Record<string, unknown>): Search => ({ jobId: s.jobId as string | undefined }),
  component: QualityReviewPage,
});

function QualityReviewPage() {
  const { user, loading } = useAuth();
  const { jobId } = useSearch({ from: "/quality-review" });
  const navigate = useNavigate();
  const [job, setJob] = useState<AnnotationJob | null>(null);
  const [aiText, setAiText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [done, setDone] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!jobId || !user) return;
    (async () => {
      try {
        const fetchedJob = await fetchAnnotationJobById(jobId);
        if (fetchedJob) {
          setJob(fetchedJob);
        } else {
          toast.error("Job not found");
        }
      } catch (err) {
        console.error("Error loading job:", err);
        toast.error("Failed to load job");
      }
    })();
  }, [jobId, user]);

  async function runAiReview() {
    if (!job || !user) return;
    setReviewing(true);
    setAiText("");
    let acc = "";

    try {
      await streamAgent({
        messages: [
          {
            role: "user",
            content: `Task: ${(job.payload as { prompt?: string })?.prompt ?? "(none)"}\n\nCandidate's submission: ${(job.submission as { answer?: string })?.answer ?? "(empty)"}\n\nPlease review this annotation for accuracy, helpfulness, and completeness. Provide feedback and give a SCORE between 0.0 and 1.0 on the next line in format: SCORE: [number]`,
          },
        ],
        mode: "reviewer",
        onDelta: (c) => {
          acc += c;
          setAiText(acc);
        },
        onError: (e) => {
          toast.error(e);
          setReviewing(false);
        },
        onDone: async () => {
          try {
            // Parse score
            const m = acc.match(/SCORE:\s*([0-9]+(?:\.[0-9]+)?)/i);
            const s = m ? Math.min(1, Math.max(0, parseFloat(m[1]))) : 0.7;
            setScore(s);

            // Persist review
            await createQualityReview(job.id, "ai", s, acc);

            // Auto-approve/reject based on score threshold
            const willApprove = s >= 0.6;
            if (willApprove) {
              await approveAnnotationJob(job.id);
              setApproved(true);
              // Record payment
              await recordPayment(user.id, job.payout_cents, job.id);
              toast.success("✅ Approved! Payment recorded.");
            } else {
              await rejectAnnotationJob(job.id);
              toast.info("Work rejected. Quality score too low. Try the next task.");
            }

            setDone(true);
          } catch (err) {
            console.error("Error processing review:", err);
            toast.error("Failed to process review");
          } finally {
            setReviewing(false);
          }
        },
      });
    } catch (err) {
      console.error("Error in AI review:", err);
      toast.error(err instanceof Error ? err.message : "AI review failed");
      setReviewing(false);
    }
  }

  return (
    <AppShell title="Quality Review">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Quality Check</p>
            <h1 className="font-serif text-xl">AI Review Your Work</h1>
          </div>
        </div>

        {!job ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading submission…</p>
        ) : (
          <>
            <article className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Your Answer</p>
              <p className="text-sm">{(job.submission as { answer?: string })?.answer ?? "(empty)"}</p>
            </article>

            {!done && (
              <button
                onClick={runAiReview}
                disabled={reviewing}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-hero py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:opacity-90 disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                {reviewing ? "AI reviewing…" : "Run AI quality review"}
              </button>
            )}

            {(aiText || done) && (
              <article className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Feedback</p>
                  {score !== null && (
                    <div className="flex items-center gap-2">
                      {score >= 0.6 ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          score >= 0.6 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{aiText || "…"}</p>
              </article>
            )}

            {done && (
              <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                {approved ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">✅ Work Approved!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You earned ${(job.payout_cents / 100).toFixed(2)} for this task.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Work Rejected</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The quality score was below the threshold. Try another task to improve your skills.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {done && (
              <button
                onClick={() => navigate({ to: approved ? "/journey" : "/annotation" })}
                className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:opacity-90"
              >
                {approved ? "View your progress →" : "Start next task →"}
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
