"use client";

import { CalendarDays, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLigoStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { formatCompactNumber } from "@/lib/format";
import {
  formatEventDate,
  seedEventsFor,
} from "@/lib/data/community-content";
import type { EventKind } from "@/lib/types";

const kindLabels: Record<EventKind, string> = {
  "watch-party": "Watch party",
  meetup: "Meetup",
  online: "Online",
  gathering: "Gathering",
};

export function EventsTab({ communitySlug }: { communitySlug: string }) {
  const mounted = useMounted();
  const rsvps = useLigoStore((s) => s.eventRsvps);
  const toggleRsvp = useLigoStore((s) => s.toggleRsvp);
  const events = seedEventsFor(communitySlug);

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const going = mounted && rsvps.includes(event.id);
        const attendees = event.seedAttendees + (going ? 1 : 0);
        return (
          <div
            key={event.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge variant="secondary">{kindLabels[event.kind]}</Badge>
                <h3 className="mt-2 text-base font-semibold">{event.title}</h3>
              </div>
              <Button
                variant={going ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  toggleRsvp(event.id);
                  toast[going ? "message" : "success"](
                    going ? "RSVP cancelled" : `You're going to ${event.title}`
                  );
                }}
              >
                {going ? "Going ✓" : "RSVP"}
              </Button>
            </div>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {event.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" aria-hidden />
                {formatEventDate(event.startsAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" aria-hidden />
                <span className="font-mono tabular-nums">
                  {formatCompactNumber(attendees)}
                </span>
                going · hosted by {event.host}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
