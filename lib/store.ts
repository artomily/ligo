"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Listing, Order } from "@/lib/types";

interface LigoState {
  joinedCommunities: string[];
  userListings: Listing[];
  orders: Order[];
  displayName: string;
  joinCommunity: (slug: string) => void;
  leaveCommunity: (slug: string) => void;
  addListing: (listing: Listing) => void;
  removeListing: (id: string) => void;
  addOrder: (order: Order) => void;
  setDisplayName: (name: string) => void;
}

export const useLigoStore = create<LigoState>()(
  persist(
    (set) => ({
      joinedCommunities: [],
      userListings: [],
      orders: [],
      displayName: "",
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
    }),
    { name: "ligo-store" }
  )
);
