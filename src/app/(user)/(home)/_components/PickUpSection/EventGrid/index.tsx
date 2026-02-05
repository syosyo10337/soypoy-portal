import type { EventEntity } from "@/domain/entities";
import { cn } from "@/utils/cn";
import GridItem from "./GridItem";

interface EventGridProps {
  events: EventEntity[];
}

export default function EventGrid({ events }: EventGridProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap justify-center",
        "w-full mx-auto text-center",
        "max-w-[560px] md:max-w-[630px] lg:max-w-full xl:max-w-[80vw] 2xl:max-w-[70vw]", //NOTE: md~xlはタブレット表示なので横幅固定
        "[&>*]:w-1/2 lg:[&>*]:w-1/4", // 2列 → lg以上で4列
      )}
    >
      {events.map((event, index) => (
        <GridItem
          key={event.id}
          thumbnail={event.thumbnail}
          title={event.title}
          link={`/events/${event.id}`}
          date={event.date}
          type={event.type}
          index={index}
        />
      ))}
    </div>
  );
}
