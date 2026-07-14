import type {
  Challenge,
  CommunityEvent,
  Poll,
  Post,
} from "@/lib/types";
import { seedCommunities, seedMembers } from "@/lib/data/seed";

// Deterministic timestamps relative to a fixed "now" so seed content reads as
// recent without changing between renders.
const HOUR = 3600_000;
const DAY = 24 * HOUR;
const base = Date.parse("2026-07-14T09:00:00Z");
const ago = (ms: number) => new Date(base - ms).toISOString();
const ahead = (ms: number) => new Date(base + ms).toISOString();

function memberName(slug: string, i: number): string {
  const members = seedMembers[slug] ?? [];
  return members[i % Math.max(members.length, 1)]?.name ?? "member";
}

// ---- Feed posts ---------------------------------------------------------

const postsBySlug: Record<string, Omit<Post, "communitySlug">[]> = {
  "indonesia-fans": [
    {
      id: "indonesia-fans-p1",
      authorName: "andi.jkt",
      authorAddress: "0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b",
      body: "Watch party for the final is CONFIRMED — Kemang, Saturday 7pm. 40 seats, first come first served. Reply if you're in! 🇮🇩",
      createdAt: ago(2 * HOUR),
      seedLikes: 128,
      seedComments: [
        { id: "c1", authorName: "sari.bdg", body: "Count me in, bringing two more!", createdAt: ago(1.5 * HOUR) },
        { id: "c2", authorName: "kurva.utara", body: "Finally 🔥 saving my seat", createdAt: ago(1 * HOUR) },
      ],
    },
    {
      id: "indonesia-fans-p2",
      authorName: "garuda.collector",
      authorAddress: "0x6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a",
      body: "That last-minute equalizer still gives me chills. Best atmosphere I've felt in years. Garuda di dadaku ❤️",
      imageUrl: "/products/scarf-red.svg",
      createdAt: ago(20 * HOUR),
      seedLikes: 342,
      seedComments: [
        { id: "c3", authorName: "andi.jkt", body: "Goosebumps. What a night.", createdAt: ago(18 * HOUR) },
      ],
    },
    {
      id: "indonesia-fans-p3",
      authorName: "sari.bdg",
      authorAddress: "0x6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e",
      body: "Bandung crew — anyone up for a small meetup before the away match? Thinking a café near Dago.",
      createdAt: ago(2 * DAY),
      seedLikes: 47,
      seedComments: [],
    },
  ],
  "brazil-fans": [
    {
      id: "brazil-fans-p1",
      authorName: "rafa.sp",
      authorAddress: "0x2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c",
      body: "Joga bonito is back. Did you SEE that backheel? Frame it and put it in a museum. 🇧🇷",
      createdAt: ago(5 * HOUR),
      seedLikes: 511,
      seedComments: [
        { id: "c4", authorName: "torcida.rio", body: "Poetry. Pure poetry.", createdAt: ago(4 * HOUR) },
        { id: "c5", authorName: "canarinho.ny", body: "Watched it 20 times already 😭", createdAt: ago(3 * HOUR) },
      ],
    },
    {
      id: "brazil-fans-p2",
      authorName: "torcida.rio",
      authorAddress: "0x2F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a",
      body: "Rio watch party at the beach bar was unreal. Next one we're getting a bigger screen. Obrigado to everyone who came out!",
      imageUrl: "/products/scarf-teal.svg",
      createdAt: ago(1 * DAY),
      seedLikes: 203,
      seedComments: [],
    },
  ],
  "argentina-fans": [
    {
      id: "argentina-fans-p1",
      authorName: "diego.ba",
      authorAddress: "0x3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d",
      body: "Tres estrellas y contando. Who's traveling for the next qualifier? Let's organize a proper Albiceleste section. 🇦🇷",
      createdAt: ago(8 * HOUR),
      seedLikes: 276,
      seedComments: [
        { id: "c6", authorName: "tango.tickets", body: "I've got a block of tickets — DM me", createdAt: ago(7 * HOUR) },
      ],
    },
    {
      id: "argentina-fans-p2",
      authorName: "tres.estrellas",
      authorAddress: "0x4B5c6D7e8F9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c",
      body: "Reminder: the youth-football fundraiser is close to its goal. One more push, muchachos.",
      createdAt: ago(3 * DAY),
      seedLikes: 89,
      seedComments: [],
    },
  ],
  "manchester-united": [
    {
      id: "manchester-united-p1",
      authorName: "stretford.end",
      authorAddress: "0x4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e",
      body: "Away day thread: coach leaves at 9 sharp. Scarves on, songs ready. Glory Glory Man United! 🔴",
      createdAt: ago(3 * HOUR),
      seedLikes: 418,
      seedComments: [
        { id: "c7", authorName: "red.devil.sg", body: "Watching from Singapore at 3am as always 😅", createdAt: ago(2.5 * HOUR) },
        { id: "c8", authorName: "oldtrafford.loft", body: "Saved a seat on the coach for you mate", createdAt: ago(2 * HOUR) },
      ],
    },
    {
      id: "manchester-united-p2",
      authorName: "oldtrafford.loft",
      authorAddress: "0x3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d9E0f1A2b",
      body: "Found my old '99 treble shirt in the loft. Flooding back. What's your favourite United memory?",
      imageUrl: "/products/jersey-red.svg",
      createdAt: ago(1.5 * DAY),
      seedLikes: 264,
      seedComments: [],
    },
  ],
  "fc-barcelona": [
    {
      id: "fc-barcelona-p1",
      authorName: "culer.bcn",
      authorAddress: "0x5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f",
      body: "Més que un club isn't a slogan, it's how last night felt. La Masia kids running the midfield. The future is blaugrana. 🔵🔴",
      createdAt: ago(6 * HOUR),
      seedLikes: 389,
      seedComments: [
        { id: "c9", authorName: "penya.qatar", body: "Doha penya was going wild 🔥", createdAt: ago(5 * HOUR) },
      ],
    },
    {
      id: "fc-barcelona-p2",
      authorName: "mesqueunclub.mx",
      authorAddress: "0x9A0b1C2d3E4f5A6b7C8d9E0f1A2b3C4d5E6f7A8b",
      body: "Planning a Camp Nou trip in the spring. Anyone from the Americas want to coordinate flights and match tickets?",
      createdAt: ago(2 * DAY),
      seedLikes: 132,
      seedComments: [],
    },
  ],
  "japan-fans": [
    {
      id: "japan-fans-p1",
      authorName: "bluelock.tokyo",
      authorAddress: "0x9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d",
      body: "Samurai Blue friendly next month at the National Stadium. As always: we cheer loud, then we clean the stands. 🇯🇵",
      createdAt: ago(9 * HOUR),
      seedLikes: 174,
      seedComments: [
        { id: "c10", authorName: "harajuku.12", body: "Bringing extra trash bags 🙌", createdAt: ago(8 * HOUR) },
      ],
    },
    {
      id: "japan-fans-p2",
      authorName: "harajuku.12",
      authorAddress: "0x1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d9E0f",
      body: "Dropped a new sticker design for the friendly — the crane one. Feedback welcome before I print!",
      imageUrl: "/products/sticker-yellow.svg",
      createdAt: ago(1 * DAY),
      seedLikes: 96,
      seedComments: [],
    },
  ],
};

