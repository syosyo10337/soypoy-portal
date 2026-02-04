import { samplePickUpEvents } from "@/app/(user)/(home)/_dummies/pickUpEvent";
import EventGrid from "./EventGrid";
import { MarqueeDirection, PickUpMarquee } from "./PickUpMarquee";

export default function PickUpSection() {
  return (
    //NOTE:  relativeとbgでfudaより前に配置する。
    <section className="relative bg-soypoy-main">
      <PickUpMarquee direction={MarqueeDirection.normal} />
      <EventGrid events={samplePickUpEvents} />
      <PickUpMarquee direction={MarqueeDirection.reverse} />
    </section>
  );
}
