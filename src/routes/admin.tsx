import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { MOCK_CANDIDATES, MOCK_TASKS } from "@/lib/mockData";
import { getLevel, LEVELS } from "@/lib/levels";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Label-to-Ladder" },
      {
        name: "description",
        content:
          "Operations dashboard: candidates, tasks, level distribution, language coverage, and platform health.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const stats = useMemo(() => {
    const total = MOCK_CANDIDATES.length;
    const verified = MOCK_CANDIDATES.filter((c) => c.level > 0).length;
    const avgAcc =
      MOCK_CANDIDATES.reduce((s, c) => s + c.accuracy, 0) / total;
    const avgLevel = MOCK_CANDIDATES.reduce((s, c) => s + c.level, 0) / total;
    const newThisWeek = MOCK_CANDIDATES.filter((c) => c.joinedDays <= 7).length;
    const openTasks = MOCK_TASKS.length;
    const countries = new Set(MOCK_CANDIDATES.map((c) => c.country)).size;
    return { total, verified, avgAcc, avgLevel, newThisWeek, openTasks, countries };
  }, []);

  const distribution = useMemo(() => {
    const buckets = LEVELS.map((l) => ({
      level: l.level,
      title: l.title,
      count: MOCK_CANDIDATES.filter((c) => c.level === l.level).length,
    }));
    const max = Math.max(1, ...buckets.map((b) => b.count));
    return { buckets, max };
  }, []);

  const languages = useMemo(() => {
    const m = new Map<string, number>();
    MOCK_CANDIDATES.forEach((c) =>
      c.languages.forEach((l) => m.set(l, (m.get(l) ?? 0) + 1)),
    );
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 border-b border-border pb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-secondary">
            Internal · Admin Console
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold">Platform overview</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Real-time view of candidates, employer tasks, and skill distribution across the
            Label-to-Ladder network.
          </p>
        </div>

        {/* KPI cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Candidates" value={stats.total} sub={`+${stats.newThisWeek} this week`} />
          <Kpi
            label="Verified passports"
            value={stats.verified}
            sub={`${Math.round((stats.verified / stats.total) * 100)}% of total`}
          />
          <Kpi
            label="Avg. accuracy"
            value={`${Math.round(stats.avgAcc * 100)}%`}
            sub={`Avg. level L${stats.avgLevel.toFixed(1)}`}
          />
          <Kpi
            label="Open tasks"
            value={stats.openTasks}
            sub={`${stats.countries} countries served`}
          />
        </section>

        {/* Level distribution + languages */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Panel title="Level distribution" subtitle="How candidates are clustered across the ladder">
            <div className="space-y-3">
              {distribution.buckets.map((b) => (
                <div key={b.level} className="flex items-center gap-4">
                  <div className="w-24 shrink-0">
                    <p className="font-mono text-xs text-muted-foreground">L{b.level}</p>
                    <p className="text-sm font-semibold">{b.title}</p>
                  </div>
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${(b.count / distribution.max) * 100}%` }}
                    />
                  </div>
                  <div className="w-10 text-right font-mono text-sm font-semibold">{b.count}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Languages" subtitle="Coverage across the network">
            <ul className="space-y-2">
              {languages.map(([lang, n]) => (
                <li
                  key={lang}
                  className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0"
                >
                  <span className="text-sm">{lang}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {n} candidate{n === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        {/* Recent candidates table */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-bold">Recent candidates</h2>
            <Link to="/employer">
              <Button variant="outline" size="sm">
                Open employer view →
              </Button>
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Passport</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Languages</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3 text-right">Accuracy</th>
                  <th className="px-4 py-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CANDIDATES.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                    <td className="px-4 py-3 font-semibold">{c.name}</td>
                    <td className="px-4 py-3">{c.country}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.languages.join(", ")}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                        L{c.level} · {getLevel(c.level).title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {Math.round(c.accuracy * 100)}%
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {c.joinedDays}d ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Open tasks */}
        <section className="mt-10">
          <h2 className="font-serif text-xl font-bold">Open tasks</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {MOCK_TASKS.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] text-muted-foreground">{t.id}</p>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                    L{t.minLevel}+
                  </span>
                </div>
                <p className="mt-1 font-semibold">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.employer}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-mono text-primary">{t.hourly}</span>
                  <span className="text-muted-foreground">
                    {t.languages.join(" · ")} · {t.hoursEstimate}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Demo data · admin console is read-only. Enable Lovable Cloud to wire live metrics.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-bold text-primary">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-serif text-lg font-bold">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}