export function seedPostsFor(slug: string): Post[] {
  return (postsBySlug[slug] ?? []).map((p) => ({ ...p, communitySlug: slug }));
}

// ---- Events (generated per community) -----------------------------------

export function seedEventsFor(slug: string): CommunityEvent[] {
  const community = seedCommunities.find((c) => c.slug === slug);
  const city = community?.location.split(",")[0] ?? "your city";
  return [
    {
      id: `${slug}-evt-1`,
      communitySlug: slug,
      kind: "watch-party",
      title: "Match Day Watch Party",
      description: `Big screen, full crowd, matchday chants. We take over the whole place for 90 minutes.`,
      location: `${city} — venue shared on RSVP`,
      startsAt: ahead(3 * DAY),
      seedAttendees: 64,
      host: memberName(slug, 0),
    },
    {
      id: `${slug}-evt-2`,
      communitySlug: slug,
      kind: "meetup",
      title: "Supporters Meetup",
      description: "Casual meetup before the away fixture — coffee, kits, and travel planning.",
      location: `${city}`,
      startsAt: ahead(9 * DAY),
      seedAttendees: 28,
      host: memberName(slug, 1),
    },
    {
      id: `${slug}-evt-3`,
      communitySlug: slug,
      kind: "online",
      title: "Post-Match Online Discussion",
      description: "Live voice room to break down the match, player ratings, and what's next.",
      location: "Online",
      startsAt: ahead(3 * DAY + 3 * HOUR),
      seedAttendees: 112,
      host: memberName(slug, 2),
    },
  ];
}

