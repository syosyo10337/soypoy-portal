"use client";

import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/utils/date";
import { CalendarCell } from "./CalendarCell";
import { DayLabelsRow } from "./DayLabelsRow";
import { DayStatus, DayType } from "./types";

type DayInfo =
  | { status: typeof DayStatus.WeekDay; dayType: DayType }
  | { status: typeof DayStatus.Event; dayType: DayType; eventTitle: string }
  | { status: typeof DayStatus.Closed; dayType: DayType }
  | { status: typeof DayStatus.Open; dayType: DayType };

interface CalendarGridProps {
  year: number;
  month: number;
  closedDates: Set<string>;
  eventDates: Map<string, string>;
  onToggleDate: (date: string) => void;
}

export function CalendarGrid({
  year,
  month,
  closedDates,
  eventDates,
  onToggleDate,
}: CalendarGridProps) {
  const { daysInMonth, startOffset } = getMonthDays(year, month);

  const emptyCells = Array.from({ length: startOffset }, (_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: 空セルは固定順で状態を持たない
    <div key={`empty-${i}`} />
  ));

  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dt = DateTime.fromObject(
      { year, month, day },
      { zone: APP_TIMEZONE },
    );
    const dateStr = dt.toISODate() ?? "";
    const dayInfo = getDayInfo(dateStr, dt.weekday, closedDates, eventDates);
    return (
      <CalendarCellByStatus
        key={dateStr}
        day={day}
        dayInfo={dayInfo}
        onToggle={() => onToggleDate(dateStr)}
      />
    );
  });

  return (
    <div>
      <DayLabelsRow />
      <div className="grid grid-cols-7 gap-4">
        {emptyCells}
        {dayCells}
      </div>
    </div>
  );
}

const getMonthDays = (year: number, month: number) => {
  const firstDay = DateTime.fromObject(
    { year, month, day: 1 },
    { zone: APP_TIMEZONE },
  );
  const daysInMonth = firstDay.daysInMonth || 0;
  // 日曜始まり: Luxon weekday 7(日) → 0, 1(月) → 1, ...
  const startOffset = firstDay.weekday === 7 ? 0 : firstDay.weekday;

  return { daysInMonth, startOffset };
};

const getDayInfo = (
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

function CalendarCellByStatus({
  dayInfo,
  day,
  onToggle,
}: {
  dayInfo: DayInfo;
  day: number;
  onToggle: () => void;
}) {
  const base = { day, dayType: dayInfo.dayType } as const;

  switch (dayInfo.status) {
    case DayStatus.Event:
      return (
        <CalendarCell
          {...base}
          status={DayStatus.Event}
          eventTitle={dayInfo.eventTitle}
        />
      );
    case DayStatus.Closed:
    case DayStatus.Open:
      return (
        <CalendarCell {...base} status={dayInfo.status} onClick={onToggle} />
      );
    default:
      return <CalendarCell {...base} status={DayStatus.WeekDay} />;
  }
}
