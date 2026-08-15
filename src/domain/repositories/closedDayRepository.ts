import type { ClosedDayEntity } from "../entities/closedDay";

/**
 * 休業日リポジトリインターフェース
 * データアクセスの抽象化
 */
export interface ClosedDayRepository {
  /**
   * 指定月の休業日を取得
   */
  listByMonth(year: number, month: number): Promise<ClosedDayEntity[]>;
}
