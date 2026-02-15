"use client";

import { cn } from "@/utils/cn";

type CellStatus = "weekday" | "event" | "closed" | "open";

interface CalendarCellProps {
  day: number;
  status: CellStatus;
  onClick?: () => void;
}

export function CalendarCell({ day, status, onClick }: CalendarCellProps) {
  const isClickable = status === "closed" || status === "open";

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={isClickable ? onClick : undefined}
      className={cn(
        "aspect-square flex flex-col items-center justify-center rounded-md text-sm transition-colors",
        status === "weekday" && "bg-gray-100 text-gray-400 cursor-not-allowed",
        status === "event" &&
          "bg-blue-50 text-blue-600 cursor-not-allowed border border-blue-200",
        status === "closed" &&
          "bg-[#F0433C] text-white cursor-pointer hover:bg-[#d93a34]",
        status === "open" &&
          "bg-white text-gray-900 cursor-pointer hover:bg-gray-50 border border-gray-200",
      )}
    >
      <span className="font-medium">{day}</span>
      {status === "event" && (
        <span className="text-[10px] leading-tight">イベント</span>
      )}
      {status === "closed" && (
        <span className="text-[10px] leading-tight">休業</span>
      )}
    </button>
  );
}
