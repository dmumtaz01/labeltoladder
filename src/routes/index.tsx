import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
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
      <HowSection />
      <LevelsSection />
      <PrinciplesSection />
      <CTASection />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-25 mix-blend-soft-light">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1200}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="container relative mx-auto grid gap-10 px-4 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Pre-MVP · Pilot in Indonesia, Ghana & Kenya
          </p>
          <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Your real skills are worth something.{" "}
            <span className="italic text-accent">We help you prove it.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85 md:text-xl">
            Label-to-Ladder turns hidden human judgment into income. Take a 10-minute
            practical assessment — no degree, no resume, no English-only filters — and earn a
            verified Skills Passport for paid work in the AI economy.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/onboarding"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-7 text-base font-semibold text-accent-foreground shadow-elegant transition-smooth hover:brightness-95"
            >
              Start the assessment →
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-6 text-base font-medium text-primary-foreground transition-smooth hover:bg-primary-foreground/10"
            >
              How it works
            </Link>
          </div>
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 text-sm">
            <Stat value="10 min" label="To complete" />
            <Stat value="6 levels" label="Of progression" />
            <Stat value="0 fees" label="Ever charged to workers" />
          </dl>
        </div>
        <div className="hidden md:col-span-5 md:flex md:items-center md:justify-end">
          <PassportPreview />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-serif text-2xl font-semibold text-accent">{value}</dt>
      <dd className="mt-1 text-primary-foreground/70">{label}</dd>
    </div>
  );
}

function PassportPreview() {
  return (
    <div className="relative w-full max-w-sm rotate-1 rounded-2xl bg-card p-6 text-card-foreground shadow-elegant">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Skills Passport
        </p>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
          Verified
        </span>
      </div>
      <p className="mt-4 font-serif text-2xl font-semibold">Aïsha M.</p>
      <p className="text-sm text-muted-foreground">Accra, Ghana · EN, TWI, FR</p>
      <div className="mt-5 rounded-lg border border-border p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Level</p>
        <p className="mt-1 font-serif text-3xl font-bold text-primary">3</p>
        <p className="text-sm text-secondary">Reviewer</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Pill label="Accuracy" v="92%" />
        <Pill label="Language" v="88%" />
        <Pill label="Reasoning" v="84%" />
      </div>
    </div>
  );
}
function Pill({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-md bg-muted px-2 py-2">
      <p className="font-semibold text-foreground">{v}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function ProblemBand() {
  const items = [
    {
      n: "1.4B",
      label: "Young people locked out of formal jobs by missing credentials.",
    },
    { n: "$13B", label: "Annual spend on AI data labour, growing fast." },
    { n: "0", label: "Trusted platforms screening on judgment, not pedigree." },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline gap-4">
            <p className="font-serif text-4xl font-semibold text-secondary">{it.n}</p>
            <p className="text-sm text-muted-foreground">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowSection() {
  const steps = [
    {
      n: "01",
      title: "Onboarding in your language",
      body: "Tell us your country, languages, devices, and how many hours you want to work. Mobile-first, low bandwidth.",
    },
    {
      n: "02",
      title: "Practical tests, not trivia",
      body: "Compare AI replies, spot factual errors, judge tone, catch scams, fix grammar. Real tasks, real signal.",
    },
    {
      n: "03",
      title: "Skills Passport",
      body: "A portable, verifiable profile that shows employers what you can actually do — plus a level from 0 to 6.",
    },
    {
      n: "04",
      title: "Paid AI work that grows",
      body: "Get matched to ethical, fairly-paid tasks and unlock higher-tier work as your record builds.",
    },
  ];
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
          How it works
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
          A four-step path from invisible talent to verified AI worker.
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant"
          >
            <p className="font-serif text-sm font-semibold text-accent">{s.n}</p>
            <h3 className="mt-3 font-serif text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LevelsSection() {
  return (
    <section className="bg-gradient-subtle">
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
              The Ladder
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Six levels of real career progression.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Workers don't stay stuck doing the same tasks forever. Earn higher tiers, unlock
              better-paid work, and become a Domain Trainer or Team Lead.
            </p>
          </div>
          <ol className="md:col-span-8">
            {LEVELS.map((l) => (
              <li
                key={l.level}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-border py-4 last:border-0"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg font-bold text-primary-foreground">
                  {l.level}
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
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
          Our principles
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
          What we choose, every time.
        </h2>
      </div>
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {principles.map(([yes, no]) => (
          <div
            key={yes}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4"
          >
            <span className="font-serif text-lg font-semibold text-foreground">{yes}</span>
            <span className="text-sm text-muted-foreground">
              over <span className="line-through">{no}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="container mx-auto px-4 pb-12">
      <div className="overflow-hidden rounded-2xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-elegant md:p-16">
        <h2 className="mx-auto max-w-3xl font-serif text-3xl font-bold md:text-5xl">
          Stop waiting to be picked. Prove what you can do.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Ten minutes. No fees. No CV. Walk away with a verified Skills Passport.
        </p>
        <Link
          to="/onboarding"
          className="mt-8 inline-flex h-14 items-center justify-center rounded-md bg-accent px-10 text-base font-semibold text-accent-foreground shadow-elegant transition-smooth hover:brightness-95"
        >
          Start the assessment
        </Link>
      </div>
    </section>
  );
}
