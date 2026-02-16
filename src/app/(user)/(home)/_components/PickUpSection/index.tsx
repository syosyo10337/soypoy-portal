import type { EventEntity } from "@/domain/entities";
import { eventService } from "@/services";
import EventGrid from "./EventGrid";
import { MarqueeDirection, PickUpMarquee } from "./PickUpMarquee";

export default async function PickUpSection() {
  let events: EventEntity[] = [];
  try {
    events = await eventService.getPickupEvents();
  } catch {
    return null;
  }

  // ピックアップイベントがない場合は表示しない
  if (events.length === 0) {
    return null;
  }

  return (
    //NOTE:  relativeとbgでfudaより前に配置する。
    <section className="relative bg-soypoy-main">
      <PickUpMarquee direction={MarqueeDirection.normal} />
      <EventGrid events={events} />
      <PickUpMarquee direction={MarqueeDirection.reverse} />
    </section>
  );
}
