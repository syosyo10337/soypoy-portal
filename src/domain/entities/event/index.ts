import type { EventType } from "./eventType";
import type { Performer } from "./performer";
import type { PricingTier } from "./pricing";
import type { PublicationStatus } from "./publicationStatus";
export { EventType } from "./eventType";
export type { Performer } from "./performer";
export type { PricingTier } from "./pricing";
export { PublicationStatus } from "./publicationStatus";

/** デフォルト開場時間 */
export const DEFAULT_OPEN_TIME = "19:00";
/** デフォルト開始時間 */
export const DEFAULT_START_TIME = "20:00";

/**
 * イベントエンティティ
 * ドメイン層のイベントを表す
 */
export interface EventEntity {
  id: string;
  publicationStatus: PublicationStatus;
  title: string;
  /** 日付 (YYYY-MM-DD) */
  date: string;
  description?: string;
  /**
   * 画像URL
   */
  thumbnail?: string | null;
  type: EventType;
  /**
   * ピックアップイベントとして表示するかどうか
   */
  isPickup: boolean;
  /** 開場時間 (HH:mm) */
  openTime: string;
  /** 開始時間 (HH:mm) */
  startTime: string;
  /** 料金一覧 */
  pricing?: PricingTier[] | null;
  /** 出演者一覧 */
  performers?: Performer[] | null;
  /** ハッシュタグ (#なし) */
  hashtags?: string[] | null;
}
