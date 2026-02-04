import type { PickUpEvent } from "@/app/(user)/(home)/_dummies/pickUpEvent";
import { cn } from "@/utils/cn";
import GridItem from "./GridItem";

interface EventGridProps {
  events: PickUpEvent[];
}

export default function EventGrid({ events }: EventGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4",
        "w-full mx-auto text-center",
        "max-w-[560px] md:max-w-[630px] lg:max-w-full xl:max-w-[80vw] 2xl:max-w-[70vw]", //NOTE: md~xlはタブレット表示なので横幅固定
      )}
    >
      {events.map((event, index) => (
        <GridItem
          key={event.id}
          thumbnail={event.thumbnail}
          title={event.title}
          link={event.link}
          date={event.date}
          eventType={event.eventType}
          index={index}
        />
      ))}
    </div>
  );
}
