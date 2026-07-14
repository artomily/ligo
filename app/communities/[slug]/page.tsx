"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ListingCard } from "@/components/listing-card";
import { getCommunity, getMembers } from "@/lib/data/repository";
import { useListings } from "@/lib/data/hooks";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { formatCompactNumber, shortenAddress } from "@/lib/format";
import { toast } from "sonner";

export default function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const community = getCommunity(slug);
  const members = getMembers(slug);
  const listings = useListings(slug);
  const mounted = useMounted();

  const joined = useLigoStore((s) => s.joinedCommunities.includes(slug));
  const joinCommunity = useLigoStore((s) => s.joinCommunity);
  const leaveCommunity = useLigoStore((s) => s.leaveCommunity);

  if (!community) notFound();

  const isJoined = mounted && joined;

  return (
    <div>
      {/* Banner */}
      <section
        className="border-b border-border"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklch, ${community.accentColor} 10%, var(--background)) 0%, var(--background) 70%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
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
                    <Users className="size-3.5" aria-hidden />
                    <span className="font-mono tabular-nums">
                      {formatCompactNumber(
                        community.memberCount + (isJoined ? 1 : 0)
                      )}
                    </span>
                    members
                  </span>
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
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              {community.description}
            </p>

            <Separator className="my-8" />

            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Marketplace
                <span className="ml-2 font-mono text-sm font-normal text-muted-foreground tabular-nums">
                  {listings.length}
                </span>
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sell">Sell an item</Link>
              </Button>
            </div>
            {listings.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center">
                <p className="text-sm font-medium">Nothing listed yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to list a jersey, scarf, or ticket here.
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/sell">List an item</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>

          <aside aria-label="Members">
            <h2 className="text-lg font-semibold">Members</h2>
            <ul className="mt-4 space-y-3">
              {members.map((m) => (
                <li key={m.address} className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {m.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {m.name}
                      {m.role === "organizer" && (
                        <Badge variant="secondary" className="ml-2">
                          Organizer
                        </Badge>
                      )}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {shortenAddress(m.address)}
                    </p>
                  </div>
                </li>
              ))}
              {isJoined && (
                <li className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                      YOU
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">You</p>
                    <p className="text-xs text-muted-foreground">
                      Joined just now
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
