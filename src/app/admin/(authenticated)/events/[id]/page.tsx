import type { Metadata } from "next";
import { EventDetailContent } from "./_components/EventDetailContent";

export const metadata: Metadata = {
  title: "イベント詳細",
};

// NOTE: pageをclient componentにしたくない。
export default function EventShowPage() {
  return <EventDetailContent />;
}
