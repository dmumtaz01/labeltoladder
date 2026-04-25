import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, ArrowDownToLine } from "lucide-react";

export const Route = createFileRoute("/payment")({
  component: PaymentPage,
});

type Pay = { id: string; amount_cents: number; currency: string; status: string; created_at: string };

function PaymentPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Pay[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("payments")
      .select("*")
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as Pay[]));
  }, [user]);

  const totalPaid = items.filter((i) => i.status === "paid").reduce((a, b) => a + b.amount_cents, 0);
  const pending = items.filter((i) => i.status === "pending").reduce((a, b) => a + b.amount_cents, 0);

  return (
    <AppShell title="Payment">
      <div className="px-5 py-6">
        <div className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
            <Wallet className="h-4 w-4" /> Available balance
          </div>
          <p className="mt-2 font-serif text-4xl">${(totalPaid / 100).toFixed(2)}</p>
          <p className="mt-1 text-xs opacity-80">${(pending / 100).toFixed(2)} pending</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition-smooth hover:bg-white/25">
            <ArrowDownToLine className="h-3.5 w-3.5" /> Withdraw (min $5)
          </button>
        </div>

        <h2 className="mt-6 font-serif text-lg">History</h2>
        {items.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
            No payments yet — complete an annotation to earn.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-soft"
              >
                <div>
                  <p className="text-sm font-semibold">${(p.amount_cents / 100).toFixed(2)} {p.currency}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    p.status === "paid"
                      ? "bg-success/15 text-success"
                      : p.status === "pending"
                      ? "bg-warning/20 text-warning-foreground"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
