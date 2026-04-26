import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import {
  fetchMyAnnotationJobs,
  fetchMyPayments,
  fetchUserLeaderboardStats,
  type AnnotationJob,
  type LeaderboardRow,
} from "@/lib/db";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  Target,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/daily-summary")({
  head: () => ({
    meta: [
      { title: "Daily Summary · Label-to-Ladder" },
      {
        name: "description",
        content: "See your daily work summary, earnings, and leaderboard position.",
      },
    ],
  }),
  component: DailySummaryPage,
});

function DailySummaryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<AnnotationJob[]>([]);
  const [payments, setPayments] = useState<{ amount_cents: number }[]>([]);
  const [stats, setStats] = useState<LeaderboardRow | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoadingData(true);
        const [jobsData, paymentsData, statsData] = await Promise.all([
          fetchMyAnnotationJobs(user.id),
          fetchMyPayments(user.id),
          fetchUserLeaderboardStats(user.id),
        ]);

        setJobs(jobsData);
        setPayments(paymentsData);
        setStats(statsData);
      } catch (err) {
        console.error("Error loading summary:", err);
        toast.error("Failed to load daily summary");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [user]);

  const today = new Date().toDateString();
  const todaysJobs = jobs.filter(
    (j) => new Date(j.assigned_at).toDateString() === today
  );
  const todaysApproved = todaysJobs.filter((j) => j.status === "approved").length;
  const todaysSubmitted = todaysJobs.filter((j) => j.status === "submitted").length;
  const todaysPending = todaysJobs.filter((j) => j.status === "assigned").length;

  const todaysEarnings = payments
    .filter((p) => new Date(p.created_at ?? new Date()).toDateString() === today)
    .reduce((sum, p) => sum + (p.amount_cents || 0), 0);

  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount_cents || 0), 0);

  return (
    <AppShell title="Daily Summary">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Today</p>
            <h1 className="font-serif text-2xl">Work Summary</h1>
          </div>
        </div>

        {/* Today's Earnings */}
        <div className="mt-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-primary/5 p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-accent" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Today's Earnings
            </p>
          </div>
          <p className="font-serif text-4xl font-bold">
            ${(todaysEarnings / 100).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {todaysApproved} approved tasks
          </p>
        </div>

        {/* Tasks Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatCard
            icon={CheckCircle2}
            label="Approved"
            value={todaysApproved}
            color="success"
          />
          <StatCard icon={Clock} label="In Review" value={todaysSubmitted} color="warning" />
          <StatCard icon={Target} label="Active" value={todaysPending} color="primary" />
        </div>

        {/* Leaderboard Position */}
        {stats && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Your Position
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-accent">{stats.points}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold">L{stats.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">${(stats.earned_cents / 100).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        <div className="mt-6">
          <h2 className="font-semibold text-sm mb-3">Today's Tasks</h2>
          {loadingData ? (
            <p className="text-xs text-muted-foreground">Loading tasks…</p>
          ) : todaysJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">No tasks completed today yet.</p>
              <button
                onClick={() => navigate({ to: "/annotation" })}
                className="mt-3 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Start Annotating →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs truncate">
                      {(job.payload as { prompt?: string })?.prompt?.substring(0, 50) || "Annotation"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          job.status === "approved"
                            ? "bg-success/10 text-success"
                            : job.status === "submitted"
                              ? "bg-warning/10 text-warning"
                              : "bg-primary/10 text-primary"
                        }`}
                      >
                        {job.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ${(job.payout_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {job.status === "approved" && (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 ml-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => navigate({ to: "/annotation" })}
            className="w-full flex items-center justify-between rounded-2xl bg-primary py-3 px-4 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90 transition-smooth"
          >
            <span>Continue Annotating</span>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate({ to: "/leaderboard" })}
            className="w-full flex items-center justify-between rounded-2xl border border-border bg-card py-3 px-4 text-sm font-semibold shadow-soft hover:bg-secondary transition-smooth"
          >
            <span>View Leaderboard</span>
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "success" | "warning" | "primary";
}) {
  const colorClasses = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    primary: "bg-primary/10 text-primary",
  };

  return (
    <div className={`rounded-lg ${colorClasses[color]} p-3 text-center`}>
      <Icon className="h-4 w-4 mx-auto mb-1 opacity-60" />
      <p className="font-bold text-lg">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
