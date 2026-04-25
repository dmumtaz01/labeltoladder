import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getLevel } from "@/lib/levels";
import {
  fetchMyTasks,
  createTask,
  fetchApplicantsForTask,
  type DbTask,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import type { Onboarding, TestResults } from "@/lib/types";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Employer Portal — Label-to-Ladder" },
      {
        name: "description",
        content:
          "Post AI tasks and find verified, ethically-matched candidates by skill level, language, and availability.",
      },
    ],
  }),
  component: EmployerPage,
});

type ApplicantRow = {
  user_id: string;
  full_name: string | null;
  level: number | null;
  onboarding: Onboarding | null;
  test_results: TestResults | null;
  applied_at: string;
};

function EmployerPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [selected, setSelected] = useState<DbTask | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantRow[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMyTasks(user.id).then((t) => {
      setTasks(t);
      setSelected(t[0] ?? null);
      setTasksLoaded(true);
    });
  }, [user]);

  useEffect(() => {
    if (!selected) {
      setApplicants([]);
      return;
    }
    loadApplicants(selected.id);
  }, [selected]);

  async function loadApplicants(taskId: string) {
    const apps = await fetchApplicantsForTask(taskId);
    if (apps.length === 0) {
      setApplicants([]);
      return;
    }
    const ids = apps.map((a) => a.candidate_id);
    const [{ data: profiles }, { data: cands }] = await Promise.all([
      supabase.from("profiles").select("id, full_name").in("id", ids),
      supabase
        .from("candidate_profiles")
        .select("user_id, level, onboarding, test_results")
        .in("user_id", ids),
    ]);
    const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
    const candMap = new Map((cands ?? []).map((c) => [c.user_id, c]));
    setApplicants(
      apps.map((a) => {
        const c = candMap.get(a.candidate_id);
        return {
          user_id: a.candidate_id,
          full_name: nameMap.get(a.candidate_id) ?? null,
          level: c?.level ?? null,
          onboarding: (c?.onboarding as Onboarding | null) ?? null,
          test_results: (c?.test_results as TestResults | null) ?? null,
          applied_at: a.applied_at,
        };
      }),
    );
  }

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold">Sign in as an employer</h1>
          <p className="mt-3 text-muted-foreground">
            Create a free account to post tasks and review verified candidates.
          </p>
          <Link to="/auth" className="mt-6 inline-block">
            <Button variant="hero" size="lg">
              Sign in / Sign up
            </Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary">
              Employer Portal
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold">Tasks &amp; applicants</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Post a task. Candidates with a verified Skills Passport apply with one click.
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Post a task"}
          </Button>
        </div>

        {showForm && (
          <NewTaskForm
            employerId={user.id}
            onCreate={async (input) => {
              const t = await createTask(input);
              setTasks((cur) => [t, ...cur]);
              setSelected(t);
              setShowForm(false);
            }}
          />
        )}

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Your tasks ({tasks.length})
            </p>
            {tasksLoaded && tasks.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No tasks yet. Post your first one above.
              </p>
            )}
            {tasks.map((t) => {
              const isActive = t.id === selected?.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`w-full rounded-lg border px-4 py-4 text-left transition-smooth ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-elegant"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                      L{t.min_level}+
                    </span>
                  </div>
                  <p className="mt-1.5 font-semibold leading-snug">{t.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground capitalize">{t.category}</p>
                  <p className="mt-2 font-mono text-xs text-primary">{t.hourly}</p>
                </button>
              );
            })}
          </aside>

          <section>
            {selected ? (
              <>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {selected.employer_name}
                      </p>
                      <h2 className="mt-1 font-serif text-2xl font-bold">{selected.title}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Tag>{selected.category}</Tag>
                      <Tag>Level {selected.min_level}+</Tag>
                      {selected.languages.map((l) => (
                        <Tag key={l}>{l}</Tag>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{selected.description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4 text-sm">
                    <Field label="Pay" value={selected.hourly} />
                    <Field label="Est. hours" value={`${selected.hours_estimate}h`} />
                    <Field
                      label="Min level"
                      value={`L${selected.min_level} ${getLevel(selected.min_level).title}`}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl font-bold">
                      Applicants{" "}
                      <span className="font-sans text-sm font-medium text-muted-foreground">
                        ({applicants.length})
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Verified Skills Passports · ranked by level + accuracy
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {applicants
                      .slice()
                      .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
                      .map((c) => (
                        <ApplicantCard key={c.user_id} c={c} task={selected} />
                      ))}
                    {applicants.length === 0 && (
                      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        No applicants yet. Share your task — qualified candidates will see it on
                        the job board.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <p className="font-serif text-lg font-semibold">No task selected</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Post a task to start receiving applications.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ApplicantCard({ c, task }: { c: ApplicantRow; task: DbTask }) {
  const langOverlap = c.onboarding?.languages?.some((l) =>
    task.languages.some((tl) => tl.toLowerCase() === l.toLowerCase()),
  );
  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-sm transition-smooth hover:shadow-elegant">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-lg font-bold">
              {c.full_name ?? c.onboarding?.fullName ?? "Candidate"}
            </h4>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
              ✓ Verified
            </span>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            {c.onboarding?.country ?? "—"} · {c.onboarding?.languages?.join(", ") ?? "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Level
          </p>
          <p className="font-serif text-2xl font-bold text-primary">L{c.level ?? "?"}</p>
        </div>
      </div>

      {c.test_results && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Mini label="Accuracy" value={`${Math.round(c.test_results.accuracy * 100)}%`} accent />
          <Mini label="Language" value={`${Math.round(c.test_results.language * 100)}%`} />
          <Mini label="Reasoning" value={`${Math.round(c.test_results.reasoning * 100)}%`} />
          <Mini label="Hours/wk" value={`${c.onboarding?.hoursPerWeek ?? "?"}h`} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {!langOverlap && c.onboarding && (
            <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-[11px] text-warning">
              ⚠ no language overlap
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">
            Applied {new Date(c.applied_at).toLocaleDateString()}
          </span>
        </div>
        <Button size="sm">Invite</Button>
      </div>
    </article>
  );
}

function NewTaskForm({
  employerId,
  onCreate,
}: {
  employerId: string;
  onCreate: (t: Omit<DbTask, "id" | "created_at">) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [employer, setEmployer] = useState("Your Company");
  const [minLevel, setMinLevel] = useState(2);
  const [hourly, setHourly] = useState("$5 / hr");
  const [hours, setHours] = useState(15);
  const [languages, setLanguages] = useState("English");
  const [category, setCategory] =
    useState<DbTask["category"]>("annotation");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await onCreate({
        employer_id: employerId,
        employer_name: employer,
        title,
        category,
        min_level: minLevel,
        languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
        hourly,
        hours_estimate: hours,
        description: description || "—",
      });
      setTitle("");
      setDescription("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-10 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <h2 className="font-serif text-xl font-bold">Post a new task</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Input label="Task title" value={title} onChange={setTitle} placeholder="e.g. Rate AI replies (English)" />
        <Input label="Employer / team" value={employer} onChange={setEmployer} />
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DbTask["category"])}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {(["annotation", "rating", "review", "translation", "training"] as const).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Min level
          </label>
          <select
            value={minLevel}
            onChange={(e) => setMinLevel(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <option key={l} value={l}>
                L{l} · {getLevel(l).title}
              </option>
            ))}
          </select>
        </div>
        <Input label="Hourly rate" value={hourly} onChange={setHourly} />
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Hours / week
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <Input
          label="Languages (comma-separated)"
          value={languages}
          onChange={setLanguages}
          placeholder="English, French"
        />
        <div className="md:col-span-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" variant="hero" disabled={busy}>
          {busy ? "Publishing…" : "Publish task"}
        </Button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] capitalize text-muted-foreground">
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-semibold">{value}</p>
    </div>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-md border px-3 py-2 text-center ${
        accent ? "border-primary/30 bg-primary/5" : "border-border bg-muted/40"
      }`}
    >
      <p className={`font-serif text-base font-bold ${accent ? "text-primary" : ""}`}>{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
