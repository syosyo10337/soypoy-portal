import { PICKUP_EVENTS_LIMIT } from "@/constant/pickupEvents";
import { PublicationStatus } from "@/domain/entities";
import type { EventEntity } from "@/domain/entities/event";
// NOTE: EventRepository still requires create/update/delete at this point in the
// migration (Task 3 trims it to read-only). This class only implements the read
// subset, so `implements EventRepository` is intentionally omitted for now.
import { events } from "@/data/events";

function byDateDesc(a: EventEntity, b: EventEntity): number {
  return b.date.localeCompare(a.date);
}

/**
 * 静的データを使用したEventRepository実装
 * DBの代わりに src/data/events.ts の配列を参照する
 */
export class StaticEventRepository {
  async list(): Promise<EventEntity[]> {
    return [...events].sort(byDateDesc);
  }

  async findById(id: string): Promise<EventEntity | undefined> {
    return events.find((event) => event.id === id);
  }

  async listByMonth(year: number, month: number): Promise<EventEntity[]> {
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
    return events.filter(
      (event) =>
        event.publicationStatus === PublicationStatus.Published &&
        event.date.startsWith(monthPrefix),
    );
  }

  async listPickup(): Promise<EventEntity[]> {
    return events
      .filter(
        (event) =>
          event.isPickup &&
          event.publicationStatus === PublicationStatus.Published,
      )
      .sort(byDateDesc)
      .slice(0, PICKUP_EVENTS_LIMIT);
  }

  async listLatestPublished(
    limit: number,
    excludeIds: string[] = [],
  ): Promise<EventEntity[]> {
    if (limit <= 0) return [];
    return events
      .filter(
        (event) =>
          event.publicationStatus === PublicationStatus.Published &&
          !excludeIds.includes(event.id),
      )
      .sort(byDateDesc)
      .slice(0, limit);
  }
}
