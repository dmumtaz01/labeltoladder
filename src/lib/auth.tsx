import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  roles: string[];
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  roles: [],
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const demoMode = true;

  useEffect(() => {
    if (demoMode) {
  setSession({
    access_token: "demo",
    refresh_token: "demo",
    user: {
      id: "demo-amara",
      email: "amaraokoke@gmail.com"
    }
  } as any);

  setLoading(false);
  return;
}
    let active = true;

    async function initializeSession() {
      if (typeof window !== "undefined") {
        const url = window.location.href;
        const callbackParams = url.includes("access_token") && url.includes("refresh_token");

        if (callbackParams) {
          try {
            const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
            if (!active) return;
            if (error) {
              console.error("Supabase callback URL session exchange failed", error.message);
            }
            if (data?.session) {
              setSession(data.session);
              setLoading(false);
            }
          } catch (err) {
            console.error("Session exchange error:", err);
          }

          // Clean callback params from URL
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          return; // Don't fetch session again if we just set it from callback
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    }

    initializeSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, authState) => {
      if (!active) return;
      setSession(authState.session ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setRoles([]);
      return;
    }

    let active = true;

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          setRoles(data.map((item) => item.role));
        }
      });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      isAuthenticated: Boolean(session?.user),
      roles,
      signOut,
    }),
    [session, loading, roles, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
