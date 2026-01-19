import { DateTime } from "luxon";
import { Suspense } from "react";
import { PageTitle } from "@/components/PageTitle";
import { createServerCaller } from "@/infrastructure/trpc/server";
import { cn } from "@/utils/cn";
import { APP_TIMEZONE } from "@/utils/date";
import { EventList } from "./_components/EventList";
import { EventListSkeleton } from "./_components/EventList/EventListSkeleton";
import { MonthNavigation } from "./_components/MonthNavigation";
import { ScheduleAnnouncement } from "./_components/ScheduleAnnouncement";

export const revalidate = 60 * 5;

interface EventsPageProps {
  searchParams: Promise<{ month: string }>;
}

//TODO: queryパラメータの設計する。
// defaultは今月 yearも分けた方がよさそう。
export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { year, month } = getYearAndMonthFromSearchParams(
    resolvedSearchParams.month,
  );

  const trpc = await createServerCaller();
  const events = await trpc.events.listByMonth({ year, month });
  const closedDays = await trpc.closedDays.listByMonth({ year, month });

  return (
    <div className={cn("container mx-auto max-w-5xl", "px-12 md:px-16 py-8")}>
      <PageTitle title="EVENTS" subtitle="Monthly Lineup" />
      <MonthNavigation year={year} month={month} />
      <Suspense fallback={<EventListSkeleton />}>
        <EventList events={events} />
      </Suspense>
      <ScheduleAnnouncement
        year={year}
        month={month}
        events={events}
        closedDays={closedDays}
      />
    </div>
  );
}

function getYearAndMonthFromSearchParams(monthParam: string | undefined) {
  if (!monthParam) {
    const now = DateTime.now().setZone(APP_TIMEZONE);
    return { year: now.year, month: now.month };
  }
  const [yearStr, monthStr] = monthParam.split("-");
  return {
    year: Number.parseInt(yearStr, 10),
    month: Number.parseInt(monthStr, 10),
  };
}
