import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Label-to-Ladder" },
      {
        name: "description",
        content: "Sign in or create your free Label-to-Ladder account to take the assessment, get a Skills Passport, and apply for AI tasks.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const userId = user?.id;
  useEffect(() => {
    // Redirect authenticated users to assessment, but wait for a brief moment
    // to ensure auth state is fully settled
    if (!loading && userId) {
      const timer = setTimeout(() => {
        navigate({ to: "/assessment" });
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, loading]);


  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/assessment`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        if (data?.session?.user) {
          return;
        }

        if (data?.user) {
          setInfo(
            "A confirmation email was sent. Please open the link to finish signing up and continue to assessment."
          );
          return;
        }

        setInfo("Sign-up initiated. Please check your email.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/assessment`,
        },
      });
      if (error) throw error;
      // browser will redirect — no need to setBusy(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <p className="font-mono text-xs uppercase tracking-widest text-secondary">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold">
            {mode === "signin" ? "Sign in to continue" : "Start your Skills Passport"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Free forever. No resume needed — just your real skills.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full"
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleIcon /> Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={busy}>
            <fieldset disabled={busy} className="space-y-4">
              {mode === "signup" && (
                <Field
                  label="Full name"
                  name="full_name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Amara Okeke"
                  required
                  autoComplete="name"
                />
              )}
              <Field
                label="Email"
                name="email"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus={mode === "signin"}
              />
              <Field
                label="Password"
                name="password"
                value={password}
                onChange={setPassword}
                type="password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </fieldset>
            {info && (
              <p className="rounded-md bg-primary/10 px-3 py-2 text-xs text-primary">
                {info}
              </p>
            )}
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" variant="hero" className="w-full" disabled={busy}>
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              className="font-semibold text-primary hover:underline"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setInfo(null);
              }}
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/how-it-works" className="hover:underline">
              How it works
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  minLength,
  autoComplete,
  autoFocus,
  disabled,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disabled={disabled}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.86 6.86 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
