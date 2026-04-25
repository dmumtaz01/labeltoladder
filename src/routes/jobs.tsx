import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { loadProfile } from "@/lib/storage";
import { getLevel } from "@/lib/levels";
import {
  matchJobsForCandidate,
  loadApplications,
  saveApplication,
  removeApplication,
  type JobMatch,
} from "@/lib/matching";
import type { CandidateProfile } from "@/lib/types";
import type { MockTask } from "@/lib/mockData";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Find work — Label-to-Ladder" },
      {
        name: "description",
        content:
          "Browse AI tasks matched to your verified Skills Passport. Apply with one click — no resume needed.",
      },
      { property: "og:title", content: "Find work — Label-to-Ladder" },
      {
        property: "og:description",
        content:
          "Personalized AI task matches based on your verified skill level, languages, and interests.",
      },
    ],
  }),
  component: JobsPage,
});

type Filter = "all" | "eligible" | "stretch";

function JobsPage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("eligible");
  const [query, setQuery] = useState("");
  const [applications, setApplications] = useState<string[]>([]);
  const [openTask, setOpenTask] = useState<MockTask | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    setApplications(loadApplications().map((a) => a.taskId));
    setLoaded(true);
  }, []);

  const matches = useMemo<JobMatch[]>(() => {
    if (!profile) return [];
    return matchJobsForCandidate(profile);
  }, [profile]);

  const filtered = useMemo(() => {
    let list = matches;
    if (filter === "eligible") list = list.filter((m) => m.meetsLevel);
    if (filter === "stretch") list = list.filter((m) => !m.meetsLevel);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.task.title.toLowerCase().includes(q) ||
          m.task.employer.toLowerCase().includes(q) ||
          m.task.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [matches, filter, query]);

  const eligibleCount = matches.filter((m) => m.meetsLevel).length;
  const stretchCount = matches.length - eligibleCount;

  const handleApply = (taskId: string) => {
    saveApplication(taskId);
    setApplications(loadApplications().map((a) => a.taskId));
  };
  const handleWithdraw = (taskId: string) => {
    removeApplication(taskId);
    setApplications(loadApplications().map((a) => a.taskId));
  };

  if (!loaded) return null;

  if (!profile?.testResults || !profile.onboarding) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-secondary">
            Job board
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold">
            Get your Skills Passport first
          </h1>
          <p className="mt-3 text-muted-foreground">
            Take the 10-minute assessment so we can match you to real, paid AI tasks.
          </p>
          <Link to="/onboarding" className="mt-6 inline-block">
            <Button variant="hero" size="lg">
              Start the assessment
            </Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const lvl = getLevel(profile.testResults.level);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        {/* Header strip */}
        <div className="mb-8 rounded-2xl border border-border bg-gradient-subtle p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary">
                Welcome back, {profile.onboarding.fullName.split(" ")[0]}
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                Tasks matched to you
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Ranked by your verified Level {profile.testResults.level} ·{" "}
                {lvl.title}, languages and interests. Apply with one click — your
                Passport is shared automatically.
              </p>
            </div>
            <div className="flex gap-3">
              <Stat label="Eligible" value={eligibleCount} accent />
              <Stat label="Stretch" value={stretchCount} />
              <Stat label="Applied" value={applications.length} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <FilterPill active={filter === "eligible"} onClick={() => setFilter("eligible")}>
              Eligible ({eligibleCount})
            </FilterPill>
            <FilterPill active={filter === "stretch"} onClick={() => setFilter("stretch")}>
              Stretch ({stretchCount})
            </FilterPill>
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              All ({matches.length})
            </FilterPill>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, employers…"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm sm:w-72"
          />
        </div>

        {/* Job grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((m) => (
            <JobCard
              key={m.task.id}
              match={m}
              applied={applications.includes(m.task.id)}
              onApply={() => handleApply(m.task.id)}
              onWithdraw={() => handleWithdraw(m.task.id)}
              onOpen={() => setOpenTask(m.task)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="md:col-span-2 rounded-xl border border-dashed border-border p-10 text-center">
              <p className="font-serif text-lg font-semibold">No tasks here yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different filter or check back soon — new tasks post daily.
              </p>
            </div>
          )}
        </div>

        {/* Applied summary */}
        {applications.length > 0 && (
          <div className="mt-12 rounded-xl border border-success/30 bg-success/5 p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-success">
              Applications
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              You've applied to {applications.length} task
              {applications.length === 1 ? "" : "s"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Employers are notified and your Skills Passport is shared. You'll be
              notified when they respond.
            </p>
          </div>
        )}

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Demo data · applications are stored locally. Connect Lovable Cloud to send
          them to employers.
        </p>
      </main>

      {openTask && (
        <TaskDialog
          task={openTask}
          match={matches.find((m) => m.task.id === openTask.id)!}
          applied={applications.includes(openTask.id)}
          onClose={() => setOpenTask(null)}
          onApply={() => {
            handleApply(openTask.id);
          }}
          onWithdraw={() => handleWithdraw(openTask.id)}
        />
      )}

      <SiteFooter />
    </div>
  );
}

