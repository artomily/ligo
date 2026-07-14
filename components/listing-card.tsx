import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";
import { formatUsdt } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/marketplace/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight group-hover:text-primary">
            {listing.title}
          </h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {listing.shipsFrom}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold tabular-nums">
            {formatUsdt(listing.priceUsdt)}
          </span>
          <Badge variant="outline" className="capitalize">
            {listing.category}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
