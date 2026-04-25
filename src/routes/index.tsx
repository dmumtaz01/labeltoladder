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
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1200}
          className="h-full w-full object-cover"
        />
      </div>
      {/* subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary-foreground) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container relative mx-auto grid gap-12 px-4 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Pre-MVP · Pilot in Indonesia, Ghana &amp; Kenya
          </p>
          <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
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
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6 text-sm">
            <Stat value="10 min" label="To complete" />
            <Stat value="6 levels" label="Of progression" />
            <Stat value="0 fees" label="Charged to workers" />
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
    <div className="relative w-full max-w-sm">
      {/* back card */}
      <div className="absolute inset-0 -rotate-3 rounded-2xl bg-secondary/30 shadow-elegant" />
      {/* main card */}
      <div className="relative rotate-1 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-elegant">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Skills Passport
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Verified
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground">
            AO
          </div>
          <div>
            <p className="font-serif text-xl font-semibold leading-tight">Amara Okafor</p>
            <p className="text-xs text-muted-foreground">Lagos, Nigeria · EN, YO, IG</p>
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-border bg-gradient-subtle p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Level</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="font-serif text-3xl font-bold text-primary">3</p>
            <p className="text-sm text-secondary">Reviewer</p>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 rounded-full bg-gradient-accent" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">62% to Level 4 · QA Specialist</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <Pill label="Accuracy" v="92%" />
          <Pill label="Language" v="88%" />
          <Pill label="Reasoning" v="84%" />
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
          ID: LTL-2A9F-7C31 · Issued 2026
        </p>
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

/* ---------- PROBLEM BAND ---------- */
function ProblemBand() {
  const items = [
    { n: "1.4B", label: "Young people locked out of formal jobs by missing credentials." },
    { n: "$13B", label: "Annual spend on AI data labour, growing fast." },
    { n: "0", label: "Trusted platforms screening on judgment, not pedigree." },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="container mx-auto grid gap-8 px-4 py-14 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline gap-4">
            <p className="font-serif text-5xl font-semibold text-secondary">{it.n}</p>
            <p className="text-sm text-muted-foreground">{it.label}</p>
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
      body: "She's 22, lives in Lagos, speaks three languages, never finished university. A friend sends her the link.",
    },
    {
      n: "2",
      title: "She opens the assessment on her phone",
      body: "No CV upload. No credit card. Just her name, country, and the languages she actually speaks.",
    },
    {
      n: "3",
      title: "She takes 10 minutes of practical tests",
      body: "Compare two AI replies. Spot a factual error. Rate a translation. Tasks that test judgment, not memory.",
    },
    {
      n: "4",
      title: "She gets her Skills Passport",
      body: "Level 3 · Reviewer. Verified accuracy 92%. Now visible to vetted AI labs hiring in her language.",
    },
  ];
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="grid gap-12 md:grid-cols-12">
        {/* portrait + quote */}
        <div className="md:col-span-5">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-accent opacity-20 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-border shadow-elegant">
              <img
                src={amaraImg}
                alt="Amara, a young Nigerian woman, taking the Label-to-Ladder assessment on her smartphone"
                width={1024}
                height={1024}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <figure className="absolute -bottom-6 -right-2 max-w-[80%] rounded-xl border border-border bg-card p-4 text-sm shadow-elegant md:-right-6">
              <blockquote className="font-serif italic text-foreground">
                “Nobody asked me for a degree. They asked me to think.”
              </blockquote>
              <figcaption className="mt-2 text-xs text-muted-foreground">
                Amara · Lagos, Nigeria
              </figcaption>
            </figure>
          </div>
        </div>

        {/* steps */}
        <div className="md:col-span-7 md:pl-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            A real candidate journey
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
            What it looks like when Amara applies.
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            One linear path, no gatekeeping. From discovery to verified worker in under fifteen
            minutes.
          </p>

          <ol className="mt-10 space-y-1">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className="group relative grid grid-cols-[auto_1fr] gap-5 rounded-xl border border-transparent p-4 transition-smooth hover:border-border hover:bg-card"
              >
                <div className="relative flex flex-col items-center">
                  <span className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-base font-semibold text-primary-foreground shadow-card">
                    {s.n}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="absolute top-10 h-full w-px bg-border" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-serif text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/onboarding"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 text-base font-semibold text-primary-foreground shadow-elegant transition-smooth hover:bg-primary/90"
            >
              Apply like Amara →
            </Link>
            <span className="text-sm text-muted-foreground">
              Free · 10 minutes · No CV required
            </span>
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
    <section className="bg-card border-y border-border">
      <div className="container mx-auto px-4 py-24">
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
              className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="absolute -right-6 -top-6 font-serif text-7xl font-bold text-muted opacity-60 transition-smooth group-hover:text-accent group-hover:opacity-30">
                {s.n}
              </div>
              <p className="relative font-serif text-xs font-semibold uppercase tracking-wider text-accent">
                Step {s.n}
              </p>
              <h3 className="relative mt-3 font-serif text-lg font-semibold">{s.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{s.body}</p>
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
    <section className="bg-gradient-subtle">
      <div className="container mx-auto px-4 py-24">
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
    <section className="container mx-auto px-4 py-24">
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
            className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 transition-smooth hover:border-primary/40"
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

/* ---------- CTA ---------- */
function CTASection() {
  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-elegant md:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-accent) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <h2 className="relative mx-auto max-w-3xl font-serif text-3xl font-bold md:text-5xl">
          Stop waiting to be picked. Prove what you can do.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Ten minutes. No fees. No CV. Walk away with a verified Skills Passport.
        </p>
        <Link
          to="/onboarding"
          className="relative mt-8 inline-flex h-14 items-center justify-center rounded-md bg-accent px-10 text-base font-semibold text-accent-foreground shadow-elegant transition-smooth hover:brightness-95"
        >
          Start the assessment
        </Link>
      </div>
    </section>
  );
}
