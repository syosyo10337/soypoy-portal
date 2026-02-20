import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/utils/date";
import { DayStatus, DayType } from "./types";

type DayInfo = {
  status: DayStatus;
  dayType: DayType;
  eventTitle?: string;
};

/**
 * ある日付が、何曜日(平日,土 or 日)で、かつどんな状態か(DayStatus)を返す
 */
export const getDayInfo = (
  dateStr: string,
  weekday: number,
  closedDates: Set<string>,
  eventDates: Map<string, string>,
): DayInfo => {
  const dayType =
    weekday === 7
      ? DayType.Sunday
      : weekday === 6
        ? DayType.Saturday
        : DayType.Other;

  // 平日（月〜木）= Luxon weekday 1〜4
  if (weekday >= 1 && weekday <= 4)
    return { status: DayStatus.WeekDay, dayType };

  // 金/土/日でイベントがある日
  const eventTitle = eventDates.get(dateStr);
  if (eventTitle) return { status: DayStatus.Event, dayType, eventTitle };

  if (closedDates.has(dateStr)) return { status: DayStatus.Closed, dayType };

  return { status: DayStatus.Open, dayType };
};

/**
 * 年月を引数に、初日が何曜日か(日曜始まりに対してどれくらいoffsetするか)?
 * 及び、月の日数を取得する
 */
export const getMonthDays = (year: number, month: number) => {
  const firstDay = DateTime.fromObject(
    { year, month, day: 1 },
    { zone: APP_TIMEZONE },
  );
  const daysInMonth = firstDay.daysInMonth || 0;
  // 日曜始まり: Luxon weekday 7(日) → 0, 1(月) → 1, ...
  const startOffset = firstDay.weekday !== 7 ? firstDay.weekday : 0;

  return { daysInMonth, startOffset };
};
