import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import amaraImg from "@/assets/amara.jpg";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { LEVELS } from "@/lib/levels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Label-to-Ladder — The on-ramp to AI work" },
      {
        name: "description",
        content:
          "Earn from your real skills, not your degree. Take a 10-minute assessment, get a verified Skills Passport, and unlock paid AI work.",
      },
      { property: "og:title", content: "Label-to-Ladder — The on-ramp to AI work" },
      {
        property: "og:description",
        content:
          "Proof-of-skill screening, ethical matching and career progression for the next generation of AI workers.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <ProblemBand />
      <AmaraStory />
      <HowSection />
      <LevelsSection />
      <PrinciplesSection />
      <CTASection />
      <SiteFooter />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="container relative mx-auto grid gap-16 px-4 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-7">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Pre-MVP · Pilot 2026
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Your real skills are worth something.{" "}
            <span className="text-accent">We help you prove it.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-primary-foreground/75">
            A 10-minute practical assessment — no degree, no resume — earns you a verified
            Skills Passport for paid work in the AI economy.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              to="/onboarding"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-7 text-base font-semibold text-accent-foreground transition-smooth hover:brightness-95"
            >
              Start the assessment
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-primary-foreground/80 underline-offset-4 transition-smooth hover:text-primary-foreground hover:underline"
            >
              How it works →
            </Link>
          </div>
        </div>
        <div className="hidden md:col-span-5 md:flex md:items-center md:justify-end">
          <PassportPreview />
        </div>
      </div>
    </section>
  );
}

function PassportPreview() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-elegant">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Skills Passport
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Verified
        </span>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-serif text-base font-semibold text-primary-foreground">
          AO
        </div>
        <div>
          <p className="font-serif text-lg font-semibold leading-tight">Amara Okafor</p>
          <p className="text-xs text-muted-foreground">Lagos, Nigeria · EN, YO, IG</p>
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Level</p>
          <p className="text-xs text-muted-foreground">62% to L4</p>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="font-serif text-3xl font-semibold text-primary">3</p>
          <p className="text-sm text-secondary">Reviewer</p>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[62%] rounded-full bg-secondary" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        <Pill label="Accuracy" v="92%" />
        <Pill label="Language" v="88%" />
        <Pill label="Reasoning" v="84%" />
      </div>
    </div>
  );
}
function Pill({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-md border border-border px-2 py-2">
      <p className="font-semibold text-foreground">{v}</p>
      <p className="mt-0.5 text-muted-foreground">{label}</p>
    </div>
  );
}

/* ---------- PROBLEM BAND ---------- */
function ProblemBand() {
  const items = [
    { n: "1.4B", label: "Young people locked out of formal jobs by missing credentials." },
    { n: "$13B", label: "Annual spend on AI data labour, growing fast." },
    { n: "0", label: "Trusted platforms screening on judgment, not pedigree." },
  ];
  return (
    <section className="border-b border-border">
      <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label}>
            <p className="font-serif text-4xl font-semibold text-foreground">{it.n}</p>
            <p className="mt-3 text-sm text-muted-foreground">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- AMARA STORY ---------- */
function AmaraStory() {
  const steps = [
    {
      n: "1",
      title: "Amara hears about Label-to-Ladder",
      body: "She's 22, lives in Lagos, speaks three languages. A friend sends her the link.",
    },
    {
      n: "2",
      title: "She opens the assessment on her phone",
      body: "No CV upload. No credit card. Just her name, country, and the languages she speaks.",
    },
    {
      n: "3",
      title: "She takes 10 minutes of practical tests",
      body: "Compare two AI replies. Spot a factual error. Rate a translation. Judgment, not memory.",
    },
    {
      n: "4",
      title: "She earns her Skills Passport",
      body: "Level 3 · Reviewer. Verified accuracy 92%. Visible to vetted AI labs hiring in her language.",
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-24">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border">
              <img
                src={amaraImg}
                alt="Amara, a young Nigerian woman, taking the Label-to-Ladder assessment on her smartphone"
                width={1024}
                height={1024}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <figure className="mt-6">
              <blockquote className="font-serif text-xl italic leading-snug text-foreground">
                “Nobody asked me for a degree. They asked me to think.”
              </blockquote>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Amara · Lagos, Nigeria
              </figcaption>
            </figure>
          </div>

          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              A real candidate journey
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
              What it looks like when Amara applies.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              One linear path, no gatekeeping. Discovery to verified worker in fifteen minutes.
            </p>

            <ol className="mt-12">
              {steps.map((s, i) => (
                <li
                  key={s.n}
                  className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-6 last:border-b"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    0{s.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <Link
                to="/onboarding"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 text-base font-semibold text-primary-foreground transition-smooth hover:bg-primary/90"
              >
                Apply like Amara →
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Free · 10 minutes · No CV required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW SECTION ---------- */
function HowSection() {
  const steps = [
    {
      n: "01",
      title: "Onboarding in your language",
      body: "Country, languages, devices, hours you want to work. Mobile-first, low bandwidth.",
    },
    {
      n: "02",
      title: "Practical tests, not trivia",
      body: "Compare AI replies, spot factual errors, judge tone, catch scams. Real signal.",
    },
    {
      n: "03",
      title: "Skills Passport",
      body: "A portable, verifiable profile showing what you can do — plus a level from 0 to 6.",
    },
    {
      n: "04",
      title: "Paid AI work that grows",
      body: "Get matched to ethical, fairly-paid tasks. Unlock higher tiers as your record builds.",
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            How it works
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
            Four steps from invisible talent to verified AI worker.
          </h2>
        </div>
        <div className="mt-14 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-background p-8">
              <p className="font-mono text-xs text-muted-foreground">{s.n}</p>
              <h3 className="mt-4 font-serif text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- LEVELS ---------- */
function LevelsSection() {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              The Ladder
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
              Six levels of real career progression.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Workers don't stay stuck. Earn higher tiers, unlock better-paid work, become a
              Domain Trainer or Team Lead.
            </p>
          </div>
          <ol className="md:col-span-8">
            {LEVELS.map((l) => (
              <li
                key={l.level}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-6 border-t border-border py-5 last:border-b"
              >
                <span className="font-mono text-sm text-muted-foreground">
                  L{l.level}
                </span>
                <div>
                  <p className="font-serif text-lg font-semibold">{l.title}</p>
                  <p className="text-sm text-muted-foreground">{l.description}</p>
                </div>
                <span className="hidden text-right font-mono text-sm text-secondary md:block">
                  {l.hourly}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- PRINCIPLES ---------- */
function PrinciplesSection() {
  const principles = [
    ["Proof", "Proxy"],
    ["Skills", "Degrees"],
    ["Dignity", "Gig exploitation"],
    ["Progression", "Dead-end tasks"],
    ["Transparency", "Hidden labor"],
    ["Inclusion", "Elite filters"],
  ];
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Our principles
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
            What we choose, every time.
          </h2>
        </div>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {principles.map(([yes, no]) => (
            <div
              key={yes}
              className="flex items-center justify-between bg-background px-6 py-5"
            >
              <span className="font-serif text-lg font-semibold text-foreground">{yes}</span>
              <span className="text-sm text-muted-foreground">
                over <span className="line-through">{no}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTASection() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-semibold md:text-5xl">
          Stop waiting to be picked.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Ten minutes. No fees. No CV. Walk away with a verified Skills Passport.
        </p>
        <Link
          to="/onboarding"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground transition-smooth hover:bg-primary/90"
        >
          Start the assessment
        </Link>
      </div>
    </section>
  );
}
