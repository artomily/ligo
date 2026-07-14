"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCommunities } from "@/lib/data/repository";
import { useLigoStore } from "@/lib/store";
import type { ListingCategory } from "@/lib/types";

const categoryImages: Record<ListingCategory, string> = {
  jersey: "/products/jersey-blue.svg",
  scarf: "/products/scarf-blue.svg",
  signed: "/products/signed-blue.svg",
  ticket: "/products/ticket-blue.svg",
  sticker: "/products/sticker-yellow.svg",
  other: "/products/sticker-red.svg",
};

const categories: { value: ListingCategory; label: string }[] = [
  { value: "jersey", label: "Jersey" },
  { value: "scarf", label: "Scarf" },
  { value: "signed", label: "Signed item" },
  { value: "ticket", label: "Ticket" },
  { value: "sticker", label: "Stickers" },
  { value: "other", label: "Other" },
];

export default function SellPage() {
  const router = useRouter();
  const { address } = useAccount();
  const addListing = useLigoStore((s) => s.addListing);
  const displayName = useLigoStore((s) => s.displayName);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ListingCategory | "">("");
  const [price, setPrice] = useState("");
  const [communitySlug, setCommunitySlug] = useState("");
  const [shipsFrom, setShipsFrom] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const communities = getCommunities();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Give your item a title.";
    if (!category) next.category = "Pick a category.";
    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0)
      next.price = "Enter a price above 0.";
    if (!communitySlug) next.community = "Pick the community to list in.";
    if (!shipsFrom.trim()) next.shipsFrom = "Where does it ship from?";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const id = `u-${Date.now()}`;
    addListing({
      id,
      title: title.trim(),
      description: description.trim() || "No description provided.",
      category: category as ListingCategory,
      priceUsdt: Math.round(priceNum * 100) / 100,
      imageUrl: categoryImages[category as ListingCategory],
      communitySlug,
      sellerAddress:
        address ?? "0x000000000000000000000000000000000000dEaD",
      sellerName: displayName || "you",
      shipsFrom: shipsFrom.trim(),
      condition: "used",
      createdAt: new Date().toISOString(),
    });
    toast.success("Your item is live on the marketplace");
    router.push(`/marketplace/${id}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Marketplace
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Sell an item
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        List it in your community — buyers pay you directly in USDT.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Home Jersey '24, size M"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-xs text-destructive">
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition, sizing, story — what should a fellow fan know?"
            rows={4}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ListingCategory)}
            >
              <SelectTrigger
                id="category"
                aria-invalid={Boolean(errors.category)}
                className="w-full"
              >
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USDT)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="45.00"
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? "price-error" : undefined}
            />
            {errors.price && (
              <p id="price-error" className="text-xs text-destructive">
                {errors.price}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="community">Community</Label>
            <Select value={communitySlug} onValueChange={setCommunitySlug}>
              <SelectTrigger
                id="community"
                aria-invalid={Boolean(errors.community)}
                className="w-full"
              >
                <SelectValue placeholder="Where to list it" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.bannerEmoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.community && (
              <p className="text-xs text-destructive">{errors.community}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipsFrom">Ships from</Label>
            <Input
              id="shipsFrom"
              name="shipsFrom"
              autoComplete="address-level2"
              value={shipsFrom}
              onChange={(e) => setShipsFrom(e.target.value)}
              placeholder="Jakarta, Indonesia"
              aria-invalid={Boolean(errors.shipsFrom)}
              aria-describedby={
                errors.shipsFrom ? "shipsFrom-error" : undefined
              }
            />
            {errors.shipsFrom && (
              <p id="shipsFrom-error" className="text-xs text-destructive">
                {errors.shipsFrom}
              </p>
            )}
          </div>
        </div>

        {!address && (
          <p className="rounded-lg bg-muted px-4 py-3 text-xs leading-5 text-muted-foreground">
            You&apos;re not signed in — the listing will use a placeholder
            payout address. Sign in with your wallet so buyers pay you
            directly.
          </p>
        )}

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          List item
        </Button>
      </form>
    </div>
  );
}
