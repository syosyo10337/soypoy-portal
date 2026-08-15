import type { ClosedDayEntity } from "@/domain/entities/closedDay";
// NOTE: ClosedDayRepository still requires deleteByMonth/createMany at this point
// in the migration (Task 3 trims it to read-only). This class only implements the
// read subset, so `implements ClosedDayRepository` is intentionally omitted for now.
import { closedDays } from "@/data/closedDays";

/**
 * 静的データを使用したClosedDayRepository実装
 * DBの代わりに src/data/closedDays.ts の配列を参照する
 */
export class StaticClosedDayRepository {
  async listByMonth(year: number, month: number): Promise<ClosedDayEntity[]> {
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
    return closedDays.filter((closedDay) =>
      closedDay.date.startsWith(monthPrefix),
    );
  }
}
