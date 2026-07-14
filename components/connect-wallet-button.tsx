"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

// Wraps RainbowKit's connect flow in shadcn buttons so it reads as a
// friendly "Sign in", not a crypto widget.
export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        if (!mounted) {
          return (
            <Button size="sm" variant="outline" disabled aria-hidden>
              Sign in
            </Button>
          );
        }

        if (!connected) {
          return (
            <Button size="sm" onClick={openConnectModal}>
              Sign in
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button size="sm" variant="destructive" onClick={openChainModal}>
              Switch network
            </Button>
          );
        }

        return (
          <Button size="sm" variant="outline" onClick={openAccountModal}>
            <span className="size-2 rounded-full bg-emerald-500" />
            {account.displayName}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
}
