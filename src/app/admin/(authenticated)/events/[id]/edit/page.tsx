import type { Metadata } from "next";
import { EventEditForm } from "./_components/EventEditForm";

export const metadata: Metadata = {
  title: "イベント編集",
};

export default function EventEditPage() {
  return <EventEditForm />;
}
