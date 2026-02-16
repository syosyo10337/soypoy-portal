"use client";

import { DateTime } from "luxon";
import { Suspense, useState, useTransition } from "react";
import { APP_TIMEZONE } from "@/utils/date";
import { MonthSelector } from "../MonthSelector";
import { CalendarContent } from "./CalendarContent";
import { CalendarSkeleton } from "./CalendarSkeleton";

export function ClosedDaysCalendar() {
  const now = DateTime.now().setZone(APP_TIMEZONE);
  const [currentYear, setCurrentYear] = useState(now.year);
  const [currentMonth, setCurrentMonth] = useState(now.month);
  const [isPending, startTransition] = useTransition();

  const handlePreviousMonth = () => {
    startTransition(() => {
      if (currentMonth === 1) {
        setCurrentYear((y) => y - 1);
        setCurrentMonth(12);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    });
  };

  const handleNextMonth = () => {
    startTransition(() => {
      if (currentMonth === 12) {
        setCurrentYear((y) => y + 1);
        setCurrentMonth(1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    });
  };

  return (
    <div className="px-16 space-y-6">
      <MonthSelector
        year={currentYear}
        month={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarContent
          year={currentYear}
          month={currentMonth}
          isPending={isPending}
        />
      </Suspense>
    </div>
  );
}
