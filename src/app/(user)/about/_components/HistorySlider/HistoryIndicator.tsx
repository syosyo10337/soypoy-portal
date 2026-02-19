import { cn } from "@/utils/cn";

interface HistoryIndicatorProps {
  total: number;
  activeIndex: number;
  onIndicatorClick: (index: number) => void;
}

export default function HistoryIndicator({
  total,
  activeIndex,
  onIndicatorClick,
}: HistoryIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: total }, (_, index) => {
        const indicatorId = `history-indicator-${index}`;
        return (
          <button
            key={indicatorId}
            type="button"
            onClick={() => onIndicatorClick(index)}
            className={cn(
              "rounded-full transition-all duration-300",
              "hover:scale-110 hover:opacity-80 active:scale-110 active:opacity-80",
              "focus:outline-none focus:ring-2 focus:ring-soypoy-accent focus:ring-offset-2",
              "cursor-pointer",
              index === activeIndex
                ? "w-3 h-3 bg-soypoy-accent"
                : "w-2 h-2 bg-black/30",
            )}
            aria-label={`ヒストリー ${index + 1}へ移動`}
            aria-current={index === activeIndex ? "true" : "false"}
          />
        );
      })}
    </div>
  );
}
