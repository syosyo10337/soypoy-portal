"use client";

import { cn } from "@/utils/cn";
import { DayStatus, DayType } from "./types";

type CalendarCellProps = {
  day: number;
  dayType: DayType;
  status: DayStatus;
  eventTitle?: string;
  onClick?: () => void;
};

export function CalendarCell({
  day,
  dayType,
  status,
  eventTitle,
  onClick,
}: CalendarCellProps) {
  const isClickable = status === DayStatus.Closed || status === DayStatus.Open;

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={isClickable ? onClick : undefined}
      className={cn(
        "aspect-square flex flex-col items-center rounded-md text-sm transition-colors pt-1.5",
        status === DayStatus.WeekDay &&
          "bg-gray-100 text-gray-400 cursor-not-allowed",
        status === DayStatus.Event &&
          "bg-blue-50 text-blue-600 cursor-not-allowed border border-blue-200",
        status === DayStatus.Closed &&
          "bg-[#F0433C] text-white cursor-pointer hover:bg-[#d93a34]",
        status === DayStatus.Open &&
          "bg-white text-gray-900 cursor-pointer hover:bg-gray-50 border border-gray-200",
        // 曜日識別のボーダーは status のボーダーより優先（後置で twMerge に勝たせる）
        dayType === DayType.Sunday && "border-2 border-day-sunday/50",
        dayType === DayType.Saturday && "border-2 border-day-saturday/50",
      )}
    >
      <span className="font-medium text-xs">{day}</span>
      {status === DayStatus.Event && eventTitle && (
        <span className="text-[10px] leading-tight flex-1 flex items-center text-center px-0.5 line-clamp-2">
          {eventTitle}
        </span>
      )}
      {status === DayStatus.Closed && (
        <span className="text-sm font-semibold flex-1 flex items-center">
          休業
        </span>
      )}
    </button>
  );
}
