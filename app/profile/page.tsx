"use client";

import Link from "next/link";
import { ExternalLink, Medal, Store, UsersRound, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CommunityCard } from "@/components/community-card";
import { ListingCard } from "@/components/listing-card";
import { getCommunities } from "@/lib/data/repository";
import { useShallow } from "zustand/react/shallow";
import {
  reputationTier,
  selectReputation,
  useLigoStore,
} from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { formatUsdt, shortenAddress, timeAgo } from "@/lib/format";

const explorerTxUrl = (hash: string) =>
  `https://sepolia.basescan.org/tx/${hash}`;

export default function ProfilePage() {
  const mounted = useMounted();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const joinedSlugs = useLigoStore((s) => s.joinedCommunities);
  const userListings = useLigoStore((s) => s.userListings);
  const orders = useLigoStore((s) => s.orders);
  const displayName = useLigoStore((s) => s.displayName);
  const reputation = useLigoStore(useShallow(selectReputation));

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const joinedCommunities = getCommunities().filter((c) =>
    joinedSlugs.includes(c.slug)
  );

  const name =
    displayName || (address ? shortenAddress(address) : "Guest fan");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
              <Badge variant="secondary" className="gap-1">
                <Medal className="size-3" aria-hidden />
                {reputationTier(reputation.points)}
              </Badge>
              <Badge variant="outline" className="gap-1 font-mono tabular-nums">
                {reputation.points} pts
              </Badge>
            </div>
            {address ? (
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {address}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Not signed in
              </p>
            )}
          </div>
        </div>
        {!isConnected && (
          <Button onClick={openConnectModal}>
            <Wallet className="size-4" aria-hidden />
            Sign in
          </Button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { label: "Communities", value: joinedCommunities.length, icon: UsersRound },
          { label: "Listings", value: userListings.length, icon: Store },
          { label: "Purchases", value: orders.length, icon: Medal },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <stat.icon className="size-4 text-muted-foreground" aria-hidden />
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Community activity — what reputation is built from */}
      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Community activity</p>
          <p className="text-xs text-muted-foreground">
            {reputationTier(reputation.points)} ·{" "}
            <span className="font-mono tabular-nums">{reputation.points}</span>{" "}
            pts
          </p>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {[
            { label: "Posts", value: reputation.posts },
            { label: "Comments", value: reputation.comments },
            { label: "RSVPs", value: reputation.rsvps },
            { label: "Poll votes", value: reputation.votes },
            { label: "Challenges", value: reputation.challenges },
          ].map((s) => (
            <div key={s.label}>
              <dd className="font-mono text-lg font-semibold tabular-nums">
                {s.value}
              </dd>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <Separator className="my-10" />

      <h2 className="text-lg font-semibold">Your communities</h2>
      {joinedCommunities.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">You haven&apos;t joined any yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your teams are waiting for you.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/communities">Browse communities</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {joinedCommunities.map((c) => (
            <CommunityCard key={c.slug} community={c} />
          ))}
        </div>
      )}

      <Separator className="my-10" />

      <h2 className="text-lg font-semibold">Your listings</h2>
      {userListings.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">Nothing for sale yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            That spare jersey isn&apos;t going to sell itself.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/sell">Sell an item</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {userListings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      <Separator className="my-10" />

      <h2 className="text-lg font-semibold">Purchase history</h2>
      {orders.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">No purchases yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When you buy something, the on-chain receipt shows up here.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/marketplace">Browse the marketplace</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {o.listingTitle}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {timeAgo(o.createdAt)} · paid to{" "}
                  <span className="font-mono">
                    {shortenAddress(o.sellerAddress)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-semibold tabular-nums">
                  {formatUsdt(o.priceUsdt)}
                </span>
                <a
                  href={explorerTxUrl(o.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md text-xs text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Receipt
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
