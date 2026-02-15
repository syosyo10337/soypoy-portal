"use client";

import { cn } from "@/utils/cn";

type CellStatus = "weekday" | "event" | "closed" | "open";
type DayType = "sunday" | "saturday" | "other";

interface CalendarCellProps {
  day: number;
  status: CellStatus;
  dayType: DayType;
  onClick?: () => void;
}

export function CalendarCell({
  day,
  status,
  dayType,
  onClick,
}: CalendarCellProps) {
  const isClickable = status === "closed" || status === "open";

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={isClickable ? onClick : undefined}
      className={cn(
        "aspect-square flex flex-col items-center rounded-md text-sm transition-colors pt-1.5",
        status === "weekday" && "bg-gray-100 text-gray-400 cursor-not-allowed",
        status === "event" &&
          "bg-blue-50 text-blue-600 cursor-not-allowed border border-blue-200",
        status === "closed" &&
          "bg-[#F0433C] text-white cursor-pointer hover:bg-[#d93a34]",
        status === "open" &&
          "bg-white text-gray-900 cursor-pointer hover:bg-gray-50 border border-gray-200",
        dayType === "sunday" && "border-2 border-day-sunday/50",
        dayType === "saturday" && "border-2 border-day-saturday/50",
      )}
    >
      <span className="font-medium text-xs">{day}</span>
      {status === "event" && (
        <span className="text-sm font-semibold flex-1 flex items-center">
          イベント
        </span>
      )}
      {status === "closed" && (
        <span className="text-sm font-semibold flex-1 flex items-center">
          休業
        </span>
      )}
    </button>
  );
}
