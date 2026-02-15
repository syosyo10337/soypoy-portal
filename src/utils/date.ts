import { DateTime } from "luxon";

const DATE_FORMATS = {
  FULL_DATE_JP: "yyyy年MM月dd日(EEE) HH:mm",
  DATE_JP: "yyyy年MM月dd日",
  TIME: "HH:mm",
} as const;

type DateFormatKey = keyof typeof DATE_FORMATS;

export const APP_TIMEZONE = "Asia/Tokyo";
const DATE_PLACEHOLDER_TEXT = "日時不明";
const TIME_PLACEHOLDER_TEXT = "時刻未定";
const LOCALE = "ja";

/**
 * タイムゾーンを固定したDateTimeオブジェクトを作成する
 * trueを返すことで、isValidを強制する
 */
function dateTimeFromISO(dateString: string): DateTime<true> {
  return DateTime.fromISO(dateString)
    .setZone(APP_TIMEZONE)
    .setLocale(LOCALE) as DateTime<true>;
}

/**
 * ISO形式の日時文字列から指定されたフォーマットで文字列を返す
 *
 * @param dateString - ISO8601形式の日時文字列
 * @param format - FORMATSのキーまたはカスタムフォーマット文字列
 * @returns フォーマットされた日時文字列
 */
function format(dateString: string, format: DateFormatKey | string): string {
  try {
    const dt = dateTimeFromISO(dateString);

    if (!dt.isValid) {
      console.warn(`Invalid date string: ${dateString}`);
      return DATE_PLACEHOLDER_TEXT;
    }

    const formatString =
      format in DATE_FORMATS ? DATE_FORMATS[format as DateFormatKey] : format;

    return dt.toFormat(formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return DATE_PLACEHOLDER_TEXT;
  }
}

/**
 * 日本語形式の日付文字列を返す (shorthand)
 */
function formatDateJP(dateString: string): string {
  return format(dateString, DATE_FORMATS.DATE_JP);
}

function formatDateTimeJP(dateString: string): string {
  return format(dateString, DATE_FORMATS.FULL_DATE_JP);
}
/**
 * 時刻文字列を返す (shorthand)
 */
function formatTime(dateString: string): string {
  if (!hasTimeInfo(dateString)) {
    console.warn(`No time information in date string: ${dateString}`);
    return TIME_PLACEHOLDER_TEXT;
  }
  return format(dateString, DATE_FORMATS.TIME);
}

/**
 * ISO形式の文字列に時刻情報が含まれているかチェック
 */
function hasTimeInfo(dateString: string): boolean {
  return dateString.includes("T");
}

/**
 * MM/DD形式で日付を返す
 * 例: "12/25"
 */
function formatMonthDayOnly(dateString: string): string {
  const dt = parseDateTimeSafely(dateString);
  if (!dt) return DATE_PLACEHOLDER_TEXT;

  const month = dt.month.toString().padStart(2, "0");
  const day = dt.day.toString().padStart(2, "0");
  return `${month}/${day}`;
}

/**
 * 曜日を短縮形で返す
 * 例: "Sat."
 */
function formatDayOfWeek(dateString: string): string {
  const dt = parseDateTimeSafely(dateString);

  if (!dt) return "";
  return `${dt.setLocale("en").toFormat("EEE")}.`;
}

/**
 * 日付文字列を安全にパースする共通関数
 */
function parseDateTimeSafely(dateString: string): DateTime | undefined {
  try {
    const dt = dateTimeFromISO(dateString);
    if (!dt.isValid) {
      console.warn(`Invalid date string: ${dateString}`);
      return undefined;
    }
    return dt;
  } catch (error) {
    console.error("Date formatting error:", error);
    return undefined;
  }
}

/**
 * 指定月の金・土・日を取得
 */
function getWeekendDatesInMonth(
  year: number,
  month: number,
): Array<{ date: string; dayOfWeek: string }> {
  const dates: Array<{ date: string; dayOfWeek: string }> = [];
  const dt = DateTime.fromObject(
    { year, month },
    { zone: APP_TIMEZONE, locale: LOCALE },
  );

  if (!dt.isValid) {
    console.warn(`Invalid year/month: ${year}/${month}`);
    return dates;
  }

  const daysInMonth = dt.daysInMonth || 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = DateTime.fromObject(
      { year, month, day },
      { zone: APP_TIMEZONE, locale: LOCALE },
    );

    if (!currentDate.isValid) continue;

    const weekday = currentDate.weekday;
    if (weekday === 5 || weekday === 6 || weekday === 7) {
      const dateStr = currentDate.toISODate();
      if (dateStr) {
        dates.push({
          date: dateStr,
          dayOfWeek: currentDate.toFormat("EEE"),
        });
      }
    }
  }

  return dates;
}

