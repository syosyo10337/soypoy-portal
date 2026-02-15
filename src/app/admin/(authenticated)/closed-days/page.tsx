import type { Metadata } from "next";
import { ClosedDaysCalendar } from "./_components/ClosedDaysCalendar";
import { ClosedDaysHeader } from "./_components/ClosedDaysHeader";

export const metadata: Metadata = {
  title: "休業日管理",
};

export default function ClosedDaysPage() {
  return (
    <div className="flex flex-col gap-4">
      <ClosedDaysHeader />
      <ClosedDaysCalendar />
    </div>
  );
}
