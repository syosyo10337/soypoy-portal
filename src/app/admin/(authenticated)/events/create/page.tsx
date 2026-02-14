import type { Metadata } from "next";
import { CreateEventForm } from "./_components/CreateEventForm";

export const metadata: Metadata = {
  title: "イベント作成",
};

export default function EventCreatePage() {
  return <CreateEventForm />;
}
