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

  /**
   * 指定月の休業日を全削除
   */
  deleteByMonth(year: number, month: number): Promise<void>;

  /**
   * 複数の休業日を一括作成
   */
  createMany(closedDays: ClosedDayEntity[]): Promise<ClosedDayEntity[]>;
}
