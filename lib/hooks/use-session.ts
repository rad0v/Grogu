"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { UserRole } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useHydrated } from "@/lib/hooks/use-hydrated";

/**
 * Current mock session + hydration state.
 * `loading` is true until the persisted store has rehydrated on the client.
 */
export function useSession() {
  const session = useGroguStore((s) => s.session);
  const hydrated = useHydrated();
  return {
    session,
    user: session?.user ?? null,
    role: session?.role ?? null,
    loading: !hydrated,
    isAuthenticated: hydrated && session != null,
  };
}

/**
 * Guard a client area: redirect to /login when signed out and to the other
 * role's home when the role doesn't match. Returns the same shape as
 * `useSession` plus `allowed`.
 */
export function useRequireRole(role: UserRole) {
  const router = useRouter();
  const { session, loading } = useSession();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace(`/login?next=${role === "tester" ? "/dashboard" : "/developer/dashboard"}`);
      return;
    }
    if (session.role !== role) {
      router.replace(session.role === "tester" ? "/dashboard" : "/developer/dashboard");
    }
  }, [loading, session, role, router]);

  return {
    session,
    user: session?.user ?? null,
    loading,
    allowed: !loading && session?.role === role,
  };
}

/** Where a signed-in user should land. */
export function homePathForRole(role: UserRole) {
  return role === "tester" ? "/dashboard" : "/developer/dashboard";
}
