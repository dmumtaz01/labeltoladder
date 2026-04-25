import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ChipButton, ProgressBar } from "./onboarding";
import { useCandidateGate, emptyProfile } from "@/lib/useCandidate";
import type { Screener } from "@/lib/types";

export const Route = createFileRoute("/screener")({
  head: () => ({ meta: [{ title: "Skill screener — Label-to-Ladder" }] }),
  component: ScreenerPage,
});

const INTERESTS = [
  "Writing",
  "Reading news",
  "Translating for friends",
  "Tutoring / teaching",
  "Customer service",
  "Social media",
  "Coding",
  "Design / art",
  "Cooking",
  "Sports commentary",
  "Local culture",
  "Religion / philosophy",
];

function ScreenerPage() {
  const navigate = useNavigate();
  const { profile, ready, save } = useCandidateGate();
  const [data, setData] = useState<Screener>({
    interests: [],
    domain: "",
    writingComfort: 3,
    criticalThinking: 3,
  });

  useEffect(() => {
    if (profile?.screener) setData(profile.screener);
  }, [profile]);

  if (!ready) return null;

  if (!profile?.onboarding) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-bold">Let's start at the beginning</h1>
          <p className="mt-3 text-muted-foreground">
            Please complete the short onboarding first.
          </p>
          <Link to="/onboarding" className="mt-6 inline-block">
            <Button variant="hero" size="lg">
              Go to onboarding
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const toggleInterest = (i: string) =>
    setData((d) => ({
      ...d,
      interests: d.interests.includes(i)
        ? d.interests.filter((x) => x !== i)
        : [...d.interests, i],
    }));

  const handleSubmit = async () => {
    const base = profile ?? emptyProfile();
    await save({ ...base, screener: data });
    navigate({ to: "/test" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-4 py-12">
        <ProgressBar step={2} total={4} label="Discovery" />
        <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-8 shadow-card">
          <div>
            <h1 className="font-serif text-2xl font-bold md:text-3xl">
              What are you actually good at?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick everything you've ever spent real time on. Hobbies count. Informal work
              counts.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <ChipButton
                  key={i}
                  active={data.interests.includes(i)}
                  onClick={() => toggleInterest(i)}
                >
                  {i}
                </ChipButton>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="domain">
              If you had to teach someone something, what would it be?
            </label>
            <input
              id="domain"
              value={data.domain}
              onChange={(e) => setData((d) => ({ ...d, domain: e.target.value }))}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. how to negotiate at the market, fixing motorbikes, Twitter trends..."
            />
          </div>

          <ScaleRow
            label="How comfortable are you writing in your strongest language?"
            value={data.writingComfort}
            onChange={(v) =>
              setData((d) => ({ ...d, writingComfort: v as Screener["writingComfort"] }))
            }
            low="Not very"
            high="Very"
          />
          <ScaleRow
            label="How often do you spot mistakes others miss?"
            value={data.criticalThinking}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                criticalThinking: v as Screener["criticalThinking"],
              }))
            }
            low="Rarely"
            high="Almost always"
          />

          <div className="flex items-center justify-between border-t border-border pt-6">
            <Button variant="ghost" onClick={() => navigate({ to: "/onboarding" })}>
              ← Back
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={handleSubmit}
              disabled={data.interests.length === 0}
            >
              Begin practical tests →
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ScaleRow({
  label,
  value,
  onChange,
  low,
  high,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  low: string;
  high: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className="w-20 text-xs text-muted-foreground">{low}</span>
        <div className="flex flex-1 justify-between gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={
                "h-10 flex-1 rounded-md border text-sm font-semibold transition-smooth " +
                (value === n
                  ? "border-primary bg-primary text-primary-foreground shadow"
                  : "border-border bg-background hover:border-primary/40")
              }
            >
              {n}
            </button>
          ))}
        </div>
        <span className="w-20 text-right text-xs text-muted-foreground">{high}</span>
      </div>
    </div>
  );
}
