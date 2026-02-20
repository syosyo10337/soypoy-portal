"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";
import { trpc } from "@/infrastructure/trpc/client";
import { dateTimeFromISO } from "@/utils/date";
import { CalendarGrid } from "./CalendarGrid";

interface CalendarContentProps {
  year: number;
  month: number;
  isNavigating: boolean;
}

export function CalendarContent({
  year,
  month,
  isNavigating,
}: CalendarContentProps) {
  const [closedDates, setClosedDates] = useState<Set<string>>(new Set());

  const [closedDaysData, closedDaysQuery] =
    trpc.closedDays.listByMonth.useSuspenseQuery({
      year,
      month,
    });
  const [eventsData] = trpc.events.listByMonth.useSuspenseQuery({
    year,
    month,
  });
  const syncMutation = trpc.closedDays.syncMonth.useMutation();

  useEffect(() => {
    const dates = new Set(closedDaysData.map((cd) => cd.date));
    setClosedDates(dates);
  }, [closedDaysData]);

  const eventDates = new Map(
    eventsData.map((e) => [
      dateTimeFromISO(e.date).toFormat("yyyy-MM-dd"),
      e.title,
    ]),
  );

  const handleToggleDate = (date: string) => {
    setClosedDates((prev) => {
      // React は参照の同一性(Object.is)で変更を検知するため、新しい Set を生成する
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await syncMutation.mutateAsync({
        year,
        month,
        dates: Array.from(closedDates),
      });
      await closedDaysQuery.refetch();
      toast.success("保存しました");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "保存に失敗しました";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={
        isNavigating
          ? "space-y-6 opacity-60 pointer-events-none transition-opacity"
          : "space-y-6"
      }
    >
      <CalendarGrid
        year={year}
        month={month}
        closedDates={closedDates}
        eventDates={eventDates}
        onToggleDate={handleToggleDate}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          ※ 下書きのイベントは、この画面では確認できません
        </p>
        <Button onClick={handleSave} disabled={syncMutation.isPending}>
          {syncMutation.isPending ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}
