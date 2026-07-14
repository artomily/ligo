// Repository layer: today this reads from seed data; when Supabase lands,
// swap these implementations without touching pages or components.
// Client-side user mutations (joins, own listings, orders) live in lib/store.ts
// and are merged in the hooks in lib/data/hooks.ts.
import type { Community, Listing, Member } from "@/lib/types";
import { seedCommunities, seedListings, seedMembers } from "@/lib/data/seed";

export function getCommunities(): Community[] {
  return seedCommunities;
}

export function getCommunity(slug: string): Community | undefined {
  return seedCommunities.find((c) => c.slug === slug);
}

export function getMembers(slug: string): Member[] {
  return seedMembers[slug] ?? [];
}

export function getSeedListings(): Listing[] {
  return [...seedListings].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );
}

export function getSeedListing(id: string): Listing | undefined {
  return seedListings.find((l) => l.id === id);
}
