"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getMembers } from "@/lib/data/repository";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { shortenAddress } from "@/lib/format";

export function MembersTab({ communitySlug }: { communitySlug: string }) {
  const mounted = useMounted();
  const joined = useLigoStore((s) => s.joinedCommunities.includes(communitySlug));
  const members = getMembers(communitySlug);
  const isJoined = mounted && joined;

  const admins = members.filter((m) => m.role === "organizer");
  const regular = members.filter((m) => m.role !== "organizer");

  return (
    <div className="space-y-6">
      {admins.length > 0 && (
        <section>
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Admins & moderators
          </h3>
          <ul className="mt-3 space-y-3">
            {admins.map((m) => (
              <li key={m.address} className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {m.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {m.name}
                    <Badge variant="secondary" className="ml-2">
                      Organizer
                    </Badge>
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {shortenAddress(m.address)} · joined{" "}
                    {new Date(m.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Members
        </h3>
        <ul className="mt-3 space-y-3">
          {isJoined && (
            <li className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  YOU
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">You</p>
                <p className="text-xs text-muted-foreground">Joined just now</p>
              </div>
            </li>
          )}
          {regular.map((m) => (
            <li key={m.address} className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-muted text-xs font-semibold">
                  {m.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {shortenAddress(m.address)} · joined{" "}
                  {new Date(m.joinedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
