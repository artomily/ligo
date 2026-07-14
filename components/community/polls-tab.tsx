"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { formatCompactNumber, timeAgo } from "@/lib/format";
import { seedPollsFor } from "@/lib/data/community-content";
import type { Poll } from "@/lib/types";

function PollCard({ poll }: { poll: Poll }) {
  const mounted = useMounted();
  const pollVotes = useLigoStore((s) => s.pollVotes);
  const votePoll = useLigoStore((s) => s.votePoll);

  const votedOption = mounted ? pollVotes[poll.id] : undefined;
  const hasVoted = Boolean(votedOption);

  const total = poll.options.reduce(
    (n, o) => n + o.seedVotes + (votedOption === o.id ? 1 : 0),
    0
  );

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold">{poll.question}</h3>
        <span className="shrink-0 text-xs text-muted-foreground">
          {timeAgo(poll.createdAt)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {poll.options.map((option) => {
          const votes = option.seedVotes + (votedOption === option.id ? 1 : 0);
          const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
          const isChoice = votedOption === option.id;

          if (!hasVoted) {
            return (
              <button
                key={option.id}
                onClick={() => votePoll(poll.id, option.id)}
                className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-left text-sm font-medium transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {option.label}
              </button>
            );
          }

          return (
            <div
              key={option.id}
              className="relative overflow-hidden rounded-lg border border-border px-4 py-2.5"
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-0 transition-all",
                  isChoice ? "bg-primary/15" : "bg-muted"
                )}
                style={{ width: `${pct}%` }}
                aria-hidden
              />
              <div className="relative flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  {isChoice && (
                    <Check className="size-3.5 text-primary" aria-hidden />
                  )}
                  {option.label}
                </span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-mono tabular-nums">
          {formatCompactNumber(total)}
        </span>{" "}
        votes{hasVoted ? " · you voted" : ""}
      </p>
    </div>
  );
}

export function PollsTab({ communitySlug }: { communitySlug: string }) {
  const polls = seedPollsFor(communitySlug);
  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
