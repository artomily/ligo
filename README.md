# Ligo — Connect. Trade. Celebrate.

A global fan economy platform. Communities connect, trade merchandise, and support each other with borderless USDT payments. Football first; crypto stays in the background.

**Hackathon MVP** — Next.js 16 + Tailwind + shadcn/ui frontend, wagmi/RainbowKit wallet flow, and a MockUSDT ERC-20 with a public faucet on **Base Sepolia** so anyone can demo real on-chain checkout with test funds.

## Features

- **Landing** — hero, how it works, communities, marketplace, benefits, roadmap, FAQ
- **Communities** — browse, search, join/leave (Indonesia, Brazil, Argentina, Man Utd, Barça, Japan)
- **Marketplace** — jerseys, scarves, signed items, tickets, stickers; search + category filters; sell form
- **Checkout** — connect wallet (RainbowKit), enforce Base Sepolia, in-app test-USDT faucet, real ERC-20 `transfer` to the seller, BaseScan receipt
- **Profile** — joined communities, own listings, purchase history with tx links, reputation
- **Settings** — display name, light/dark mode

## Quick start

```bash
npm install
npm run dev
```

The app works out of the box with seed data. Payments need two env vars in `.env.local`:

```bash
# From https://cloud.reown.com (free) — enables WalletConnect QR pairing.
# Injected wallets (MetaMask, Rabby) work without it.
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...

# Deployed MockUSDT address on Base Sepolia (see below)
NEXT_PUBLIC_USDT_ADDRESS=0x...
```

## Deploying MockUSDT (Base Sepolia)

The contract lives in [contracts/src/MockUSDT.sol](contracts/src/MockUSDT.sol) — a minimal 6-decimal ERC-20 with a public `faucet()` that mints 100 USDT per call. Tests: `cd contracts && forge test`.

You need a throwaway wallet funded with a little Base Sepolia ETH (e.g. from [Alchemy's faucet](https://www.alchemy.com/faucets/base-sepolia) or the [Coinbase faucet](https://portal.cdp.coinbase.com/products/faucet)). Then:

```bash
cd contracts
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia.base.org \
  --private-key <THROWAWAY_DEPLOYER_KEY> \
  --broadcast
```

Copy the printed `MockUSDT deployed at:` address into `NEXT_PUBLIC_USDT_ADDRESS` and restart the dev server.

> Fallback without deploying: Circle's testnet USDC on Base Sepolia
> (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`, fund at faucet.circle.com) works with
> the same env var — but the in-app faucet button won't (no `faucet()` on real USDC).

## Architecture notes

- **Data**: typed seed data in `lib/data/seed.ts`, read through repository functions in `lib/data/repository.ts`. Client mutations (joins, listings, orders) live in a persisted zustand store (`lib/store.ts`) merged via hooks in `lib/data/hooks.ts`. Swapping in Supabase later only touches this layer.
- **Wallet**: `lib/wagmi.ts` (Base Sepolia only) + `app/providers.tsx` (Wagmi → React Query → RainbowKit, themed by next-themes).
- **Brand**: `brand.md` is the source of truth (Club Sapphire palette, Manrope + JetBrains Mono). Tokens in `app/globals.css`.
- **Roadmap** (post-hackathon): Supabase auth/DB, escrow & disputes, community treasury, charity campaigns, rewards, creator tipping, fan passport.
