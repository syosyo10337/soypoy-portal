import { createPublicServerCaller } from "@/infrastructure/trpc/server";
import EventGrid from "./EventGrid";
import { MarqueeDirection, PickUpMarquee } from "./PickUpMarquee";

export default async function PickUpSection() {
  try {
    const trpc = await createPublicServerCaller();
    const events = await trpc.events.listPickup();

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
  } catch (error) {
    console.error("[PickUpSection] ピックアップイベント取得エラー:", error);
    return null;
  }
}
