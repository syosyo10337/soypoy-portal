import { Skeleton } from "@/components/shadcn/skeleton";
import { EventListSkeleton } from "./EventList/EventListSkeleton";

export function EventsContentSkeleton() {
  return (
    <>
      <EventListSkeleton />
      <ScheduleAnnouncementSkeleton />
    </>
  );
}

function ScheduleAnnouncementSkeleton() {
  return (
    <div className="mt-8 md:mt-12">
      <Skeleton className="h-7 md:h-8 w-48 mx-auto mb-2" />
      <Skeleton className="h-4 md:h-5 w-full lg:w-96 lg:mx-auto mb-4" />
      <div className="flex flex-wrap gap-2 lg:justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: スケルトンのため影響なし
            key={i}
            className="w-[calc((100%-32px)/4)] sm:w-[calc((100%-40px)/6)] md:w-[calc((100%-56px)/8)] lg:w-[calc((100%-72px)/10)] aspect-square"
          />
        ))}
      </div>
    </div>
  );
}
