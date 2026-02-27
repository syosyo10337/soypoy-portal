/**
 * プリセット会場の定義
 */
export const PRESET_VENUES = {
  soypoy: {
    id: "soypoy",
    name: "soypoy",
  },
} as const satisfies Record<string, { id: string; name: string }>;

export type PresetVenueId = keyof typeof PRESET_VENUES;

/**
 * 会場情報
 * - preset: プリセット会場から選択
 * - custom: カスタム入力
 */
export type Venue =
  | {
      type: "preset";
      presetId: PresetVenueId;
    }
  | {
      type: "custom";
      customName: string;
      instagramHandle?: string;
    };
