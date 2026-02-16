import { cn } from "@/utils/cn";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DayLabelsRow() {
  return (
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
  );
}
