"use client";

import { cn } from "@/utils/cn";
import { getMonthName } from "@/utils/date";
import { NextMonthButton, PreviousMonthButton } from "./NavigateButton";
import { useNavigateMonth } from "./useNavigateMonth";

interface MonthNavigationProps {
  year: number;
  month: number;
}

export function MonthNavigation({ year, month }: MonthNavigationProps) {
  const navigateMonth = useNavigateMonth(year, month);

  const goToPreviousMonth = () => navigateMonth(-1);
  const goToNextMonth = () => navigateMonth(1);

  const monthNumber = String(month).padStart(2, "0");
  const monthName = getMonthName(year, month);

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "md:gap-8 mb-8 md:mb-12",
        "text-soypoy-secondary font-display font-medium",
      )}
    >
      <PreviousMonthButton onClick={goToPreviousMonth} />
      {/* font違うけどいい感じ */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-base md:text-lg">{year}</div>
        <div className="text-[40px] md:text-[56px] leading-[26px]">
          {monthNumber}
        </div>
        <div className="text-sm md:text-lg">{monthName}</div>
      </div>

      <NextMonthButton onClick={goToNextMonth} />
    </div>
  );
}
