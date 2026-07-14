"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { getCommunities } from "@/lib/data/repository";
import type { CommunityCategory } from "@/lib/types";

const filters: { value: CommunityCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "national", label: "National teams" },
  { value: "club", label: "Clubs" },
];

export default function CommunitiesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CommunityCategory | "all">("all");

  const communities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getCommunities().filter(
      (c) =>
        (category === "all" || c.category === category) &&
        (q === "" ||
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Communities</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Join your people. Every community has its own marketplace and members.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search communities"
            aria-label="Search communities"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2" role="group" aria-label="Filter by type">
          {filters.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={category === f.value ? "default" : "outline"}
              aria-pressed={category === f.value}
              onClick={() => setCategory(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {communities.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">No communities match “{query}”</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different name, or clear the search.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <CommunityCard key={c.slug} community={c} />
          ))}
        </div>
      )}
    </div>
  );
}
