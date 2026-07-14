"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  ExternalLink,
  Loader2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { parseUnits, formatUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useListing } from "@/lib/data/hooks";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { formatUsdt, shortenAddress } from "@/lib/format";
import { usdtAbi, USDT_ADDRESS, USDT_CONFIGURED, USDT_DECIMALS } from "@/lib/usdt";

const explorerTxUrl = (hash: string) =>
  `https://sepolia.basescan.org/tx/${hash}`;

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  const listing = useListing(id);
  const addOrder = useLigoStore((s) => s.addOrder);

  const { address, chainId, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();

  const onWrongChain = isConnected && chainId !== baseSepolia.id;

  const {
    data: balance,
    refetch: refetchBalance,
    isLoading: balanceLoading,
  } = useReadContract({
    address: USDT_ADDRESS,
    abi: usdtAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && USDT_CONFIGURED && !onWrongChain },
  });

  // Faucet
  const faucet = useWriteContract();
  const faucetReceipt = useWaitForTransactionReceipt({ hash: faucet.data });
  useEffect(() => {
    if (faucetReceipt.isSuccess) {
      toast.success("100 test USDT added to your wallet");
      refetchBalance();
      faucet.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faucetReceipt.isSuccess]);

  // Purchase
  const pay = useWriteContract();
  const payReceipt = useWaitForTransactionReceipt({ hash: pay.data });
  const [completedTx, setCompletedTx] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    if (payReceipt.isSuccess && pay.data && listing && address && !completedTx) {
      setCompletedTx(pay.data);
      addOrder({
        id: `o-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        priceUsdt: listing.priceUsdt,
        sellerAddress: listing.sellerAddress,
        buyerAddress: address,
        txHash: pay.data,
        createdAt: new Date().toISOString(),
      });
      refetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payReceipt.isSuccess, pay.data]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Listing not found
        </h1>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/marketplace">
            <ArrowLeft className="size-4" aria-hidden />
            Back to marketplace
          </Link>
        </Button>
      </div>
    );
  }

  const price = parseUnits(listing.priceUsdt.toString(), USDT_DECIMALS);
  const hasFunds = typeof balance === "bigint" && balance >= price;

  // Success screen
  if (completedTx) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <CheckCircle2
          className="mx-auto size-14 text-emerald-500"
          aria-hidden
        />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Payment complete
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You paid <span className="font-mono">{formatUsdt(listing.priceUsdt)}</span>{" "}
          to {listing.sellerName} for “{listing.title}”. The seller has been
          notified and will arrange shipping.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <a
              href={explorerTxUrl(completedTx)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View receipt on BaseScan
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
          <Button asChild>
            <Link href="/profile">Go to your profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href={`/marketplace/${listing.id}`}
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to item
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Checkout</h1>

      {/* Order summary */}
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{listing.title}</p>
          <p className="text-xs text-muted-foreground">
            Sold by {listing.sellerName} ·{" "}
            <span className="font-mono">
              {shortenAddress(listing.sellerAddress)}
            </span>
          </p>
        </div>
        <p className="font-mono text-base font-semibold tabular-nums">
          {formatUsdt(listing.priceUsdt)}
        </p>
      </div>

      <Separator className="my-6" />

      {!USDT_CONFIGURED ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">Payments not configured yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            The USDT contract address is missing. Set{" "}
            <code className="font-mono text-xs">NEXT_PUBLIC_USDT_ADDRESS</code>{" "}
            in <code className="font-mono text-xs">.env.local</code> after
            deploying <code className="font-mono text-xs">MockUSDT</code>.
          </p>
        </div>
      ) : !isConnected ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Wallet className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-sm font-medium">Sign in to pay</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your wallet to complete this purchase with USDT.
          </p>
          <Button className="mt-4" onClick={openConnectModal}>
            Sign in
          </Button>
        </div>
      ) : onWrongChain ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm font-medium">Wrong network</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ligo runs on Base Sepolia. Switch networks to continue.
          </p>
          <Button className="mt-4" onClick={openChainModal}>
            Switch to Base Sepolia
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Balance + faucet */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <p className="text-xs text-muted-foreground">Your balance</p>
              {balanceLoading ? (
                <Skeleton className="mt-1 h-6 w-28" />
              ) : (
                <p className="font-mono text-lg font-semibold tabular-nums">
                  {typeof balance === "bigint"
                    ? `${formatUnits(balance, USDT_DECIMALS)} USDT`
                    : "— USDT"}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={faucet.isPending || faucetReceipt.isLoading}
              onClick={() =>
                faucet.writeContract(
                  {
                    address: USDT_ADDRESS,
                    abi: usdtAbi,
                    functionName: "faucet",
                  },
                  {
                    onError: (e) =>
                      toast.error("Faucet failed", {
                        description: e.message.split("\n")[0],
                      }),
                  }
                )
              }
            >
              {faucet.isPending || faucetReceipt.isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Minting…
                </>
              ) : (
                <>
                  <Coins className="size-4" aria-hidden />
                  Get test USDT
                </>
              )}
            </Button>
          </div>

          {!hasFunds && !balanceLoading && (
            <p className="text-sm text-muted-foreground">
              You need {formatUsdt(listing.priceUsdt)} to complete this
              purchase — tap “Get test USDT” to mint free test funds.
            </p>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!hasFunds || pay.isPending || payReceipt.isLoading}
            onClick={() =>
              pay.writeContract(
                {
                  address: USDT_ADDRESS,
                  abi: usdtAbi,
                  functionName: "transfer",
                  args: [listing.sellerAddress, price],
                },
                {
                  onError: (e) =>
                    toast.error("Payment failed", {
                      description: e.message.split("\n")[0],
                    }),
                }
              )
            }
          >
            {pay.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Confirm in your wallet…
              </>
            ) : payReceipt.isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Processing payment…
              </>
            ) : (
              `Pay ${formatUsdt(listing.priceUsdt)}`
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            USDT goes directly to the seller on Base Sepolia. You&apos;ll get an
            on-chain receipt.
          </p>
        </div>
      )}
    </div>
  );
}
