import { and, sql } from "drizzle-orm";
import type { ClosedDayEntity } from "@/domain/entities/closedDay";
import type { ClosedDayRepository } from "@/domain/repositories/closedDayRepository";
import { dateTimeFromISO, dateToIso } from "@/utils/date";
import { db } from "../index";
import type { DrizzleClosedDay, DrizzleClosedDayInsert } from "../schema";
import { closedDays } from "../schema";

/**
 * Drizzleを使用したClosedDayRepository実装
 */
export class DrizzleClosedDayRepository implements ClosedDayRepository {
  /**
   * 指定月の休業日を取得
   */
  async listByMonth(year: number, month: number): Promise<ClosedDayEntity[]> {
    const drizzleClosedDays = await db
      .select()
      .from(closedDays)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${closedDays.date}) = ${year}`,
          sql`EXTRACT(MONTH FROM ${closedDays.date}) = ${month}`,
        ),
      );

    return drizzleClosedDays.map(this.toDomainEntity);
  }

  /**
   * 指定月の休業日を全削除
   */
  async deleteByMonth(year: number, month: number): Promise<void> {
    await db
      .delete(closedDays)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${closedDays.date}) = ${year}`,
          sql`EXTRACT(MONTH FROM ${closedDays.date}) = ${month}`,
        ),
      );
  }

  /**
   * 複数の休業日を一括作成
   */
  async createMany(entities: ClosedDayEntity[]): Promise<ClosedDayEntity[]> {
    if (entities.length === 0) return [];

    const insertData: DrizzleClosedDayInsert[] = entities.map((entity) => ({
      id: entity.id,
      date: dateTimeFromISO(entity.date).toJSDate(),
    }));

    await db.insert(closedDays).values(insertData);
    return entities;
  }

  /**
   * Drizzleの休業日データをドメインエンティティに変換
   */
  private toDomainEntity(drizzleClosedDay: DrizzleClosedDay): ClosedDayEntity {
    return {
      id: drizzleClosedDay.id,
      date: dateToIso(drizzleClosedDay.date) ?? "",
    };
  }
}
