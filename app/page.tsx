import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  HandCoins,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community-card";
import { ListingCard } from "@/components/listing-card";
import { getCommunities, getSeedListings } from "@/lib/data/repository";

const steps = [
  {
    icon: UsersRound,
    title: "Join your community",
    body: "Find your national team or club and join fans from every timezone.",
  },
  {
    icon: Store,
    title: "Trade with fans anywhere",
    body: "Buy and sell jerseys, scarves, tickets, and collectibles across borders.",
  },
  {
    icon: HandCoins,
    title: "Pay in seconds with USDT",
    body: "One currency for every country. No card fees, no bank delays.",
  },
];

const benefits = [
  {
    icon: Globe2,
    title: "Borderless by default",
    body: "A fan in Jakarta buys from a fan in Manchester as easily as from a neighbor.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent payments",
    body: "Every purchase settles on-chain with a receipt you can verify yourself.",
  },
  {
    icon: Sparkles,
    title: "Community first",
    body: "Crypto stays in the background. What you see is your community.",
  },
];

const roadmap = [
  { phase: "Now", title: "Communities & marketplace", body: "Join, browse, trade — powered by USDT." },
  { phase: "Phase 2", title: "Community treasury", body: "Pool funds for watch parties and events." },
  { phase: "Phase 3", title: "Charity campaigns", body: "Transparent fundraising for causes fans care about." },
  { phase: "Phase 4", title: "Rewards", body: "Match predictions, quests, and trivia with USDT prizes." },
  { phase: "Phase 5", title: "Creator support", body: "Instant tipping for streamers, analysts, and organizers." },
  { phase: "Phase 6", title: "Fan passport", body: "Your communities, badges, and reputation in one identity." },
];

const faqs = [
  {
    q: "Do I need to understand crypto to use Ligo?",
    a: "No. You sign in, join communities, and buy or sell like on any marketplace. USDT is just the currency that makes cross-border payments instant.",
  },
  {
    q: "What is USDT?",
    a: "A digital dollar — a stablecoin whose value tracks the US dollar. It moves between countries in seconds for fractions of a cent.",
  },
  {
    q: "How do payments work?",
    a: "At checkout you confirm the payment from your wallet and USDT moves directly to the seller. You get an on-chain receipt you can verify anytime.",
  },
  {
    q: "Is this real money?",
    a: "This MVP runs on the Base Sepolia testnet, so payments are real transactions with test funds. You can mint free test USDT inside the app to try it.",
  },
  {
    q: "Which communities can I join?",
    a: "Football first: national teams and clubs. Esports, music, anime, and creator communities are on the roadmap.",
  },
];

export default function LandingPage() {
  const communities = getCommunities().slice(0, 6);
  const listings = getSeedListings().slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              The fan economy platform — football first
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Connect. Trade. Celebrate.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Ligo brings fan communities together through borderless commerce,
              donations, and rewards powered by USDT.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/communities">
                  Join a community
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/marketplace">Explore marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-4" aria-hidden />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Communities preview */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Communities
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                From national teams to club legends — your people are already
                here.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/communities">
                View all
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <CommunityCard key={c.slug} community={c} />
            ))}
          </div>
          <div className="mt-6 sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/communities">View all communities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Fresh on the marketplace
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Jerseys, scarves, signed pieces, and matchday tickets — sold fan
              to fan.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/marketplace">
              Browse all
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Why fans choose Ligo
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Where Ligo is heading
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((item) => (
            <div
              key={item.phase}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                {item.phase}
              </p>
              <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Questions, answered
          </h2>
          <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
            {faqs.map((faq) => (
              <details key={faq.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {faq.q}
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-open:rotate-90"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
