"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { useListings } from "@/lib/data/hooks";

export function MarketplaceTab({ communitySlug }: { communitySlug: string }) {
  const listings = useListings(communitySlug);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Buy and sell within this community — settled in USDT.
          <Badge variant="outline" className="ml-2">
            Preview
          </Badge>
        </p>
        <Button asChild size="sm">
          <Link href="/sell">
            <Plus className="size-4" aria-hidden />
            Sell
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">Nothing listed yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to list a jersey, scarf, or ticket here.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/sell">List an item</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
