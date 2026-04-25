import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  UserPlus, FileCheck2, ListChecks, Sparkles, Brain, IdCard,
  Briefcase, PenTool, ShieldCheck, BadgeDollarSign, Wallet, Trophy
} from "lucide-react";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Your Journey · Label-to-Ladder" },
      { name: "description", content: "12 steps from sign-up to leaderboard — your full path on Label-to-Ladder." },
    ],
  }),
  component: JourneyPage,
});

const STEPS = [
  { n: 1, label: "Sign-up", to: "/auth", icon: UserPlus, desc: "Create your free account in seconds." },
  { n: 2, label: "Consent & Profile", to: "/consent", icon: FileCheck2, desc: "Agree to terms & set up your profile." },
  { n: 3, label: "Questionnaire", to: "/onboarding", icon: ListChecks, desc: "Tell us about your skills, languages, and time." },
  { n: 4, label: "AI-powered clarification", to: "/screener", icon: Sparkles, desc: "An AI guide refines your profile via chat." },
  { n: 5, label: "Micro Skill Test", to: "/test", icon: Brain, desc: "Quick practical test — proves what you can do." },
  { n: 6, label: "Skills Passport", to: "/passport", icon: IdCard, desc: "Get your verified Skills Passport." },
  { n: 7, label: "Job-hub", to: "/jobs", icon: Briefcase, desc: "Browse matched paid AI tasks." },
  { n: 8, label: "Annotation Activity", to: "/annotation", icon: PenTool, desc: "Do real annotation work in-app." },
  { n: 9, label: "Quality Review", to: "/quality-review", icon: ShieldCheck, desc: "AI + human review your work." },
  { n: 10, label: "Score", to: "/passport", icon: BadgeDollarSign, desc: "Your level grows with quality work." },
  { n: 11, label: "Payment", to: "/payment", icon: Wallet, desc: "Earnings, payouts, history." },
  { n: 12, label: "Leaderboard", to: "/leaderboard", icon: Trophy, desc: "See where you stand globally." },
] as const;

function JourneyPage() {
  return (
    <AppShell title="Your Journey">
      <div className="bg-gradient-aurora">
        <section className="px-5 pb-6 pt-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">12 steps</p>
          <h1 className="mt-1 font-serif text-3xl">Sign-up → Leaderboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every Ladder member follows the same proven path. Tap any step to jump in.
          </p>
        </section>

        <ol className="relative mx-5 space-y-3 pb-10">
          <span className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/30" aria-hidden="true" />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <li
                key={s.n}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${i * 60}ms`, animationDuration: "500ms", animationFillMode: "both" }}
              >
                <Link
                  to={s.to}
                  className="group relative flex items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-spring hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
                    <Icon className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                      {s.n}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <span className="self-center text-muted-foreground group-hover:text-primary">→</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </AppShell>
  );
}
