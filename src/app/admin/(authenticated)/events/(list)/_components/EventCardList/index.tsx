import type { EventEntity } from "@/domain/entities";
import { EventCard } from "./EventCard";

interface EventCardListProps {
  events: EventEntity[];
}

/**
 * イベントSPカード一覧
 */
export function EventCardList({ events }: EventCardListProps) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        イベントがありません
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
