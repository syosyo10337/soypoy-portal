import type { EventType } from "./eventType";
import type { Performer } from "./performer";
import type { PricingTier } from "./pricing";
import type { PublicationStatus } from "./publicationStatus";
import type { Venue } from "./venue";

export { EventType } from "./eventType";
export { PublicationStatus } from "./publicationStatus";
export type { Venue, PresetVenueId } from "./venue";
export { PRESET_VENUES } from "./venue";
export type { Performer } from "./performer";
export type { PricingTier } from "./pricing";

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
  /**
   * ピックアップイベントとして表示するかどうか
   */
  isPickup: boolean;
  /** 開場時間 (HH:mm) */
  openTime?: string | null;
  /** 開始時間 (HH:mm) */
  startTime?: string | null;
  /** 料金一覧 */
  pricing?: PricingTier[] | null;
  /** 会場情報 */
  venue?: Venue | null;
  /** 出演者一覧 */
  performers?: Performer[] | null;
  /** ハッシュタグ (#なし) */
  hashtags?: string[] | null;
}
