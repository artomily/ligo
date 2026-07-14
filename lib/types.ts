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

export interface Post {
  id: string;
  communitySlug: string;
  authorName: string;
  authorAddress: `0x${string}`;
  body: string;
  imageUrl?: string;
  createdAt: string;
  seedLikes: number;
  seedComments: Comment[];
}

export interface Comment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export type EventKind =
  | "watch-party"
  | "meetup"
  | "online"
  | "gathering";

export interface CommunityEvent {
  id: string;
  communitySlug: string;
  kind: EventKind;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  seedAttendees: number;
  host: string;
}

export interface PollOption {
  id: string;
  label: string;
  seedVotes: number;
}

export interface Poll {
  id: string;
  communitySlug: string;
  question: string;
  options: PollOption[];
  createdAt: string;
}

export type ChallengeKind =
  | "daily-quest"
  | "trivia"
  | "invite"
  | "participation"
  | "photo";

export interface Challenge {
  id: string;
  communitySlug: string;
  kind: ChallengeKind;
  title: string;
  description: string;
  points: number;
}
