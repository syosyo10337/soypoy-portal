import { nanoid } from "nanoid";
import type { ClosedDayEntity } from "@/domain/entities/closedDay";
import type { ClosedDayRepository } from "@/domain/repositories/closedDayRepository";
import type { EventRepository } from "@/domain/repositories/eventRepository";
import { dateTimeFromISO } from "@/utils/date";
import { ClosedDayConflictError } from "./errors/closedDayConflictError";

/**
 * 休業日サービス
 * ビジネスロジックを担当
 */
export class ClosedDayService {
  constructor(
    private repository: ClosedDayRepository,
    private eventRepository: EventRepository,
  ) {}

  async getClosedDaysByMonth(
    year: number,
    month: number,
  ): Promise<ClosedDayEntity[]> {
    return await this.repository.listByMonth(year, month);
  }

  async syncMonth(
    year: number,
    month: number,
    dates: string[],
  ): Promise<ClosedDayEntity[]> {
    // 1. イベント重複チェック
    const events = await this.eventRepository.listByMonth(year, month);
    const eventDates = events.map((e) =>
      dateTimeFromISO(e.date).toFormat("yyyy-MM-dd"),
    );
    const conflicts = dates.filter((d) => eventDates.includes(d));

    if (conflicts.length > 0) {
      throw new ClosedDayConflictError(conflicts);
    }

    // 2. 該当月の既存休業日を削除
    await this.repository.deleteByMonth(year, month);

    // 3. 新しい休業日を作成
    if (dates.length === 0) return [];

    const newClosedDays: ClosedDayEntity[] = dates.map((date) => ({
      id: nanoid(),
      date,
    }));

    return await this.repository.createMany(newClosedDays);
  }
}
