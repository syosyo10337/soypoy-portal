"use client";

import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";
import { trpc } from "@/infrastructure/trpc/client";
import { APP_TIMEZONE } from "@/utils/date";
import { CalendarGrid } from "./CalendarGrid";
import { MonthSelector } from "./MonthSelector";

export function ClosedDaysCalendar() {
  const now = DateTime.now().setZone(APP_TIMEZONE);
  const [currentYear, setCurrentYear] = useState(now.year);
  const [currentMonth, setCurrentMonth] = useState(now.month);
  const [closedDates, setClosedDates] = useState<Set<string>>(new Set());

  const closedDaysQuery = trpc.closedDays.listByMonth.useQuery({
    year: currentYear,
    month: currentMonth,
  });

  const eventsQuery = trpc.events.listByMonth.useQuery({
    year: currentYear,
    month: currentMonth,
  });

  const syncMutation = trpc.closedDays.syncMonth.useMutation();

  // closedDays データが取得されたら state を初期化
  useEffect(() => {
    if (closedDaysQuery.data) {
      const dates = new Set(
        closedDaysQuery.data.map((cd) => cd.date.split("T")[0]),
      );
      setClosedDates(dates);
    }
  }, [closedDaysQuery.data]);

  const eventDates = useMemo(() => {
    if (!eventsQuery.data) return new Set<string>();
    return new Set(eventsQuery.data.map((e) => e.date.split("T")[0]));
  }, [eventsQuery.data]);

  const handlePreviousMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const handleToggleDate = useCallback((date: string) => {
    setClosedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await syncMutation.mutateAsync({
        year: currentYear,
        month: currentMonth,
        dates: Array.from(closedDates),
      });
      toast.success("保存しました");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "保存に失敗しました";
      toast.error(errorMessage);
    }
  }, [syncMutation, currentYear, currentMonth, closedDates]);

  const isLoading = closedDaysQuery.isLoading || eventsQuery.isLoading;

  return (
    <div className="px-16 space-y-6">
      <MonthSelector
        year={currentYear}
        month={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">読み込み中...</div>
      ) : (
        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          closedDates={closedDates}
          eventDates={eventDates}
          onToggleDate={handleToggleDate}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          ※ 下書きのイベントは、この画面では確認できません
        </p>
        <Button
          onClick={handleSave}
          disabled={syncMutation.isPending || isLoading}
        >
          {syncMutation.isPending ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}
