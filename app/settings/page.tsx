"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";

export default function SettingsPage() {
  const mounted = useMounted();
  const displayName = useLigoStore((s) => s.displayName);
  const setDisplayName = useLigoStore((s) => s.setDisplayName);
  const { resolvedTheme, setTheme } = useTheme();
  const [name, setName] = useState("");

  useEffect(() => {
    if (mounted) setName(displayName);
  }, [mounted, displayName]);

  const dark = mounted && resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(dark ? "light" : "dark");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        How you show up across communities and the marketplace.
      </p>

      <form
        className="mt-8 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          setDisplayName(name.trim());
          toast.success("Display name saved");
        }}
      >
        <Label htmlFor="displayName">Display name</Label>
        <div className="flex gap-2">
          <Input
            id="displayName"
            name="displayName"
            autoComplete="nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. andi.jkt"
            maxLength={32}
          />
          <Button type="submit">Save</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Shown instead of your wallet address on listings and communities.
        </p>
      </form>

      <Separator className="my-8" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Appearance</p>
          <p className="text-xs text-muted-foreground">
            Switch between light and dark mode.
          </p>
        </div>
        <Button variant="outline" onClick={toggleTheme} aria-pressed={dark}>
          {dark ? "Switch to light" : "Switch to dark"}
        </Button>
      </div>

      <Separator className="my-8" />

      <div>
        <p className="text-sm font-medium">About this demo</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Ligo MVP runs on the Base Sepolia testnet. Payments use test USDT
          minted from the in-app faucet — no real funds move. Community joins,
          listings, and order history are stored locally in your browser.
        </p>
      </div>
    </div>
  );
}
