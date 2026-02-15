"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { getMonthName } from "@/utils/date";

interface MonthSelectorProps {
  year: number;
  month: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({
  year,
  month,
  onPreviousMonth,
  onNextMonth,
}: MonthSelectorProps) {
  const monthName = getMonthName(year, month);

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="outline" size="icon" onClick={onPreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-lg font-medium min-w-[200px] text-center">
        {year}/{String(month).padStart(2, "0")} ({monthName})
      </div>
      <Button variant="outline" size="icon" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
