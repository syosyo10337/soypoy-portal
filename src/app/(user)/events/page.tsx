import { DateTime } from "luxon";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle } from "@/components/PageTitle";
import { createPublicServerCaller } from "@/infrastructure/trpc/server";
import { cn } from "@/utils/cn";
import { APP_TIMEZONE } from "@/utils/date";
import { EventList } from "./_components/EventList";
import { EventsContentSkeleton } from "./_components/EventsContentSkeleton";
import { MonthNavigation } from "./_components/MonthNavigation";
import { ScheduleAnnouncement } from "./_components/ScheduleAnnouncement";

export const metadata: Metadata = {
  title: "イベント",
  description:
    "SOY-POYで開催されるイベント一覧。オープンマイク、コンサート、ワークショップなど。",
};

export const revalidate = 300;

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

  return (
    <div className={cn("container mx-auto max-w-5xl", "px-12 md:px-16 py-8")}>
      <PageTitle title="EVENTS" subtitle="Monthly Lineup" />
      <MonthNavigation year={year} month={month} />
      <Suspense fallback={<EventsContentSkeleton />}>
        <EventsContent year={year} month={month} />
      </Suspense>
    </div>
  );
}

async function EventsContent({ year, month }: { year: number; month: number }) {
  const trpc = await createPublicServerCaller();
  const [events, closedDays] = await Promise.all([
    trpc.events.listByMonth({ year, month }),
    trpc.closedDays.listByMonth({ year, month }),
  ]);

  return (
    <>
      <EventList events={events} />
      <ScheduleAnnouncement
        year={year}
        month={month}
        events={events}
        closedDays={closedDays}
      />
    </>
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
