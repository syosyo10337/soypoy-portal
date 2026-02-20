"use client";

import { PageTitle } from "@/components/PageTitle";
import { cn } from "@/utils/cn";

export default function EventsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={cn("container mx-auto max-w-5xl", "px-12 md:px-16 py-8")}>
      <PageTitle title="EVENTS" subtitle="Monthly Lineup" />
      <div className="flex flex-col items-center gap-6 py-16 text-soypoy-secondary font-display">
        <p className="text-lg md:text-xl font-semibold">
          データの読み込みに失敗しました
        </p>
        <p className="text-sm md:text-base text-soypoy-muted">
          しばらくしてからもう一度お試しください
        </p>
        <button
          type="button"
          onClick={reset}
          className={cn(
            "px-6 py-2 rounded-md",
            "bg-soypoy-secondary text-soypoy-main",
            "text-sm font-semibold",
            "hover:opacity-80 transition-opacity",
          )}
        >
          再読み込み
        </button>
      </div>
    </div>
  );
}
