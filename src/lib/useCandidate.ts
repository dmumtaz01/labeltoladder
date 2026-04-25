// Hook that gates a page on auth and loads the candidate profile from DB.
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./auth";
import { fetchCandidateProfile, saveCandidateProfile } from "./db";
import type { CandidateProfile } from "./types";

export function emptyProfile(): CandidateProfile {
  return { onboarding: null, screener: null, testResults: null, completedAt: null };
}

export function useCandidateGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    fetchCandidateProfile(user.id).then((p) => {
      setProfile(p);
      setReady(true);
    });
  }, [user, loading, navigate]);

  async function save(p: CandidateProfile) {
    if (!user) throw new Error("Not signed in");
    await saveCandidateProfile(user.id, p);
    setProfile(p);
  }

  return { user, profile, ready, save };
}
