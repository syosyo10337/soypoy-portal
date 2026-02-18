import type { EventEntity } from "../entities/event";

/**
 * イベントリポジトリインターフェース
 * データアクセスの抽象化
 */
export interface EventRepository {
  /**
   * 全てのイベントを取得
   */
  list(): Promise<EventEntity[]>;

  /**
   * IDによるイベント取得
   */
  findById(id: string): Promise<EventEntity | undefined>;

  /**
   * イベントを作成
   */
  create(event: EventEntity): Promise<EventEntity>;

  /**
   * イベントを更新
   */
  update(
    id: string,
    event: Partial<Omit<EventEntity, "id">>,
  ): Promise<EventEntity>;

  /**
   * イベントを削除
   */
  delete(id: string): Promise<void>;

  /**
   * 指定月のイベントを取得
   */
  listByMonth(year: number, month: number): Promise<EventEntity[]>;

  /**
   * ピックアップイベントを取得（isPickup=true、公開済みのみ、日付降順）
   */
  listPickup(): Promise<EventEntity[]>;

  /**
   * 最新の公開済みイベントを取得（日付降順）
   */
  listLatestPublished(
    limit: number,
    excludeIds?: string[],
  ): Promise<EventEntity[]>;
}
