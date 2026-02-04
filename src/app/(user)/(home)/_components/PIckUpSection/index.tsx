import { eventService } from "@/services";
import EventGrid from "./EventGrid";
import { MarqueeDirection, PickUpMarquee } from "./PickUpMarquee";

export default async function PickUpSection() {
  const events = await eventService.getPickupEvents();

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
