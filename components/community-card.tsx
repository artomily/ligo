import Link from "next/link";
import { Users } from "lucide-react";
import type { Community } from "@/lib/types";
import { formatCompactNumber } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function CommunityCard({ community }: { community: Community }) {
  return (
    <Link
      href={`/communities/${community.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="flex size-11 items-center justify-center rounded-lg text-2xl"
          style={{ backgroundColor: `color-mix(in oklch, ${community.accentColor} 14%, transparent)` }}
        >
          {community.bannerEmoji}
        </span>
        <Badge variant="secondary" className="capitalize">
          {community.category}
        </Badge>
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight group-hover:text-primary">
        {community.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {community.tagline}
      </p>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="size-3.5" aria-hidden />
        <span className="font-mono tabular-nums">
          {formatCompactNumber(community.memberCount)}
        </span>
        members
      </p>
    </Link>
  );
}
