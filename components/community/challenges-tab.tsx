"use client";

import {
  Camera,
  CheckCircle2,
  Circle,
  HelpCircle,
  Target,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { seedChallengesFor } from "@/lib/data/community-content";
import type { ChallengeKind } from "@/lib/types";

const kindIcons: Record<ChallengeKind, typeof Target> = {
  "daily-quest": Target,
  trivia: HelpCircle,
  invite: UserPlus,
  participation: Users,
  photo: Camera,
};

export function ChallengesTab({ communitySlug }: { communitySlug: string }) {
  const mounted = useMounted();
  const completed = useLigoStore((s) => s.completedChallenges);
  const toggleChallenge = useLigoStore((s) => s.toggleChallenge);
  const challenges = seedChallengesFor(communitySlug);

  const doneCount = mounted
    ? challenges.filter((c) => completed.includes(c.id)).length
    : 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm font-medium">This week&apos;s challenges</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono tabular-nums">{doneCount}</span> /{" "}
          {challenges.length} done
        </p>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => {
          const Icon = kindIcons[challenge.kind];
          const isDone = mounted && completed.includes(challenge.id);
          return (
            <div
              key={challenge.id}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4 transition-colors",
                isDone
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  isDone
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{challenge.title}</p>
                <p className="text-xs text-muted-foreground">
                  {challenge.description}
                </p>
              </div>
              <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
                +{challenge.points}
              </span>
              <Button
                variant={isDone ? "outline" : "default"}
                size="sm"
                className="shrink-0"
                onClick={() => {
                  toggleChallenge(challenge.id);
                  if (!isDone)
                    toast.success(`Challenge complete · +${challenge.points}`);
                }}
              >
                {isDone ? (
                  <>
                    <CheckCircle2 className="size-4" aria-hidden />
                    Done
                  </>
                ) : (
                  <>
                    <Circle className="size-4" aria-hidden />
                    Do it
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
