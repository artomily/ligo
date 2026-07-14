# Ligo — DoraHacks Submission Draft

Copy-paste source for the DoraHacks BUIDL form. Fill in the `[ ]` placeholders before submitting.

---

## Project Name

Ligo

## Tagline (one-liner)

**Connect. Trade. Celebrate.** Ligo is a community-first platform where football fans gather, participate, and trade — with borderless USDT settlement underneath, not in front.

*Shorter alt:* The community is the product. USDT just removes the borders.

## Track

`[ Fill in — e.g. Consumer / SocialFi, Payments, or the specific chain/sponsor track for this hackathon ]`

## Logo

`public/*.svg` — see `public/` for the current icon set. *(Export a square mark + wordmark lockup before submitting if DoraHacks requires a raster upload.)*

## Project Description

Global fan communities interact every day, but they can't easily buy merchandise from a fan in another country, support a community organizer, or split the cost of a watch party — without expensive, slow cross-border payments getting in the way. Every existing option forces a tradeoff: Discord and Reddit have no commerce layer; marketplace apps have no community; crypto-native apps lead with the wallet and lose the fans who don't care about chains.

Ligo starts from a different premise: **the community is the product, not the marketplace.** You join a community — Indonesia Fans, Brazil Fans, Argentina Fans, Manchester United, FC Barcelona, Japan Fans — and land in a live hub with a Feed (posts, likes, comments), Events (watch parties with RSVP), Polls (Man of the Match, match predictions), and Challenges (daily quests, trivia, invites) that build a reputation score over time. Buying and selling — jerseys, scarves, signed items, tickets, stickers — is one tab inside that community, not the front door.

USDT enters only when it's needed: at checkout. A fan connects a wallet, mints test USDT from an in-app faucet (so anyone can try the flow with zero setup), and pays the seller directly with a real ERC-20 `transfer` on Base Sepolia — settling in seconds with an on-chain receipt, instead of days through a bank or a cut-taking payment processor. Crypto is infrastructure the fan barely notices, not the headline.

The build follows a strict product hierarchy — **Community First → Commerce Second → Payments Third → Blockchain Last** — enforced by a single question for every feature: *does this strengthen the community?* Architecturally, all seed and user-generated content (communities, listings, feed posts, events, polls, challenges, orders) flows through one repository seam (`lib/data/repository.ts`) backed by a persisted zustand store, so today's local-first MVP can swap in Supabase later without touching a single page. The MockUSDT contract (Foundry, 9 passing tests) ships with a public `faucet()` specifically so judges and users can demo real on-chain payment without hunting for testnet funds first.

Today the full loop runs end-to-end: browse and join a community, post/vote/RSVP/complete a challenge and watch reputation update live, list an item for sale, and pay for it with a real Base Sepolia USDT transfer that resolves to a BaseScan receipt in the buyer's purchase history. Post-MVP, the same community-first shape extends naturally to a per-community treasury, transparent charity campaigns, USDT-powered rewards for challenges, and instant creator tipping — every one of them a feature *inside* a community, never a separate app bolted on top.

*(~370 words — trim if the form has a hard word cap.)*

## Vision

Every passionate fan community deserves a place to gather, a place to trade, a place to support each other, and a place to celebrate — powered by borderless payments that stay invisible until the moment they're needed. Ligo's long-term bet: it becomes the operating system for global fan communities, starting with football and expanding to esports, music, anime, and any fandom worth showing up for.

## Problem → Solution (short form)

**Problem:** Fan communities are fragmented across Discord/Reddit/WhatsApp (no commerce) and marketplace apps (no community) — and cross-border payments between fans are slow and expensive.
**Solution:** One community-first hub (feed, events, polls, challenges, reputation) with a marketplace and USDT checkout built in, so commerce is a feature of the community instead of a separate app.

## Why USDT / Base

