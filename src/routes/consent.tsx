import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/consent")({
  component: ConsentPage,
});

function ConsentPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState({ terms: false, data: false, payouts: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const allAgreed = agreed.terms && agreed.data && agreed.payouts;

  async function handleAccept() {
    if (!user || !allAgreed) return;
    setSubmitting(true);
    const { error } = await supabase.from("consents").insert({ user_id: user.id, version: "v1" });
    setSubmitting(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error(error.message);
      return;
    }
    toast.success("Consent saved.");
    navigate({ to: "/onboarding" });
  }

  return (
    <AppShell title="Consent & Profile">
      <div className="px-5 py-6">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-serif text-2xl">A quick promise</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Before you start, please review and accept how we treat you, your data, and your earnings.
        </p>

        <div className="mt-6 space-y-3">
          {[
            { k: "terms", title: "Fair work terms", body: "You always own your work. You can leave any time. No fees deducted from your payouts." },
            { k: "data", title: "Data & privacy", body: "We store only what's needed to match you to work and verify your Skills Passport. You can request deletion any time." },
            { k: "payouts", title: "Payouts", body: "Approved annotations are paid to your chosen wallet within 7 days. Minimum payout: $5." },
          ].map((it) => {
            const checked = agreed[it.k as keyof typeof agreed];
            return (
              <button
                key={it.k}
                onClick={() => setAgreed({ ...agreed, [it.k]: !checked })}
                className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-spring ${
                  checked ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                  }`}
                >
                  {checked && <Check className="h-4 w-4" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{it.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{it.body}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleAccept}
          disabled={!allAgreed || submitting}
          className="mt-6 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "Saving…" : "Agree & continue"}
        </button>
      </div>
    </AppShell>
  );
}
