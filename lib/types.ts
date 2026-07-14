export type CommunityCategory = "national" | "club";

export interface Community {
  slug: string;
  name: string;
  category: CommunityCategory;
  tagline: string;
  description: string;
  memberCount: number;
  bannerEmoji: string;
  accentColor: string;
  founded: string;
  location: string;
}

export type ListingCategory =
  | "jersey"
  | "scarf"
  | "signed"
  | "ticket"
  | "sticker"
  | "other";

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  priceUsdt: number;
  imageUrl: string;
  communitySlug: string;
  sellerAddress: `0x${string}`;
  sellerName: string;
  shipsFrom: string;
  condition: "new" | "like-new" | "used";
  createdAt: string;
}

export interface Member {
  name: string;
  address: `0x${string}`;
  role: "organizer" | "member";
  joinedAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  priceUsdt: number;
  sellerAddress: `0x${string}`;
  buyerAddress: `0x${string}`;
  txHash: `0x${string}`;
  createdAt: string;
}

export interface UserProfile {
  displayName: string;
}
