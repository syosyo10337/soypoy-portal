import type { EventType } from "./eventType";
import type { PublicationStatus } from "./publicationStatus";
import type { Venue } from "./venue";

export { EventType } from "./eventType";
export { PublicationStatus } from "./publicationStatus";
export {
  type Venue,
  type VenueType,
  type PresetVenue,
  PRESET_VENUES,
  getPresetVenueById,
} from "./venue";

/**
 * 料金区分
 * 複数の料金体系（前売り/当日など）を表現
 */
export interface PricingTier {
  /** 料金ラベル（例: 前売り、当日、学生など） */
  label: string;
  /** 金額（円） */
  amount: number;
  /** 備考（例: ドリンク代別途500円） */
  note?: string;
}

/**
 * 出演者
 */
export interface Performer {
  /** 出演者名 */
  name: string;
  /** 役割（例: MC、ゲスト、出演など） */
  role?: string;
  /** Instagram ハンドル（@なし） */
  instagramHandle?: string;
}

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

  // === 構造化フィールド ===

  /**
   * 開場時間（ISO8601形式）
   */
  openTime?: string | null;
  /**
   * 開始時間（ISO8601形式）
   */
  startTime?: string | null;
  /**
   * 終了時間（ISO8601形式）
   */
  endTime?: string | null;
  /**
   * 料金一覧
   */
  pricing?: PricingTier[] | null;
  /**
   * 会場情報
   */
  venue?: Venue | null;
  /**
   * 出演者一覧
   */
  performers?: Performer[] | null;
  /**
   * ハッシュタグ一覧（#なし）
   */
  hashtags?: string[] | null;
}
