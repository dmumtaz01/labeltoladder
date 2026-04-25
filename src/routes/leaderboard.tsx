import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Crown, Medal } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [{ title: "Leaderboard · Label-to-Ladder" }],
  }),
  component: LeaderboardPage,
});

type Row = {
  user_id: string;
  full_name: string;
  level: number;
  points: number;
  approved_jobs: number;
  earned_cents: number;
};

function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase
      .from("leaderboard_stats" as never)
      .select("*")
      .order("points", { ascending: false })
      .limit(100)
      .then(({ data }) => setRows((data ?? []) as Row[]));
  }, []);

  return (
    <AppShell title="Leaderboard">
      <div className="bg-gradient-aurora">
        <section className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-accent text-accent-foreground shadow-elegant">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Top earners</p>
              <h1 className="font-serif text-2xl">Global Ladder</h1>
            </div>
          </div>

          {rows.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-soft">
              No rankings yet — be the first to climb the ladder.
            </p>
          ) : (
            <ol className="mt-6 space-y-2">
              {rows.map((r, i) => (
                <li
                  key={r.user_id}
                  className={`flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-spring hover:-translate-y-0.5 ${
                    i < 3 ? "border-accent/40" : ""
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-serif text-lg ${
                      i === 0
                        ? "bg-accent text-accent-foreground"
                        : i === 1
                        ? "bg-secondary text-secondary-foreground"
                        : i === 2
                        ? "bg-warning/30 text-warning-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i === 0 ? <Crown className="h-4 w-4" /> : i === 1 || i === 2 ? <Medal className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.full_name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      Level {r.level} · {r.approved_jobs} jobs · ${(r.earned_cents / 100).toFixed(2)} earned
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                    {r.points} pts
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </AppShell>
  );
}
