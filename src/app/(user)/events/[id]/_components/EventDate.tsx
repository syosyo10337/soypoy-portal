import { cn } from "@/utils/cn";
import {
  formatDayOfWeek,
  formatMonthDayOnly,
  getDayOfWeekColorClass,
} from "@/utils/date";

export interface EventDateProps {
  date: string;
  className?: string;
}

export function EventDate({ date, className }: EventDateProps) {
  return (
    <div className={cn(className)}>
      <time
        className={cn(
          "font-medium",
          "text-5xl md:text-6xl",
          "leading-none",
          "block",
        )}
        dateTime={date}
      >
        {formatMonthDayOnly(date)}
      </time>
      <span
        className={cn(
          "font-semibold",
          "text-xl md:text-2xl",
          "leading-tight",
          "block mt-.5",
          "ml-1", // 視覚的に左揃えに見えるように
          getDayOfWeekColorClass(date),
        )}
      >
        {formatDayOfWeek(date)}
      </span>
    </div>
  );
}