/**
 * 月名を取得
 */
function getMonthName(
  year: number,
  month: number,
  locale: "ja" | "en" = "en",
): string {
  try {
    const dt = DateTime.fromObject(
      { year, month },
      { zone: APP_TIMEZONE, locale: locale === "ja" ? "ja" : "en" },
    );

    if (!dt.isValid) {
      console.warn(`Invalid year/month: ${year}/${month}`);
      return "";
    }

    if (locale === "ja") {
      return dt.toFormat("M月");
    }
    return dt.toFormat("MMMM");
  } catch (error) {
    console.error("Month name formatting error:", error);
    return "";
  }
}

/**
 * 曜日に応じた色クラスを取得
 * 土曜日(6): darkBlue, 日曜日(7): red, その他: 空文字列
 *
 * CSS変数 --color-day-saturday / --color-day-sunday を使用
 * (Tailwind v4 は動的クラス名を検出できないため静的クラス名を使用)
 */
function getDayOfWeekColorClass(dateString: string): string {
  const dt = dateTimeFromISO(dateString);
  if (!dt.isValid) return "";

  const weekday = dt.weekday;
  if (weekday < 6) return "";

  return weekday === 6 ? "text-day-saturday" : "text-day-sunday";
}

// =============================================================================
// Calendar Adapter Functions (ISO ↔ Date 変換)
// =============================================================================

/**
 * ISO文字列をDateオブジェクトに変換 (Calendar用)
 * APP_TIMEZONE (Asia/Tokyo) として解釈
 */
function isoToDate(isoString: string | undefined): Date | undefined {
  if (!isoString) return undefined;

  const dt = dateTimeFromISO(isoString);
  if (!dt.isValid) return undefined;

  return dt.toJSDate();
}

/**
 * DateオブジェクトをISO文字列に変換 (YYYY-MM-DD形式)
 * APP_TIMEZONE (Asia/Tokyo) として解釈
 */
function dateToIso(date: Date | undefined): string | undefined {
  if (!date) return undefined;

  const dt = DateTime.fromJSDate(date, { zone: APP_TIMEZONE });
  if (!dt.isValid) return undefined;

  return dt.toISODate() ?? undefined;
}

/**
 * DateオブジェクトをフルISO8601文字列に変換
 * DB (UTC) からの変換用
 */
function dateToIsoFull(date: Date): string {
  const dt = DateTime.fromJSDate(date, { zone: "utc" });
  return dt.toISO() ?? "";
}

/**
 * ISO文字列配列をDateオブジェクト配列に変換 (multiple mode用)
 */
function isoArrayToDateArray(
  isoStrings: string[] | undefined,
): Date[] | undefined {
  if (!isoStrings) return undefined;

  return isoStrings
    .map((iso) => isoToDate(iso))
    .filter((date): date is Date => date !== undefined);
}

/**
 * Dateオブジェクト配列をISO文字列配列に変換 (multiple mode用)
 */
function dateArrayToIsoArray(dates: Date[] | undefined): string[] | undefined {
  if (!dates) return undefined;

  return dates
    .map((date) => dateToIso(date))
    .filter((iso): iso is string => iso !== undefined);
}

export {
  formatDateJP,
  formatDateTimeJP,
  formatTime,
  formatMonthDayOnly,
  formatDayOfWeek,
  getWeekendDatesInMonth,
  getMonthName,
  getDayOfWeekColorClass,
  isoToDate,
  dateToIso,
  dateToIsoFull,
  isoArrayToDateArray,
  dateArrayToIsoArray,
  dateTimeFromISO,
};
