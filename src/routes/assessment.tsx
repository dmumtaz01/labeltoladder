import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useCandidate } from "@/lib/useCandidate";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Assessment — Label-to-Ladder" },
      {
        name: "description",
        content: "Continue your Label-to-Ladder assessment and complete the next step toward paid AI work.",
      },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const { user, loading } = useAuth();
  const { profile, ready } = useCandidate();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
      return;
    }

    if (!loading && user && ready) {
      if (!profile?.onboarding) {
        navigate({ to: "/onboarding" });
      } else if (!profile?.screener) {
        navigate({ to: "/screener" });
      } else if (!profile?.testResults) {
        navigate({ to: "/test" });
      } else {
        navigate({ to: "/jobs" });
      }
    }
  }, [user, loading, profile, ready, navigate]);

  return (
    <AppShell>
      <div className="flex min-h-screen items-center justify-center px-4 py-16 text-center">
        <div>
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h1 className="text-2xl font-semibold">Preparing your assessment...</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            If you are already signed in, we will take you to the next step in your Label-to-Ladder journey.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
