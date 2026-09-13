"use client";

import { useSyncExternalStore } from "react";

import { useGroguStore } from "@/lib/store/grogu-store";

/**
 * True once the persisted store has rehydrated from localStorage on the client.
 * Gate any UI that reads persisted state behind this to avoid SSR/CSR mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useGroguStore.persist.onFinishHydration(onChange),
    () => useGroguStore.persist.hasHydrated(),
    () => false,
  );
}
