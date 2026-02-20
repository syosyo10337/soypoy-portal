import { and, desc, eq, notInArray, sql } from "drizzle-orm";
import { PICKUP_EVENTS_LIMIT } from "@/constant/pickupEvents";
import { PublicationStatus } from "@/domain/entities";
import type { EventEntity } from "@/domain/entities/";
import type { EventRepository } from "@/domain/repositories/eventRepository";
import { dateTimeFromISO, dateToIsoFull } from "@/utils/date";
import { db } from "../index";
import type { DrizzleEvent, DrizzleEventInsert } from "../schema";
import { events } from "../schema";

/**
 * Drizzleを使用したEventRepository実装
 */
export class DrizzleEventRepository implements EventRepository {
  /**
   * 全てのイベントを取得
   */
  async list(): Promise<EventEntity[]> {
    const drizzleEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.date));
    return drizzleEvents.map(this.toDomainEntity);
  }

  /**
   * 指定月のイベントを取得
   */
  async listByMonth(year: number, month: number): Promise<EventEntity[]> {
    const drizzleEvents = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.publicationStatus, PublicationStatus.Published),
          sql`EXTRACT(YEAR FROM ${events.date}) = ${year}`,
          sql`EXTRACT(MONTH FROM ${events.date}) = ${month}`,
        ),
      );
    return drizzleEvents.map(this.toDomainEntity);
  }

  /**
   * ピックアップイベントを取得
   * isPickup=true、公開済みのみ、日付降順（最新順）、最大4件
   */
  async listPickup(): Promise<EventEntity[]> {
    const drizzleEvents = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.isPickup, true),
          eq(events.publicationStatus, PublicationStatus.Published),
        ),
      )
      .orderBy(desc(events.date))
      .limit(PICKUP_EVENTS_LIMIT);
    return drizzleEvents.map(this.toDomainEntity);
  }

  /**
   * 最新の公開済みイベントを取得（日付降順）
   */
  async listLatestPublished(
    limit: number,
    excludeIds: string[] = [],
  ): Promise<EventEntity[]> {
    if (limit <= 0) return [];
    const conditions = [
      eq(events.publicationStatus, PublicationStatus.Published),
    ];
    if (excludeIds.length > 0) {
      conditions.push(notInArray(events.id, excludeIds));
    }
    const drizzleEvents = await db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(desc(events.date))
      .limit(limit);
    return drizzleEvents.map(this.toDomainEntity);
  }

  /**
   * IDによるイベント取得
   */
  async findById(id: string): Promise<EventEntity | undefined> {
    const [drizzleEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    return drizzleEvent ? this.toDomainEntity(drizzleEvent) : undefined;
  }

  /**
   * イベントを作成
   */
  async create(event: EventEntity): Promise<EventEntity> {
    const insertData: DrizzleEventInsert = {
      id: event.id,
      publicationStatus: event.publicationStatus,
      title: event.title,
      date: dateTimeFromISO(event.date).toJSDate(),
      description: event.description ?? null,
      thumbnail: event.thumbnail ?? null,
      type: event.type,
      isPickup: event.isPickup,
    };

    await db.insert(events).values(insertData);

    return event;
  }

  /**
   * イベントを更新
   */
  async update(
    id: string,
    event: Partial<Omit<EventEntity, "id">>,
  ): Promise<EventEntity> {
    const updateData: Partial<DrizzleEventInsert> = {
      ...(event.publicationStatus !== undefined && {
        publicationStatus: event.publicationStatus,
      }),
      ...(event.title !== undefined && { title: event.title }),
      ...(event.date !== undefined && {
        date: dateTimeFromISO(event.date).toJSDate(),
      }),
      ...(event.description !== undefined && {
        description: event.description ?? null,
      }),
      ...(event.thumbnail !== undefined && {
        thumbnail: event.thumbnail ?? null,
      }),
      ...(event.type !== undefined && { type: event.type }),
      ...(event.isPickup !== undefined && { isPickup: event.isPickup }),
    };

    const [updated] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();

    if (!updated) {
      throw new Error(`イベントが見つかりません (id: ${id})`);
    }

    return this.toDomainEntity(updated);
  }

  /**
   * イベントを削除（論理削除：Archived に変更）
   */
  async delete(id: string): Promise<void> {
    const [deleted] = await db
      .update(events)
      .set({ publicationStatus: PublicationStatus.Archived })
      .where(eq(events.id, id))
      .returning();

    if (!deleted) {
      throw new Error(`イベントが見つかりません (id: ${id})`);
    }
  }

  /**
   * Drizzleのイベントデータをドメインエンティティに変換
   */
  private toDomainEntity(drizzleEvent: DrizzleEvent): EventEntity {
    return {
      id: drizzleEvent.id,
      publicationStatus:
        drizzleEvent.publicationStatus as EventEntity["publicationStatus"],
      title: drizzleEvent.title,
      date: dateToIsoFull(drizzleEvent.date),
      description: drizzleEvent.description ?? undefined,
      thumbnail: drizzleEvent.thumbnail ?? undefined,
      type: drizzleEvent.type as EventEntity["type"],
      isPickup: drizzleEvent.isPickup,
    };
  }
}
