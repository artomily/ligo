"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCommunity } from "@/lib/data/repository";
import { seedEventsFor, seedPostsFor } from "@/lib/data/community-content";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { formatCompactNumber } from "@/lib/format";
import { toast } from "sonner";
import { FeedTab } from "@/components/community/feed-tab";
import { EventsTab } from "@/components/community/events-tab";
import { PollsTab } from "@/components/community/polls-tab";
import { ChallengesTab } from "@/components/community/challenges-tab";
import { MembersTab } from "@/components/community/members-tab";
import { MarketplaceTab } from "@/components/community/marketplace-tab";

export default function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const community = getCommunity(slug);
  const mounted = useMounted();

  const joined = useLigoStore((s) => s.joinedCommunities.includes(slug));
  const joinCommunity = useLigoStore((s) => s.joinCommunity);
  const leaveCommunity = useLigoStore((s) => s.leaveCommunity);

  if (!community) notFound();

  const isJoined = mounted && joined;
  const memberCount = community.memberCount + (isJoined ? 1 : 0);
  const onlineNow = Math.max(
    12,
    Math.round(community.memberCount * 0.012)
  );
  const upcomingEvents = seedEventsFor(slug).length;
  const postsToday = seedPostsFor(slug).length;

  const overview = [
    {
      label: "Members",
      value: formatCompactNumber(memberCount),
      icon: Users,
    },
    { label: "Online now", value: formatCompactNumber(onlineNow), online: true },
    {
      label: "Upcoming events",
      value: String(upcomingEvents),
      icon: CalendarDays,
    },
    { label: "New posts", value: String(postsToday) },
  ];

  return (
    <div>
      {/* Banner */}
      <section
        className="border-b border-border"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklch, ${community.accentColor} 10%, var(--background)) 0%, var(--background) 70%)`,
        }}
      >
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-4xl"
              >
                {community.bannerEmoji}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {community.name}
                  </h1>
                  <Badge variant="secondary" className="capitalize">
                    {community.category}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {community.tagline}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden />
                    {community.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden />
                    Since {community.founded}
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              variant={isJoined ? "outline" : "default"}
              className="sm:shrink-0"
              onClick={() => {
                if (isJoined) {
                  leaveCommunity(slug);
                  toast(`Left ${community.name}`);
                } else {
                  joinCommunity(slug);
                  toast.success(`Welcome to ${community.name}!`);
                }
              }}
            >
              {isJoined ? "Joined ✓" : "Join community"}
            </Button>
          </div>

          {/* Live overview — keeps the community feeling alive */}
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {overview.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {"online" in stat && stat.online ? (
                    <span
                      className="size-2 rounded-full bg-emerald-500"
                      aria-hidden
                    />
                  ) : "icon" in stat && stat.icon ? (
                    <stat.icon className="size-3.5" aria-hidden />
                  ) : null}
                  {stat.label}
                </dt>
                <dd className="mt-1 font-mono text-lg font-semibold tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tabs */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Tabs defaultValue="feed">
          <TabsList className="flex w-full justify-start overflow-x-auto">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0">
              <TabsContent value="feed">
                <FeedTab communitySlug={slug} />
              </TabsContent>
              <TabsContent value="events">
                <EventsTab communitySlug={slug} />
              </TabsContent>
              <TabsContent value="polls">
                <PollsTab communitySlug={slug} />
              </TabsContent>
              <TabsContent value="challenges">
                <ChallengesTab communitySlug={slug} />
              </TabsContent>
              <TabsContent value="members">
                <MembersTab communitySlug={slug} />
              </TabsContent>
              <TabsContent value="marketplace">
                <MarketplaceTab communitySlug={slug} />
              </TabsContent>
            </div>

            {/* About sidebar */}
            <aside className="order-first lg:order-last">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">About</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {community.description}
                </p>
              </div>
            </aside>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
