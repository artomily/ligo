"use client";

import { useSyncExternalStore } from "react";

// True only after hydration. Gate reads of the persisted store (localStorage)
// behind this so server and first client render always match.
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
