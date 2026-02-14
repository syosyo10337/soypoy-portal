import type { Metadata } from "next";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { EventsTable } from "./_components";

export const metadata: Metadata = {
  title: "イベント一覧",
};

export default function EventsListPage() {
  return (
    <ListView>
      <ListViewHeader />
      <EventsTable />
    </ListView>
  );
}
