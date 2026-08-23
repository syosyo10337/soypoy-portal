import type { ClosedDayEntity } from "@/domain/entities/closedDay";
import type { ClosedDayRepository } from "@/domain/repositories/closedDayRepository";

/**
 * 休業日サービス
 * ビジネスロジックを担当
 */
export class ClosedDayService {
  constructor(private repository: ClosedDayRepository) {}

  async getClosedDaysByMonth(
    year: number,
    month: number,
  ): Promise<ClosedDayEntity[]> {
    return await this.repository.listByMonth(year, month);
  }
}
