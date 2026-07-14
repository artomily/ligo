"use client";

// Client hooks that merge seed data with user-created state from the store.
// Pages consume these so the future Supabase swap happens in one place.
import { useMemo } from "react";
import type { Comment, Listing, Post } from "@/lib/types";
import { useLigoStore } from "@/lib/store";
import { getSeedListing, getSeedListings } from "@/lib/data/repository";
import { seedPostsFor } from "@/lib/data/community-content";

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

export interface FeedPost extends Post {
  likeCount: number;
  liked: boolean;
  comments: Comment[];
}

// Merges seed + user posts for a community, folding in the user's likes and
// comments so the derived counts stay a single source of truth.
export function useFeed(communitySlug: string): FeedPost[] {
  const userPosts = useLigoStore((s) => s.userPosts);
  const likedPosts = useLigoStore((s) => s.likedPosts);
  const userComments = useLigoStore((s) => s.userComments);

  return useMemo(() => {
    const mine = userPosts.filter((p) => p.communitySlug === communitySlug);
    const all = [...mine, ...seedPostsFor(communitySlug)];
    return all
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .map((p) => {
        const liked = likedPosts.includes(p.id);
        return {
          ...p,
          liked,
          likeCount: p.seedLikes + (liked ? 1 : 0),
          comments: [...p.seedComments, ...(userComments[p.id] ?? [])],
        };
      });
  }, [userPosts, likedPosts, userComments, communitySlug]);
}
