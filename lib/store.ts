"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Comment, Listing, Order, Post } from "@/lib/types";

interface LigoState {
  joinedCommunities: string[];
  userListings: Listing[];
  orders: Order[];
  displayName: string;

  // Community engagement
  userPosts: Post[];
  likedPosts: string[]; // post ids the user liked
  userComments: Record<string, Comment[]>; // postId -> comments
  eventRsvps: string[]; // event ids
  pollVotes: Record<string, string>; // pollId -> optionId
  completedChallenges: string[]; // challenge ids

  joinCommunity: (slug: string) => void;
  leaveCommunity: (slug: string) => void;
  addListing: (listing: Listing) => void;
  removeListing: (id: string) => void;
  addOrder: (order: Order) => void;
  setDisplayName: (name: string) => void;

  addPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  toggleRsvp: (eventId: string) => void;
  votePoll: (pollId: string, optionId: string) => void;
  toggleChallenge: (challengeId: string) => void;
}

export const useLigoStore = create<LigoState>()(
  persist(
    (set) => ({
      joinedCommunities: [],
      userListings: [],
      orders: [],
      displayName: "",
      userPosts: [],
      likedPosts: [],
      userComments: {},
      eventRsvps: [],
      pollVotes: {},
      completedChallenges: [],

      joinCommunity: (slug) =>
        set((s) =>
          s.joinedCommunities.includes(slug)
            ? s
            : { joinedCommunities: [...s.joinedCommunities, slug] }
        ),
      leaveCommunity: (slug) =>
        set((s) => ({
          joinedCommunities: s.joinedCommunities.filter((c) => c !== slug),
        })),
      addListing: (listing) =>
        set((s) => ({ userListings: [listing, ...s.userListings] })),
      removeListing: (id) =>
        set((s) => ({
          userListings: s.userListings.filter((l) => l.id !== id),
        })),
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      setDisplayName: (name) => set({ displayName: name }),

      addPost: (post) => set((s) => ({ userPosts: [post, ...s.userPosts] })),
      toggleLike: (postId) =>
        set((s) => ({
          likedPosts: s.likedPosts.includes(postId)
            ? s.likedPosts.filter((id) => id !== postId)
            : [...s.likedPosts, postId],
        })),
      addComment: (postId, comment) =>
        set((s) => ({
          userComments: {
            ...s.userComments,
            [postId]: [...(s.userComments[postId] ?? []), comment],
          },
        })),
      toggleRsvp: (eventId) =>
        set((s) => ({
          eventRsvps: s.eventRsvps.includes(eventId)
            ? s.eventRsvps.filter((id) => id !== eventId)
            : [...s.eventRsvps, eventId],
        })),
      votePoll: (pollId, optionId) =>
        set((s) => ({ pollVotes: { ...s.pollVotes, [pollId]: optionId } })),
      toggleChallenge: (challengeId) =>
        set((s) => ({
          completedChallenges: s.completedChallenges.includes(challengeId)
            ? s.completedChallenges.filter((id) => id !== challengeId)
            : [...s.completedChallenges, challengeId],
        })),
    }),
    { name: "ligo-store" }
  )
);

// Reputation is derived from participation, never stored directly.
export interface ReputationState {
  points: number;
  posts: number;
  comments: number;
  likes: number;
  rsvps: number;
  votes: number;
  challenges: number;
}

export function selectReputation(s: LigoState): ReputationState {
  const commentCount = Object.values(s.userComments).reduce(
    (n, list) => n + list.length,
    0
  );
  const points =
    s.userPosts.length * 10 +
    commentCount * 4 +
    s.likedPosts.length * 1 +
    s.eventRsvps.length * 6 +
    Object.keys(s.pollVotes).length * 3 +
    s.completedChallenges.length * 8 +
    s.joinedCommunities.length * 5 +
    s.orders.length * 12;
  return {
    points,
    posts: s.userPosts.length,
    comments: commentCount,
    likes: s.likedPosts.length,
    rsvps: s.eventRsvps.length,
    votes: Object.keys(s.pollVotes).length,
    challenges: s.completedChallenges.length,
  };
}

export function reputationTier(points: number): string {
  if (points >= 200) return "Legend";
  if (points >= 100) return "Ultra";
  if (points >= 40) return "Regular";
  if (points >= 10) return "Supporter";
  return "Newcomer";
}