// ---- Polls (generated per community) ------------------------------------

export function seedPollsFor(slug: string): Poll[] {
  const teams: Record<string, [string, string, string]> = {
    "indonesia-fans": ["Marselino", "Witan", "Rafael Struick"],
    "brazil-fans": ["Vinícius Jr", "Rodrygo", "Raphinha"],
    "argentina-fans": ["Julián Álvarez", "Enzo Fernández", "Mac Allister"],
    "manchester-united": ["Højlund", "Garnacho", "Bruno Fernandes"],
    "fc-barcelona": ["Lamine Yamal", "Pedri", "Raphinha"],
    "japan-fans": ["Kubo", "Mitoma", "Kamada"],
  };
  const [a, b, c] = teams[slug] ?? ["Player A", "Player B", "Player C"];
  return [
    {
      id: `${slug}-poll-1`,
      communitySlug: slug,
      question: "Man of the Match?",
      createdAt: ago(6 * HOUR),
      options: [
        { id: `${slug}-poll-1-o1`, label: a, seedVotes: 142 },
        { id: `${slug}-poll-1-o2`, label: b, seedVotes: 98 },
        { id: `${slug}-poll-1-o3`, label: c, seedVotes: 61 },
      ],
    },
    {
      id: `${slug}-poll-2`,
      communitySlug: slug,
      question: "Next match prediction?",
      createdAt: ago(1 * DAY),
      options: [
        { id: `${slug}-poll-2-o1`, label: "Comfortable win", seedVotes: 210 },
        { id: `${slug}-poll-2-o2`, label: "Tight win", seedVotes: 176 },
        { id: `${slug}-poll-2-o3`, label: "Draw", seedVotes: 44 },
        { id: `${slug}-poll-2-o4`, label: "Upset loss", seedVotes: 12 },
      ],
    },
  ];
}

// ---- Challenges (shared templates per community) ------------------------

const challengeTemplates: Omit<Challenge, "id" | "communitySlug">[] = [
  {
    kind: "daily-quest",
    title: "Daily Fan Quest",
    description: "Check in and react to a post today.",
    points: 5,
  },
  {
    kind: "trivia",
    title: "Match Trivia",
    description: "Answer today's trivia about your club's history.",
    points: 10,
  },
  {
    kind: "invite",
    title: "Invite a Friend",
    description: "Bring another supporter into the community.",
    points: 15,
  },
  {
    kind: "participation",
    title: "Community Participation",
    description: "Post, comment, or vote in a poll this week.",
    points: 8,
  },
  {
    kind: "photo",
    title: "Photo Challenge",
    description: "Share a matchday photo with the community.",
    points: 12,
  },
];

export function seedChallengesFor(slug: string): Challenge[] {
  return challengeTemplates.map((t) => ({
    ...t,
    id: `${slug}-ch-${t.kind}`,
    communitySlug: slug,
  }));
}

// Utility used by the events UI.
export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
