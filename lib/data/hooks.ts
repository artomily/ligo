"use client";

// Client hooks that merge seed data with user-created state from the store.
// Pages consume these so the future Supabase swap happens in one place.
import { useMemo } from "react";
import type { Listing } from "@/lib/types";
import { useLigoStore } from "@/lib/store";
import { getSeedListing, getSeedListings } from "@/lib/data/repository";

export function useListings(communitySlug?: string): Listing[] {
  const userListings = useLigoStore((s) => s.userListings);
  return useMemo(() => {
    const all = [...userListings, ...getSeedListings()];
    return communitySlug
      ? all.filter((l) => l.communitySlug === communitySlug)
      : all;
  }, [userListings, communitySlug]);
}

export function useListing(id: string): Listing | undefined {
  const userListings = useLigoStore((s) => s.userListings);
  return useMemo(
    () => userListings.find((l) => l.id === id) ?? getSeedListing(id),
    [userListings, id]
  );
}
