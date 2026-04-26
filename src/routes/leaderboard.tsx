import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { fetchLeaderboardStats, fetchUserLeaderboardStats, type LeaderboardRow } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Trophy, Crown, Medal, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard · Label-to-Ladder" },
      {
        name: "description",
        content: "See the global leaderboard and your ranking among Label-to-Ladder annotators.",
      },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [userStats, setUserStats] = useState<LeaderboardRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const stats = await fetchLeaderboardStats();
        setRows(stats);

        if (user?.id) {
          const myStats = await fetchUserLeaderboardStats(user.id);
          setUserStats(myStats);
        }
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        toast.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const userRank = user && userStats ? rows.findIndex((r) => r.user_id === user.id) + 1 : null;

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

          {/* User's current stats */}
          {userStats && (
            <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/5 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Your position</p>
                  <p className="mt-1 font-serif text-2xl font-bold text-accent">{userRank ? `#${userRank}` : "Unranked"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Points</p>
                  <p className="mt-1 font-bold text-lg">{userStats.points}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">Loading rankings…</p>
          ) : rows.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-soft">
              No rankings yet — be the first to climb the ladder.
            </p>
          ) : (
            <ol className="mt-6 space-y-2">
              {rows.map((r, i) => {
                const isUser = user?.id === r.user_id;
                return (
                  <li
                    key={r.user_id}
                    className={`flex items-center gap-3 rounded-2xl border p-3 shadow-soft transition-spring hover:-translate-y-0.5 ${
                      isUser
                        ? "border-accent/40 bg-accent/5 ring-1 ring-accent/20"
                        : "border-border bg-card"
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
                      {i === 0 ? (
                        <Crown className="h-4 w-4" />
                      ) : i === 1 || i === 2 ? (
                        <Medal className="h-4 w-4" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{r.full_name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">
                        Level {r.level} · {r.approved_jobs} jobs · ${(r.earned_cents / 100).toFixed(2)} earned
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <TrendingUp className="h-3.5 w-3.5 text-success opacity-50" />
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                        {r.points}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* Stats section */}
        <section className="border-t border-border px-5 py-6">
          <h2 className="font-serif text-lg font-semibold">How points are calculated</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Quality score from AI review (0-1000 points)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Consistency bonus (tasks completed per week)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Level multiplier (higher levels earn more)
            </li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
