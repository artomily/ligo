"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { useListings } from "@/lib/data/hooks";
import type { ListingCategory } from "@/lib/types";

const filters: { value: ListingCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "jersey", label: "Jerseys" },
  { value: "scarf", label: "Scarves" },
  { value: "signed", label: "Signed" },
  { value: "ticket", label: "Tickets" },
  { value: "sticker", label: "Stickers" },
];

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ListingCategory | "all">("all");
  const allListings = useListings();

  const listings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allListings.filter(
      (l) =>
        (category === "all" || l.category === category) &&
        (q === "" ||
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q))
    );
  }, [allListings, query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Marketplace
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fan-to-fan trading, settled in USDT.
          </p>
        </div>
        <Button asChild>
          <Link href="/sell">
            <Plus className="size-4" aria-hidden />
            Sell an item
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search the marketplace"
            aria-label="Search the marketplace"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
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

      {listings.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">No items found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search — or list the item yourself.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Clear filters
            </Button>
            <Button asChild size="sm">
              <Link href="/sell">Sell an item</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
