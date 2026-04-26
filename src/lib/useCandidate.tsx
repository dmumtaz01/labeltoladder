// Hook that gates a page on auth and loads the candidate profile from DB.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./auth";
import { fetchCandidateProfile, saveCandidateProfile } from "./db";
import type { CandidateProfile } from "./types";

export function emptyProfile(): CandidateProfile {
  return { onboarding: null, screener: null, testResults: null, completedAt: null };
}

type CandidateContextType = {
  profile: CandidateProfile | null;
  ready: boolean;
  refreshProfile: () => Promise<void>;
  save: (profile: CandidateProfile) => Promise<void>;
};

const CandidateContext = createContext<CandidateContextType | null>(null);

export function CandidateProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [ready, setReady] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setReady(false);
      return;
    }

    const profileData = await fetchCandidateProfile(user.id);
    setProfile(profileData);
    setReady(true);
  }, [user]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setProfile(null);
      setReady(false);
      return;
    }

    let active = true;

    fetchCandidateProfile(user.id).then((profileData) => {
      if (!active) return;
      setProfile(profileData);
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, [loading, user]);

  const save = useCallback(
    async (profileData: CandidateProfile) => {
      if (!user) throw new Error("Not signed in");
      await saveCandidateProfile(user.id, profileData);
      setProfile(profileData);
      setReady(true);
    },
    [user]
  );

  const value = useMemo(
    () => ({ profile, ready, refreshProfile, save }),
    [profile, ready, refreshProfile, save]
  );

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
}

export function useCandidate() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error("useCandidate must be used within CandidateProvider");
  }
  return context;
}

export function useCandidateGate() {
  const { user, loading } = useAuth();
  const { profile, ready, save } = useCandidate();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  return { user, profile, ready: !loading && ready, save };
}
