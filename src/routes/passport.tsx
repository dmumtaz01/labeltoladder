import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useCandidateGate } from "@/lib/useCandidate";
import { useAuth } from "@/lib/auth";
import { getLevel } from "@/lib/levels";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Skills Passport — Label-to-Ladder" },
      {
        name: "description",
        content:
          "A portable, verified profile of practical workplace skills — no degree required.",
      },
    ],
  }),
  component: PassportPage,
});

function PassportPage() {
  const navigate = useNavigate();
  const { profile, ready } = useCandidateGate();
  const { signOut } = useAuth();

  if (!ready) return null;

  if (!profile?.screener || !profile.onboarding || !profile.testResults) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold">No Skills Passport yet</h1>
          <p className="mt-3 text-muted-foreground">
            Complete the 10-minute assessment to generate your verified Skills Passport.
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

  const o = profile.onboarding;
  const r = profile.testResults;
  const lvl = getLevel(r.level);
  const completed = profile.completedAt
    ? new Date(profile.completedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
  const id =
    "L2L-" +
    Math.abs(
      hashCode(o.fullName + o.country + (profile.completedAt ?? "")),
    )
      .toString(36)
      .toUpperCase()
      .slice(0, 8);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SiteHeader />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-wider text-secondary">
            Skills Passport
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Verified · Issued {completed}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          {/* Top band */}
          <div className="bg-gradient-hero px-8 py-8 text-primary-foreground md:px-12 md:py-10">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent">
                  Issued by Label-to-Ladder
                </p>
                <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                  {o.fullName}
                </h1>
                <p className="mt-1 text-primary-foreground/80">
                  {o.country} · {o.languages.join(", ")}
                </p>
              </div>
              <div className="rounded-xl bg-card/95 px-6 py-4 text-center text-card-foreground shadow-elegant">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Level
                </p>
                <p className="font-serif text-5xl font-bold leading-none text-primary">
                  {r.level}
                </p>
                <p className="mt-1 text-sm font-semibold text-secondary">{lvl.title}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-8 p-8 md:grid-cols-3 md:p-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="font-serif text-lg font-semibold">Verified strengths</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Stat label="Accuracy" v={pct(r.accuracy)} />
                  <Stat label="Consistency" v={pct(r.consistency)} />
                  <Stat label="Speed" v={pct(r.speed)} />
                  <Stat label="Language" v={pct(r.language)} />
                  <Stat label="Reasoning" v={pct(r.reasoning)} />
                  <Stat label="Reliability" v={pct(r.reliability)} />
                </div>
              </div>

              <div>
                <h2 className="font-serif text-lg font-semibold">Domain & interests</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.screener?.interests.map((i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-xs"
                    >
                      {i}
                    </span>
                  ))}
                </div>
                {profile.screener?.domain && (
                  <p className="mt-3 text-sm italic text-muted-foreground">
                    "{profile.screener.domain}"
                  </p>
                )}
              </div>

              <div>
                <h2 className="font-serif text-lg font-semibold">Cleared for</h2>
                <ul className="mt-2 space-y-1 text-sm">
                  {lvl.exampleTasks.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-sm text-primary">
                  Indicative rate: {lvl.hourly}
                </p>
              </div>
            </div>

            <aside className="space-y-4 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Passport ID
                </p>
                <p className="mt-1 font-mono text-sm font-semibold">{id}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Composite score
                </p>
                <p className="mt-1 font-serif text-2xl font-bold">
                  {Math.round(r.rawScore * 100)} / 100
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Availability
                </p>
                <p className="mt-1 text-sm">{o.hoursPerWeek}h / week</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Device · Internet
                </p>
                <p className="mt-1 text-sm capitalize">
                  {o.device} · {o.internet === "ok" ? "stable" : o.internet}
                </p>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-secondary">
              You're cleared
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              See tasks matched to your Passport
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse open AI work ranked by your level, languages and interests. Apply with one click.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="hero" size="lg">
              Find jobs now
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/results">
            <Button variant="outline">View score breakdown</Button>
          </Link>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
            <Link to="/onboarding">
              <Button variant="hero">Re-take assessment</Button>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 px-3 py-3 text-center">
      <p className="font-serif text-xl font-bold text-primary">{v}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function pct(n: number) {
  return Math.round(n * 100) + "%";
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
