import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { streamAgent } from "@/lib/aiClient";
import { ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Search = { jobId?: string };

export const Route = createFileRoute("/quality-review")({
  validateSearch: (s: Record<string, unknown>): Search => ({ jobId: s.jobId as string | undefined }),
  component: QualityReviewPage,
});

function QualityReviewPage() {
  const { user, loading } = useAuth();
  const { jobId } = useSearch({ from: "/quality-review" });
  const navigate = useNavigate();
  const [job, setJob] = useState<{ id: string; payload: { prompt?: string }; submission: { answer?: string }; payout_cents: number; task_id: string } | null>(null);
  const [aiText, setAiText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!jobId || !user) return;
    (async () => {
      const { data } = await supabase.from("annotation_jobs").select("*").eq("id", jobId).maybeSingle();
      if (data) setJob(data as never);
    })();
  }, [jobId, user]);

  async function runAiReview() {
    if (!job) return;
    setReviewing(true);
    setAiText("");
    let acc = "";
    await streamAgent({
      messages: [
        {
          role: "user",
          content: `Task: ${job.payload?.prompt ?? "(none)"}\n\nCandidate's submission: ${job.submission?.answer ?? "(empty)"}`,
        },
      ],
      mode: "reviewer",
      onDelta: (c) => {
        acc += c;
        setAiText(acc);
      },
      onError: (e) => toast.error(e),
      onDone: async () => {
        // Parse score
        const m = acc.match(/SCORE:\s*([0-9]+(?:\.[0-9]+)?)/i);
        const s = m ? Math.min(1, Math.max(0, parseFloat(m[1]))) : 0.7;
        setScore(s);
        // Persist review + auto-approve / payment
        await supabase.from("quality_reviews").insert({
          annotation_job_id: job.id,
          reviewer: "ai",
          score: s,
          feedback: acc,
        });
        const newStatus = s >= 0.6 ? "approved" : "rejected";
        await supabase.from("annotation_jobs").update({ status: newStatus }).eq("id", job.id);
        if (newStatus === "approved" && user) {
          await supabase.from("payments").insert({
            candidate_id: user.id,
            annotation_job_id: job.id,
            amount_cents: job.payout_cents,
            status: "paid",
            reference: "ai-auto",
          });
        }
        setDone(true);
        setReviewing(false);
      },
    });
  }

  return (
    <AppShell title="Quality Review">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Step 9</p>
            <h1 className="font-serif text-xl">AI quality review</h1>
          </div>
        </div>

        {!job ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading submission…</p>
        ) : (
          <>
            <article className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your answer</p>
              <p className="mt-2 text-sm">{job.submission?.answer ?? "(empty)"}</p>
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
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI feedback</p>
                  {score !== null && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        score >= 0.6 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {(score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{aiText || "…"}</p>
              </article>
            )}

            {done && (
              <button
                onClick={() => navigate({ to: "/payment" })}
                className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:opacity-90"
              >
                {score !== null && score >= 0.6 ? "View earnings →" : "See payment status →"}
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
