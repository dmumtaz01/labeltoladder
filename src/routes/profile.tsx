import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useCandidateGate } from "@/lib/useCandidate";
import { LogOut, IdCard, Wallet, Trophy, ChevronRight, Briefcase } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile } = useCandidateGate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (!user) return null;
  const level = profile?.testResults?.level ?? 0;
  const name = (user.user_metadata as { full_name?: string })?.full_name || user.email?.split("@")[0];

  return (
    <AppShell title="Profile">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-hero font-serif text-2xl text-primary-foreground shadow-elegant">
            {name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-xl">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-accent/30 px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
              Level {level}
            </span>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {[
            { to: "/passport", icon: IdCard, label: "My Skills Passport" },
            { to: "/jobs", icon: Briefcase, label: "Available jobs" },
            { to: "/payment", icon: Wallet, label: "Earnings & withdraw" },
            { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
          ].map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.to}>
                <Link
                  to={it.to}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-smooth hover:-translate-y-0.5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{it.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive transition-smooth hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </AppShell>
  );
}
