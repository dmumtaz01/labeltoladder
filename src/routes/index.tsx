import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { ArrowRight, Sparkles, Briefcase, Trophy, IdCard, Layers } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCandidate } from "@/lib/useCandidate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Label-to-Ladder — Earn from your real skills" },
      { name: "description", content: "Take practical AI tests, earn a verified Skills Passport, get matched to paid AI work." },
      { property: "og:title", content: "Label-to-Ladder" },
      { property: "og:description", content: "The on-ramp to ethical, paid AI work." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { user, loading } = useAuth();
  const { profile, ready } = useCandidate();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/assessment" });
    }
  }, [user, loading, navigate]);

  if (loading || (user && !ready)) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden bg-gradient-aurora px-5 pb-8 pt-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-soft">
          <Sparkles className="h-3 w-3 text-primary" /> AI-guided · Mobile-first
        </div>
        <h1 className="mt-4 font-serif text-[2.5rem] leading-[1.05] tracking-tight">
          Earn from your <span className="italic text-primary">real</span> skills.
        </h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Prove what you can do with a 10-minute test. Get matched to paid AI work that fits you.
        </p>
        <div className="mt-5 flex gap-2">
          <Link
            to="/auth"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-spring hover:-translate-y-0.5"
          >
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/journey"
            className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-smooth hover:bg-secondary"
          >
            See journey
          </Link>
        </div>
      </section>

      <section className="px-5 py-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Quick start</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Tile to="/onboarding" icon={Sparkles} title="Start assessment" subtitle="10 min · earn passport" tone="primary" />
          <Tile to="/jobs" icon={Briefcase} title="Find work" subtitle="Match to AI tasks" tone="accent" />
          <Tile to="/passport" icon={IdCard} title="Skills Passport" subtitle="Your verified profile" tone="card" />
          <Tile to="/leaderboard" icon={Trophy} title="Leaderboard" subtitle="Climb the ladder" tone="card" />
        </div>
      </section>

      <section className="px-5 pb-12">
        <Link
          to="/journey"
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-spring hover:-translate-y-0.5"
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Your 12-step journey</p>
            <p className="text-xs text-muted-foreground">Sign-up · Test · Passport · Earn</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-smooth group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      </section>
    </AppShell>
  );
}

function Tile({
  to, icon: Icon, title, subtitle, tone,
}: {
  to: string;
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  tone: "primary" | "accent" | "card";
}) {
  const cls = {
    primary: "bg-gradient-hero text-primary-foreground border-transparent",
    accent: "bg-gradient-accent text-accent-foreground border-transparent",
    card: "bg-card text-card-foreground border-border",
  }[tone];
  return (
    <Link
      to={to}
      className={`relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-3 shadow-soft transition-spring hover:-translate-y-1 ${cls}`}
    >
      <Icon className="h-5 w-5 opacity-80" />
      <div>
        <p className="text-sm font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 text-[11px] opacity-75">{subtitle}</p>
      </div>
    </Link>
  );
}
