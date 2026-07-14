"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useListing } from "@/lib/data/hooks";
import { getCommunity } from "@/lib/data/repository";
import { useMounted } from "@/lib/use-mounted";
import { formatUsdt, shortenAddress, timeAgo } from "@/lib/format";

const conditionLabels: Record<string, string> = {
  new: "New",
  "like-new": "Like new",
  used: "Used",
};

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  const listing = useListing(id);

  // User-created listings live in localStorage; wait for hydration before 404.
  if (!listing) {
    if (!mounted) return null;
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Listing not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It may have been sold or removed.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/marketplace">
            <ArrowLeft className="size-4" aria-hidden />
            Back to marketplace
          </Link>
        </Button>
      </div>
    );
  }

  const community = getCommunity(listing.communitySlug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Marketplace
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {listing.category}
            </Badge>
            <Badge variant="secondary">
              {conditionLabels[listing.condition]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Listed {timeAgo(listing.createdAt)}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {listing.title}
          </h1>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
            {formatUsdt(listing.priceUsdt)}
          </p>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {listing.description}
          </p>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="size-4" aria-hidden />
              Ships from {listing.shipsFrom}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4" aria-hidden />
              Paid directly to the seller — receipt on-chain
            </p>
            {community && (
              <p className="flex items-center gap-2">
                <MapPin className="size-4" aria-hidden />
                Listed in{" "}
                <Link
                  href={`/communities/${community.slug}`}
                  className="rounded-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {community.name}
                </Link>
              </p>
            )}
          </div>

          <Separator className="my-6" />

          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {listing.sellerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{listing.sellerName}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {shortenAddress(listing.sellerAddress)}
              </p>
            </div>
          </div>

          <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
            <Link href={`/checkout/${listing.id}`}>
              Buy for {formatUsdt(listing.priceUsdt)}
            </Link>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Testnet demo — payment uses test USDT on Base Sepolia.
          </p>
        </div>
      </div>
    </div>
  );
}
