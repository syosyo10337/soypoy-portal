import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";
import { createServerCaller } from "@/infrastructure/trpc/server";
import { cn } from "@/utils/cn";

import {
  EventBreadcrumb,
  EventDate,
  EventDescription,
  EventFooter,
  EventThumbnail,
  EventTitle,
} from "./_components";

export const revalidate = 60;

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const trpc = await createServerCaller();
  const event = await trpc.events.getById(id);

  if (!event) {
    return {
      title: "イベントが見つかりません",
    };
  }

  const description =
    event.description?.slice(0, 120) ||
    "SOY-POYで開催されるイベントの詳細情報です。";

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      ...(event.thumbnail && {
        images: [{ url: event.thumbnail }],
      }),
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;

  const trpc = await createServerCaller();
  const event = await trpc.events.getById(id);

  if (!event) notFound();

  return (
    <div className={cn("container mx-auto max-w-5xl", "px-8 md:px-16 py-8")}>
      <PageTitle title="Events" />
      <EventBreadcrumb eventTitle={event.title} />

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2",
          "gap-4 md:gap-8",
          "mt-6",
          "font-display",
        )}
      >
        <EventDate date={event.date} className="order-1" />
        <EventTitle title={event.title} className="order-2" />
        <EventThumbnail
          src={event.thumbnail}
          alt={event.title}
          eventType={event.type}
          className="order-3"
        />
        <EventDescription description={event.description} className="order-4" />
      </div>
      <EventFooter />
    </div>
  );
}
