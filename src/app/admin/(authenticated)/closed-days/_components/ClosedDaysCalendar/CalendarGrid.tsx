"use client";

import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/utils/date";
import { CalendarCell } from "./CalendarCell";
import { DayLabelsRow } from "./DayLabelsRow";
import { getDayInfo, getMonthDays } from "./helpers";

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
      <CalendarCell
        key={dateStr}
        day={day}
        {...dayInfo}
        onClick={() => onToggleDate(dateStr)}
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
