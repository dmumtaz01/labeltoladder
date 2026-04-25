import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadProfile, saveProfile, emptyProfile } from "@/lib/storage";
import type { Onboarding } from "@/lib/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — Label-to-Ladder" },
      { name: "description", content: "Tell us about your country, languages and availability." },
    ],
  }),
  component: OnboardingPage,
});

const COUNTRIES = [
  "Indonesia",
  "Ghana",
  "Kenya",
  "India",
  "Madagascar",
  "Nigeria",
  "Philippines",
  "Bangladesh",
  "Egypt",
  "Other",
];

const LANGUAGE_OPTIONS = [
  "English",
  "French",
  "Bahasa Indonesia",
  "Swahili",
  "Hindi",
  "Twi",
  "Yoruba",
  "Tagalog",
  "Bengali",
  "Arabic",
  "Malagasy",
  "Other",
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [data, setData] = useState<Onboarding>(() => {
    const existing = loadProfile()?.onboarding;
    return (
      existing ?? {
        fullName: "",
        country: "",
        languages: [],
        device: "smartphone",
        internet: "ok",
        hoursPerWeek: 10,
        education: "secondary",
      }
    );
  });

  const update = <K extends keyof Onboarding>(k: K, v: Onboarding[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const toggleLang = (l: string) =>
    setData((d) => ({
      ...d,
      languages: d.languages.includes(l)
        ? d.languages.filter((x) => x !== l)
        : [...d.languages, l],
    }));

  const canContinue = () => {
    if (step === 1) return data.fullName.trim().length >= 2 && data.country.length > 0;
    if (step === 2) return data.languages.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    const profile = loadProfile() ?? emptyProfile();
    saveProfile({ ...profile, onboarding: data });
    navigate({ to: "/screener" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-4 py-12">
        <ProgressBar step={step} total={totalSteps} label="Onboarding" />
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-card">
          {step === 1 && (
            <Step
              title="Welcome — let's start with the basics."
              hint="No CV. No degree required. Your real skills are what counts."
            >
              <div className="space-y-5">
                <div>
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    value={data.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="e.g. Aïsha Mensah"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Country you live in</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {COUNTRIES.map((c) => (
                      <ChipButton
                        key={c}
                        active={data.country === c}
                        onClick={() => update("country", c)}
                      >
                        {c}
                      </ChipButton>
                    ))}
                  </div>
                </div>
              </div>
            </Step>
          )}
          {step === 2 && (
            <Step
              title="Which languages do you speak well?"
              hint="Pick all that apply. Multilingual workers are highly valued."
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LANGUAGE_OPTIONS.map((l) => (
                  <ChipButton
                    key={l}
                    active={data.languages.includes(l)}
                    onClick={() => toggleLang(l)}
                  >
                    {l}
                  </ChipButton>
                ))}
              </div>
            </Step>
          )}
          {step === 3 && (
            <Step
              title="How will you work?"
              hint="We optimize for low bandwidth and mobile-first. No discrimination by device."
            >
              <div className="space-y-5">
                <div>
                  <Label>Primary device</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["smartphone", "laptop", "both"] as const).map((d) => (
                      <ChipButton
                        key={d}
                        active={data.device === d}
                        onClick={() => update("device", d)}
                      >
                        {d[0].toUpperCase() + d.slice(1)}
                      </ChipButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Internet quality</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["fast", "ok", "limited"] as const).map((d) => (
                      <ChipButton
                        key={d}
                        active={data.internet === d}
                        onClick={() => update("internet", d)}
                      >
                        {d === "ok" ? "Stable" : d[0].toUpperCase() + d.slice(1)}
                      </ChipButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Hours per week you can commit</Label>
                  <div className="mt-3 flex items-center gap-4">
                    <input
                      type="range"
                      min={2}
                      max={40}
                      step={1}
                      value={data.hoursPerWeek}
                      onChange={(e) => update("hoursPerWeek", Number(e.target.value))}
                      className="flex-1 accent-[var(--color-secondary)]"
                    />
                    <span className="w-16 rounded-md bg-muted px-3 py-1 text-center font-mono text-sm">
                      {data.hoursPerWeek}h
                    </span>
                  </div>
                </div>
              </div>
            </Step>
          )}
          {step === 4 && (
            <Step
              title="Education (optional)"
              hint="We don't filter by it. We just want to understand the talent we're meeting."
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    ["none", "None"],
                    ["primary", "Primary"],
                    ["secondary", "Secondary"],
                    ["university", "University"],
                  ] as const
                ).map(([k, l]) => (
                  <ChipButton
                    key={k}
                    active={data.education === k}
                    onClick={() => update("education", k)}
                  >
                    {l}
                  </ChipButton>
                ))}
              </div>
            </Step>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              ← Back
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={handleNext}
              disabled={!canContinue()}
            >
              {step < totalSteps ? "Continue" : "Continue to skill screener"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Step({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold md:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function ProgressBar({
  step,
  total,
  label,
}: {
  step: number;
  total: number;
  label: string;
}) {
  const pct = (step / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span>
          Step {step} of {total}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-accent transition-smooth"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ChipButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-md border px-3 py-2 text-sm transition-smooth " +
        (active
          ? "border-primary bg-primary text-primary-foreground shadow"
          : "border-border bg-background hover:border-primary/40 hover:bg-muted")
      }
    >
      {children}
    </button>
  );
}
