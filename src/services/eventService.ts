import { PICKUP_EVENTS_LIMIT } from "@/constant/pickupEvents";
import type { EventEntity } from "@/domain/entities";
import type { EventRepository } from "@/domain/repositories/eventRepository";

/**
 * イベントサービス
 * ビジネスロジックを担当
 */
export class EventService {
  constructor(private repository: EventRepository) {}

  async getAllEvents(): Promise<EventEntity[]> {
    return await this.repository.list();
  }

  async getEventById(id: string): Promise<EventEntity | undefined> {
    return await this.repository.findById(id);
  }

  async getEventsByMonth(year: number, month: number): Promise<EventEntity[]> {
    return await this.repository.listByMonth(year, month);
  }

  async getPickupEvents(): Promise<EventEntity[]> {
    const pickupEvents = await this.repository.listPickup();
    if (pickupEvents.length >= PICKUP_EVENTS_LIMIT) {
      return pickupEvents;
    }
    const remaining = PICKUP_EVENTS_LIMIT - pickupEvents.length;
    const excludeIds = pickupEvents.map((e) => e.id);
    const fallbackEvents = await this.repository.listLatestPublished(
      remaining,
      excludeIds,
    );
    return [...pickupEvents, ...fallbackEvents];
  }
}
