import { DayLabelsRow } from "./DayLabelsRow";

export function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <DayLabelsRow />
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 35 }, (_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeltonなので問題ない
              key={i}
              className="aspect-square rounded-md bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
