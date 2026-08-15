import type { ClosedDayEntity } from "@/domain/entities/closedDay";
import type { ClosedDayRepository } from "@/domain/repositories/closedDayRepository";
import { closedDays } from "@/data/closedDays";

/**
 * 静的データを使用したClosedDayRepository実装
 * DBの代わりに src/data/closedDays.ts の配列を参照する
 */
export class StaticClosedDayRepository implements ClosedDayRepository {
  async listByMonth(year: number, month: number): Promise<ClosedDayEntity[]> {
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
    return closedDays.filter((closedDay) =>
      closedDay.date.startsWith(monthPrefix),
    );
  }
}
