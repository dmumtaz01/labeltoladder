import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { LEVELS } from "@/lib/levels";
import { CATEGORY_LABELS } from "@/lib/tests";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Label-to-Ladder" },
      {
        name: "description",
        content:
          "How Label-to-Ladder evaluates real skill, scores readiness 0–6, and matches workers to ethical paid AI tasks.",
      },
      { property: "og:title", content: "How Label-to-Ladder works" },
      {
        property: "og:description",
        content:
          "Proof-of-skill assessment, transparent scoring, and a portable Skills Passport.",
      },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            How it works
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold md:text-5xl">
            We measure judgment, not pedigree.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/85">
            The assessment takes about 10 minutes. Every task is designed to surface a real
            workplace skill — the kind AI labs actually pay for.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl font-bold">What you'll be tested on</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Six task types, drawn from real AI training and QA work.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(CATEGORY_LABELS).map(([k, label], i) => (
            <div
              key={k}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <p className="font-mono text-xs text-secondary">
                CATEGORY {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold">{label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {CATEGORY_BLURBS[k as keyof typeof CATEGORY_BLURBS]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-subtle">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-bold">The scoring formula</h2>
            <p className="mt-3 text-muted-foreground">
              We combine six measured dimensions into a single readiness score, then map it
              to a level from 0 to 6.
            </p>
            <pre className="mt-6 overflow-x-auto rounded-lg bg-card p-5 font-mono text-sm shadow-card">
              {`Score =
  0.35 × Accuracy
+ 0.20 × Consistency
+ 0.15 × Speed
+ 0.20 × Language
+ 0.10 × Reasoning`}
            </pre>
            <p className="mt-3 text-sm text-muted-foreground">
              Reliability (completing the full set) is factored separately. Self-reported
              comfort gives a small boost to reward self-awareness.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold">From score to level</h2>
            <ol className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
              {LEVELS.map((l) => (
                <li key={l.level} className="flex items-center gap-4 px-5 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                    {l.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base font-semibold">{l.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {l.description}
                    </p>
                  </div>
                  <span className="hidden font-mono text-xs text-secondary sm:inline">
                    {l.hourly}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold md:text-4xl">Ready to find your level?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Ten minutes. No CV. Walk away with a verified Skills Passport.
        </p>
        <Link
          to="/onboarding"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-elegant transition-smooth hover:bg-primary/90"
        >
          Start the assessment
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}

const CATEGORY_BLURBS = {
  grammar: "Spot grammatically correct, clear sentences across registers.",
  "ai-compare": "Judge which of two AI replies actually serves the user better.",
  factcheck: "Catch confident-sounding but wrong claims — the #1 AI failure mode.",
  scam: "Identify phishing, fraud and predatory job offers. Worker safety matters.",
  tone: "Match tone to context — professional, casual, supportive, urgent.",
  translation: "Evaluate translation by meaning, not literal word swap.",
} as const;
