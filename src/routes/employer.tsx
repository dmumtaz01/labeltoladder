import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { MOCK_CANDIDATES, MOCK_TASKS, type MockTask } from "@/lib/mockData";
import { getLevel } from "@/lib/levels";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Employer Portal — Label-to-Ladder" },
      {
        name: "description",
        content:
          "Post AI tasks and find verified, ethically-matched candidates by skill level, language, and availability.",
      },
      { property: "og:title", content: "Employer Portal — Label-to-Ladder" },
      {
        property: "og:description",
        content: "Hire by proven skill, not by resume. Verified Skills Passports for every candidate.",
      },
    ],
  }),
  component: EmployerPage,
});

function EmployerPage() {
  const [tasks, setTasks] = useState<MockTask[]>(MOCK_TASKS);
  const [selected, setSelected] = useState<MockTask>(MOCK_TASKS[0]);
  const [showForm, setShowForm] = useState(false);

  const matches = useMemo(() => {
    return MOCK_CANDIDATES.map((c) => {
      const langOverlap = c.languages.some((l) => selected.languages.includes(l));
      const meetsLevel = c.level >= selected.minLevel;
      let score = 0;
      if (meetsLevel) score += 50;
      if (langOverlap) score += 25;
      score += Math.round(c.accuracy * 25);
      return { c, score, langOverlap, meetsLevel };
    })
      .filter((m) => m.meetsLevel)
      .sort((a, b) => b.score - a.score);
  }, [selected]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary">
              Employer Portal
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold">Tasks &amp; matches</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Post a task. We surface candidates whose verified Skills Passport meets your level
              and language requirements.
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Post a task"}
          </Button>
        </div>

        {showForm && (
          <NewTaskForm
            onCreate={(t) => {
              setTasks([t, ...tasks]);
              setSelected(t);
              setShowForm(false);
            }}
          />
        )}

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Tasks list */}
          <aside className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Open tasks ({tasks.length})
            </p>
            {tasks.map((t) => {
              const isActive = t.id === selected.id;
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
                    <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                      L{t.minLevel}+
                    </span>
                  </div>
                  <p className="mt-1.5 font-semibold leading-snug">{t.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.employer}</p>
                  <p className="mt-2 font-mono text-xs text-primary">{t.hourly}</p>
                </button>
              );
            })}
          </aside>

          {/* Selected task + matches */}
          <section>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {selected.employer} · posted {selected.postedDays}d ago
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold">{selected.title}</h2>
                </div>
                <div className="flex gap-2">
                  <Tag>{selected.category}</Tag>
                  <Tag>Level {selected.minLevel}+</Tag>
                  {selected.languages.map((l) => (
                    <Tag key={l}>{l}</Tag>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{selected.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4 text-sm">
                <Field label="Pay" value={selected.hourly} />
                <Field label="Est. hours" value={`${selected.hoursEstimate}h`} />
                <Field label="Min level" value={`L${selected.minLevel} ${getLevel(selected.minLevel).title}`} />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-xl font-bold">
                  Matched candidates{" "}
                  <span className="font-sans text-sm font-medium text-muted-foreground">
                    ({matches.length})
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ranked by skill fit · language overlap · accuracy
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {matches.map(({ c, score, langOverlap }) => (
                  <article
                    key={c.id}
                    className="rounded-lg border border-border bg-card p-5 shadow-sm transition-smooth hover:shadow-elegant"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg font-bold">{c.name}</h4>
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                            ✓ Verified
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {c.id} · {c.country} · {c.languages.join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          Match
                        </p>
                        <p className="font-serif text-2xl font-bold text-primary">{score}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Mini label="Level" value={`L${c.level}`} accent />
                      <Mini label="Accuracy" value={`${Math.round(c.accuracy * 100)}%`} />
                      <Mini label="Language" value={`${Math.round(c.language * 100)}%`} />
                      <Mini label="Reasoning" value={`${Math.round(c.reasoning * 100)}%`} />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {c.interests.slice(0, 3).map((i) => (
                          <span
                            key={i}
                            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {i}
                          </span>
                        ))}
                        {!langOverlap && (
                          <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-[11px] text-warning">
                            ⚠ no language overlap
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Passport
                        </Button>
                        <Button size="sm">Invite</Button>
                      </div>
                    </div>
                  </article>
                ))}
                {matches.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No candidates currently meet this task's level requirement.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Demo data · candidate matching is local. Connect{" "}
          <Link to="/" className="underline">
            Lovable Cloud
          </Link>{" "}
          to persist tasks and invitations.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function NewTaskForm({ onCreate }: { onCreate: (t: MockTask) => void }) {
  const [title, setTitle] = useState("");
  const [employer, setEmployer] = useState("Your Company");
  const [minLevel, setMinLevel] = useState(2);
  const [hourly, setHourly] = useState("$5 / hr");
  const [languages, setLanguages] = useState("English");
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      id: "T-" + Math.floor(2000 + Math.random() * 7000),
      employer,
      title,
      category: "annotation",
      minLevel,
      languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
      hourly,
      hoursEstimate: 15,
      postedDays: 0,
      description: description || "—",
    });
  };

  return (
    <form
      onSubmit={submit}
      className="mb-10 rounded-xl border border-primary/30 bg-primary/5 p-6"
    >
      <h2 className="font-serif text-xl font-bold">Post a new task</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Input label="Task title" value={title} onChange={setTitle} placeholder="e.g. Rate AI replies (English)" />
        <Input label="Employer / team" value={employer} onChange={setEmployer} />
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
        <Button type="submit" variant="hero">
          Publish task
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
