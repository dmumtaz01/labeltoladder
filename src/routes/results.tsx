import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { loadProfile } from "@/lib/storage";
import { getLevel, LEVELS } from "@/lib/levels";
import type { CandidateProfile } from "@/lib/types";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Your readiness score — Label-to-Ladder" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p?.testResults) {
      navigate({ to: "/test" });
      return;
    }
    setProfile(p);
  }, [navigate]);

  if (!profile?.testResults) return null;
  const r = profile.testResults;
  const lvl = getLevel(r.level);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="bg-gradient-hero py-16 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            Assessment complete
          </p>
          <div className="mt-3 grid items-end gap-6 md:grid-cols-[auto_1fr]">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-card text-card-foreground shadow-elegant">
              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Level
                </p>
                <p className="font-serif text-6xl font-bold leading-none text-primary">
                  {r.level}
                </p>
              </div>
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
                You're a <span className="text-accent italic">{lvl.title}</span>.
              </h1>
              <p className="mt-3 max-w-2xl text-primary-foreground/85">{lvl.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-12">
        <h2 className="font-serif text-2xl font-bold">Your readiness breakdown</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Six measured dimensions, weighted into a single readiness score.
        </p>
        <div className="mt-6 grid gap-3">
          <Bar label="Accuracy" value={r.accuracy} weight="35%" />
          <Bar label="Consistency" value={r.consistency} weight="20%" />
          <Bar label="Speed" value={r.speed} weight="15%" />
          <Bar label="Language" value={r.language} weight="20%" />
          <Bar label="Reasoning" value={r.reasoning} weight="10%" />
          <Bar label="Reliability" value={r.reliability} weight="—" />
        </div>
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-secondary">
              Composite score
            </p>
            <p className="mt-1 font-serif text-4xl font-bold">{Math.round(r.rawScore * 100)}</p>
          </div>
          <p className="max-w-xs text-right text-sm text-muted-foreground">
            Higher scores unlock higher-tier paid tasks. You can improve your score by
            re-taking the assessment after practice.
          </p>
        </div>
      </section>

      <section className="bg-gradient-subtle">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h2 className="font-serif text-2xl font-bold">What unlocks for you</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tasks you'd be matched to today, plus your next step on the ladder.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Card title={`Today: ${lvl.title}`} accent>
              <p className="text-sm text-muted-foreground">{lvl.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-secondary">
                Example tasks
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {lvl.exampleTasks.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-sm text-primary">{lvl.hourly}</p>
            </Card>
            {r.level < 6 && (
              <Card title={`Next: ${LEVELS[r.level + 1].title}`}>
                <p className="text-sm text-muted-foreground">
                  {LEVELS[r.level + 1].description}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-secondary">
                  How to get there
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-secondary" />
                    Complete 3 paid micro-tasks at your current level
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-secondary" />
                    Maintain ≥85% accuracy across the next 50 reviews
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-secondary" />
                    Pass the next-level calibration quiz
                  </li>
                </ul>
                <p className="mt-4 font-mono text-sm text-primary">{LEVELS[r.level + 1].hourly}</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold">View your Skills Passport</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          A portable, shareable profile that proves what you can actually do — no degree
          required.
        </p>
        <Link to="/passport" className="mt-6 inline-block">
          <Button variant="hero" size="lg">
            Open my Skills Passport →
          </Button>
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}

function Bar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          weight {weight} · {pct}%
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-accent transition-smooth"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "rounded-xl border bg-card p-6 shadow-card " +
        (accent ? "border-accent/40 ring-1 ring-accent/30" : "border-border")
      }
    >
      <h3 className="font-serif text-xl font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