function JobCard({
  match,
  applied,
  onApply,
  onWithdraw,
  onOpen,
}: {
  match: JobMatch;
  applied: boolean;
  onApply: () => void;
  onWithdraw: () => void;
  onOpen: () => void;
}) {
  const { task, score, meetsLevel, langOverlap, interestOverlap, reasons, gap } = match;
  return (
    <article
      className={`flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-smooth hover:shadow-elegant ${
        meetsLevel ? "border-border" : "border-dashed border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              {task.id}
            </span>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
              L{task.minLevel}+
            </span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
              {task.category}
            </span>
          </div>
          <h3 className="mt-2 font-serif text-lg font-bold leading-snug">
            {task.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {task.employer} · posted {task.postedDays}d ago
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Match
          </p>
          <p
            className={`font-serif text-2xl font-bold ${
              score >= 75 ? "text-success" : score >= 50 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {score}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {reasons.map((r) => (
          <span
            key={r}
            className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success"
          >
            ✓ {r}
          </span>
        ))}
        {!langOverlap && (
          <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[11px] text-warning">
            ⚠ Language gap
          </span>
        )}
        {!interestOverlap && meetsLevel && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            Outside your stated interests
          </span>
        )}
        {!meetsLevel && (
          <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[11px] text-warning">
            {gap} level{gap === 1 ? "" : "s"} short
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-sm">
        <Field label="Pay" value={task.hourly} strong />
        <Field label="Hours" value={`${task.hoursEstimate}h`} />
        <Field label="Langs" value={task.languages.join(", ")} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {task.description}
      </p>

      <div className="mt-auto flex gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={onOpen} className="flex-1">
          View details
        </Button>
        {applied ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onWithdraw}
            className="flex-1 text-success"
          >
            ✓ Applied — withdraw
          </Button>
        ) : meetsLevel ? (
          <Button size="sm" onClick={onApply} className="flex-1">
            Apply
          </Button>
        ) : (
          <Link to="/onboarding" className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              Re-test to qualify
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}

function TaskDialog({
  task,
  match,
  applied,
  onClose,
  onApply,
  onWithdraw,
}: {
  task: MockTask;
  match: JobMatch;
  applied: boolean;
  onClose: () => void;
  onApply: () => void;
  onWithdraw: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-hero px-6 py-5 text-primary-foreground">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {task.employer} · {task.id}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold">{task.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-card/15 px-2.5 py-0.5 capitalize">
              {task.category}
            </span>
            <span className="rounded-full bg-card/15 px-2.5 py-0.5">
              Level {task.minLevel}+ · {getLevel(task.minLevel).title}
            </span>
            {task.languages.map((l) => (
              <span key={l} className="rounded-full bg-card/15 px-2.5 py-0.5">
                {l}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Pay" value={task.hourly} strong />
            <Field label="Hours / week" value={`${task.hoursEstimate}h`} />
            <Field label="Match score" value={`${match.score}/100`} strong />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              About this task
            </p>
            <p className="mt-2 text-sm leading-relaxed">{task.description}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Why we matched you
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {match.reasons.map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <span className="text-success">✓</span> {r}
                </li>
              ))}
              {!match.langOverlap && (
                <li className="flex items-center gap-2 text-warning">
                  <span>⚠</span> No language overlap with this task
                </li>
              )}
              {!match.meetsLevel && (
                <li className="flex items-center gap-2 text-warning">
                  <span>⚠</span> {match.gap} level
                  {match.gap === 1 ? "" : "s"} short of requirement
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {applied ? (
            <Button variant="outline" onClick={onWithdraw}>
              Withdraw application
            </Button>
          ) : match.meetsLevel ? (
            <Button
              variant="hero"
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              Apply with my Passport →
            </Button>
          ) : (
            <Link to="/onboarding">
              <Button variant="secondary">Re-take assessment</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-4 py-2 text-center ${
        accent ? "border-primary/30 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <p className={`font-serif text-xl font-bold ${accent ? "text-primary" : ""}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className={`mt-0.5 ${strong ? "font-serif text-base font-bold text-primary" : "font-semibold"}`}>
        {value}
      </p>
    </div>
  );
}
