import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ChatBubble } from "@/components/ChatBubble";
import { PenTool, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/annotation")({
  component: AnnotationPage,
});

type Job = {
  id: string;
  task_id: string;
  payload: { prompt: string; options?: string[] } | null;
  status: string;
  payout_cents: number;
};

const SAMPLE_PROMPT = {
  prompt: "Read the AI's reply below. Is the answer factually correct? If not, write a one-sentence correction.",
  context: "User asked: 'How many continents are there?' AI answered: 'There are 5 continents on Earth.'",
};

function AnnotationPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: existing } = await supabase
        .from("annotation_jobs")
        .select("*")
        .eq("candidate_id", user.id)
        .eq("status", "assigned")
        .limit(1)
        .maybeSingle();
      if (existing) {
        setJob(existing as unknown as Job);
        return;
      }
      // create a demo job from first available task
      const { data: task } = await supabase
        .from("employer_tasks")
        .select("id")
        .limit(1)
        .maybeSingle();
      if (!task) return;
      const { data: created } = await supabase
        .from("annotation_jobs")
        .insert({
          task_id: task.id,
          candidate_id: user.id,
          payload: SAMPLE_PROMPT,
          payout_cents: 75,
        })
        .select()
        .single();
      if (created) setJob(created as unknown as Job);
    })();
  }, [user]);

  async function submit() {
    if (!job || !answer.trim()) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("annotation_jobs")
      .update({ submission: { answer }, status: "submitted", submitted_at: new Date().toISOString() })
      .eq("id", job.id);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Submitted! Heading to quality review…");
    navigate({ to: "/quality-review", search: { jobId: job.id } as never });
  }

  return (
    <AppShell title="Annotation">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Active task</p>
            <h1 className="font-serif text-xl">Fact-check this AI reply</h1>
          </div>
        </div>

        {!job ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading task…</p>
        ) : (
          <>
            <article className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-sm font-semibold">{job.payload?.prompt}</p>
              {(job.payload as { context?: string })?.context && (
                <blockquote className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                  {(job.payload as { context: string }).context}
                </blockquote>
              )}
              <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                Payout: ${(job.payout_cents / 100).toFixed(2)}
              </p>
            </article>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Write your annotation here…"
              className="mt-4 w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none ring-primary/30 focus:ring-2"
            />

            <button
              onClick={submit}
              disabled={!answer.trim() || submitting}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
          </>
        )}

        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Need a hand?</p>
          <ChatBubble inline mode="help" greeting="Stuck on this annotation? Tell me what's confusing and I'll help." />
        </div>
      </div>
    </AppShell>
  );
}
