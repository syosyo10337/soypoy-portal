import type { Metadata } from "next";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { EventsContent } from "./_components/EventsContent";

export const metadata: Metadata = {
  title: "イベント一覧",
};

export default function EventsListPage() {
  return (
    <ListView>
      <ListViewHeader />
      <EventsContent />
    </ListView>
  );
}