- **USDT as infrastructure, not the pitch.** Fans never see "connect your wallet" until the one moment it's actually needed — checkout.
- **Base Sepolia** — fast, cheap, EVM-familiar, with mature tooling (Foundry, wagmi, RainbowKit) that let the whole payment loop ship inside the hackathon window.
- **Public faucet on `MockUSDT`** — anyone (a judge, a new fan) can fund themselves in-app and try a real `transfer()` without leaving the product or hunting for a testnet faucet elsewhere.
- Borderless settlement is the actual unlock the doc promises: a fan in Jakarta pays a fan in Manchester as easily as a neighbor.

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui
- **Web3:** wagmi 2 · viem 2 · RainbowKit 2 · @tanstack/react-query
- **Contracts:** Foundry · Solidity ^0.8.20 (`MockUSDT` — 6-decimal ERC-20 + public `faucet()`, 9 unit tests)
- **State:** zustand (persisted) behind a single repository seam, ready to swap for Supabase
- **Chain:** Base Sepolia (testnet)

## Current Status (be honest — judges verify)

**Working now:**
- Full community hub — Feed (post/like/comment), Events (RSVP), Polls (vote + live results), Challenges (complete + points), Members, all with seeded content so nothing is empty on first load
- Reputation system derived from real participation (posts, comments, RSVPs, votes, challenges, joins, purchases), visible on Profile with a tier (Newcomer → Legend)
- Marketplace — global browse + per-community nested tab, search/filter, sell form with validation
- Checkout — wallet connect (RainbowKit), Base Sepolia chain enforcement, live USDT balance read, in-app faucet mint, real ERC-20 `transfer` to the seller, BaseScan receipt linked from Profile
- `MockUSDT.sol` — deployed via Foundry script, 9/9 tests passing (`forge test`)
- `npm run build` — clean production build, all routes compile

**Not live yet (labeled honestly, not hidden):**
- `MockUSDT` not yet deployed to a persistent public Base Sepolia address for this submission — see [Contract Address](#contract-address) below
- No real backend — communities/listings/engagement are seed data + local persistence (zustand), by design, behind a repository seam ready for Supabase
- Treasury, charity, rewards, and creator-tipping phases are designed for (see Roadmap in [README.md](../README.md)) but not built

## Contract Address

`[ Fill in after running: cd contracts && forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --private-key <KEY> --broadcast ]`

- **Network:** Base Sepolia (`base-sepolia`, chain id `84532`)
- **Contract:** `contracts/src/MockUSDT.sol`
- **Explorer:** `https://sepolia.basescan.org/address/[ADDRESS]`

## Links

- **GitHub:** https://github.com/artomily/ligo
- **Live demo:** `[ add Vercel/deployment URL ]`
- **Demo video:** `[ add link ]`
- **README (architecture, mermaid diagrams):** [`README.md`](../README.md)
- **Product philosophy:** [`AGENTS.md`](../AGENTS.md)
- **Brand system:** [`brand.md`](../brand.md)

## Team

`[ Fill in — name, role, links ]`

## Demo Video Script (target: under 3 minutes)

**0:00–0:15 — Hook:** "Fan communities live on Discord. Fan commerce lives on separate marketplace apps. Nothing connects them — and paying a fan in another country is slow and expensive." Show the landing hero.

**0:15–0:35 — Solution overview:** "Ligo makes the community the product — commerce and payments are just features inside it." Show a community hub: Feed, Events, Polls, Challenges tabs.

**0:35–2:20 — Live demo:**
1. Join a community (Indonesia Fans), show the live overview stats (members, online, upcoming events).
2. Post to the Feed, like/comment on a seeded post.
3. Vote in a poll — show the live result bars update.
4. RSVP to a watch party event.
5. Complete a challenge — show reputation points update.
6. Jump to the Marketplace tab, open a listing, go to Checkout.
7. Connect wallet, mint test USDT from the faucet, pay — show the BaseScan receipt and the order landing in Profile with the new reputation tier.

**2:20–2:50 — Technical highlight:** One repository seam (`lib/data/repository.ts`) separates every page from the data source — show it for 10 seconds, explain Supabase is a drop-in swap later. Show `MockUSDT.sol`'s public `faucet()` — anyone can try real on-chain payment with zero setup.

**2:50–3:00 — Wrap:** "Community first, commerce second, payments third, blockchain last — and the roadmap (treasury, charity, rewards, creator tipping) is designed to stay that way." Call to action: try the demo, check the repo.
