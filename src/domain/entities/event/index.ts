import type { EventType } from "./eventType";
import type { PublicationStatus } from "./publicationStatus";

export { EventType } from "./eventType";
export { PublicationStatus } from "./publicationStatus";

/**
 * イベントエンティティ
 * ドメイン層のイベントを表す
 */
export interface EventEntity {
  id: string;
  publicationStatus: PublicationStatus;
  title: string;
  /**
   * 日時文字列
   * 時刻がある時はISO8601形式、ない時はYYYY-MM-DD形式
   */
  date: string;
  description?: string;
  /**
   * 画像URL
   */
  thumbnail?: string | null;
  type: EventType;
}
