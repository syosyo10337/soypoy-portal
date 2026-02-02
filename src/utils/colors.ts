/**
 * SOY-POY 共通カラーパレット
 */
export const COLORS = {
  red: "#D6423B",
  green: "#657C60",
  darkBlue: "#2C3E50",
  brown: "#5B3A2E",
  gold: "#8C6A1F",
} as const;

/**
 * メンバーカルーセル用カラーテーマ
 */
export const MEMBER_COLOR_THEME = [
  COLORS.red,
  COLORS.green,
  COLORS.darkBlue,
  COLORS.brown,
  COLORS.gold,
] as const;

/**
 * 曜日別カラー設定
 */
export const DAY_OF_WEEK_COLORS = {
  saturday: COLORS.darkBlue,
  sunday: COLORS.red,
} as const;
