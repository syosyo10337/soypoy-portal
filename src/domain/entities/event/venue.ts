/**
 * 会場タイプ
 * preset: プリセット会場（SOY-POYなど）
 * custom: カスタム会場
 */
export type VenueType = "preset" | "custom";

/**
 * 会場エンティティ
 */
export interface Venue {
  type: VenueType;
  /** プリセット会場のID（type=presetの場合） */
  presetId?: string;
  /** カスタム会場名（type=customの場合） */
  customName?: string;
  /** Instagram ハンドル（@なし） */
  instagramHandle?: string;
}

/**
 * プリセット会場の定義
 */
export interface PresetVenue {
  id: string;
  name: string;
  instagramHandle?: string;
}

/**
 * プリセット会場一覧
 */
export const PRESET_VENUES: PresetVenue[] = [
  {
    id: "soypoy",
    name: "SOY-POY",
    instagramHandle: "soypoybar",
  },
];

/**
 * プリセット会場をIDで取得
 */
export function getPresetVenueById(id: string): PresetVenue | undefined {
  return PRESET_VENUES.find((venue) => venue.id === id);
}
