"use client";

import { DateTime } from "luxon";
import { cn } from "@/utils/cn";
import { APP_TIMEZONE } from "@/utils/date";
import { CalendarCell } from "./CalendarCell";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  year: number;
  month: number;
  closedDates: Set<string>;
  eventDates: Set<string>;
  onToggleDate: (date: string) => void;
}

type CellStatus = "weekday" | "event" | "closed" | "open";
type DayType = "sunday" | "saturday" | "other";

function getDayInfo(
  dateStr: string,
  weekday: number,
  closedDates: Set<string>,
  eventDates: Set<string>,
): { status: CellStatus; dayType: DayType } {
  const dayType =
    weekday === 7 ? "sunday" : weekday === 6 ? "saturday" : "other";

  // 平日（月〜木）= Luxon weekday 1〜4
  if (weekday >= 1 && weekday <= 4) return { status: "weekday", dayType };

  // 金/土/日でイベントがある日
  if (eventDates.has(dateStr)) return { status: "event", dayType };

  // 休業日として選択済み
  if (closedDates.has(dateStr)) return { status: "closed", dayType };

  // 通常営業日（金/土/日）
  return { status: "open", dayType };
}
// TODO: refactor
export function CalendarGrid({
  year,
  month,
  closedDates,
  eventDates,
  onToggleDate,
}: CalendarGridProps) {
  const firstDay = DateTime.fromObject(
    { year, month, day: 1 },
    { zone: APP_TIMEZONE },
  );
  const daysInMonth = firstDay.daysInMonth || 0;

  // 日曜始まり: Luxon weekday 7(日) → 0, 1(月) → 1, ...
  const startOffset = firstDay.weekday === 7 ? 0 : firstDay.weekday;

  const cells: React.ReactNode[] = [];

  // 前月の空セル
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  // 各日付のセル
  for (let day = 1; day <= daysInMonth; day++) {
    const dt = DateTime.fromObject(
      { year, month, day },
      { zone: APP_TIMEZONE },
    );
    const dateStr = dt.toISODate() ?? "";
    const { status, dayType } = getDayInfo(
      dateStr,
      dt.weekday,
      closedDates,
      eventDates,
    );

    cells.push(
      <CalendarCell
        key={dateStr}
        day={day}
        status={status}
        dayType={dayType}
        onClick={() => onToggleDate(dateStr)}
      />,
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-4 mb-1">
        {DAY_LABELS.map((label, index) => (
          <div
            key={label}
            className={cn(
              "text-center text-xs font-medium py-2",
              index === 0 && "text-day-sunday",
              index === 6 && "text-day-saturday",
              index !== 0 && index !== 6 && "text-gray-500",
            )}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">{cells}</div>
    </div>
  );
}
