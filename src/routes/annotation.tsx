import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ChatBubble } from "@/components/ChatBubble";
import { PenTool, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  fetchMyAnnotationJobs,
  assignAnnotationJob,
  submitAnnotationJob,
  type AnnotationJob,
} from "@/lib/db";

export const Route = createFileRoute("/annotation")({
  component: AnnotationPage,
});

const SAMPLE_PROMPTS = [
  {
    prompt: "Read the AI's reply below. Is the answer factually correct? If not, write a one-sentence correction.",
    context: "User asked: 'How many continents are there?' AI answered: 'There are 5 continents on Earth.'",
    options: ["Correct", "Incorrect"],
  },
  {
    prompt: "Rate the helpfulness of this AI response on a scale of 1-5.",
    context: "User asked: 'How do I make a good pizza?' AI provided a detailed recipe with steps.",
    options: ["1 - Not helpful", "2 - Somewhat helpful", "3 - Helpful", "4 - Very helpful", "5 - Excellent"],
  },
  {
    prompt: "Does this translation accurately convey the meaning of the original text?",
    context: "Original: 'La belle vue de la montagne' Translation: 'The beautiful view of the mountain'",
    options: ["Yes, accurate", "No, needs correction"],
  },
];

function AnnotationPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<AnnotationJob | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  // Load user's completed jobs for today
  useEffect(() => {
    if (!user) return;
    (async () => {
      const jobs = await fetchMyAnnotationJobs(user.id);
      const approvedToday = jobs.filter(
        (j) =>
          j.status === "approved" &&
          new Date(j.updated_at).toDateString() === new Date().toDateString()
      ).length;
      setCompletedCount(approvedToday);
    })();
  }, [user]);

  // Load or create current job
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingJob(true);
      try {
        const jobs = await fetchMyAnnotationJobs(user.id);
        const existingJob = jobs.find((j) => j.status === "assigned");

        if (existingJob) {
          setJob(existingJob);
          setLoadingJob(false);
          return;
        }

        // Get a random task
        const { data: tasks } = await supabase
          .from("employer_tasks")
          .select("id")
          .limit(10);

        if (!tasks || tasks.length === 0) {
          setLoadingJob(false);
          return;
        }

        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        const randomPrompt = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];

        const newJob = await assignAnnotationJob(
          randomTask.id,
          user.id,
          randomPrompt,
          75 // $0.75 payout
        );
        setJob(newJob);
      } catch (err) {
        console.error("Error loading job:", err);
        toast.error("Failed to load annotation task");
      } finally {
        setLoadingJob(false);
      }
    })();
  }, [user]);

  async function submit() {
    if (!job || !answer.trim()) {
      toast.error("Please provide an answer");
      return;
    }
    setSubmitting(true);
    try {
      await submitAnnotationJob(job.id, { answer });
      toast.success("Submitted! Heading to quality review…");
      setTimeout(() => {
        navigate({ to: "/quality-review", search: { jobId: job.id } as never });
      }, 500);
    } catch (err) {
      console.error("Error submitting:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="font-serif text-xl">Data Annotation</h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Tasks completed today</p>
            <p className="font-semibold text-sm">{completedCount} approved tasks</p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-bold text-success">
            ${(completedCount * 0.75).toFixed(2)}
          </span>
        </div>

        {loadingJob ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading task…</p>
        ) : !job ? (
          <div className="mt-8 rounded-2xl border border-warning bg-warning/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">No tasks available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check back later or browse available jobs
                </p>
                <button
                  onClick={() => navigate({ to: "/jobs" })}
                  className="mt-3 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  View all jobs →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <article className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-sm font-semibold">{job.payload?.prompt}</p>
              {(job.payload as unknown as { context?: string })?.context && (
                <blockquote className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                  {(job.payload as unknown as { context: string }).context}
                </blockquote>
              )}
              <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                💰 Payout: ${(job.payout_cents / 100).toFixed(2)}
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
