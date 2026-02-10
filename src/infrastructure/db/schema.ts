import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { EventType, PublicationStatus } from "@/domain/entities";

export * from "./authSchema";

export const eventTypeEnum = pgEnum("event_type", [
  EventType.Art,
  EventType.Comedy,
  EventType.Dance,
  EventType.Design,
  EventType.Impro,
  EventType.Impro_Kanji,
  EventType.Movie,
  EventType.Music,
  EventType.Photo,
  EventType.Talk,
  EventType.Theater,
  EventType.Workshop,
  EventType.Other,
]);

export const publicationStatusEnum = pgEnum("publication_status", [
  PublicationStatus.Draft,
  PublicationStatus.Published,
  PublicationStatus.Archived,
]);

export const events = pgTable("events", {
  id: text().primaryKey(),
  publicationStatus: publicationStatusEnum().notNull(),
  title: varchar({ length: 255 }).notNull(),
  date: timestamp({ mode: "date", withTimezone: true }).notNull(),
  description: text(),
  thumbnail: text(),
  type: eventTypeEnum().notNull(),
  isPickup: boolean().notNull().default(false),
});

export const closedDays = pgTable("closed_days", {
  id: text().primaryKey(),
  date: timestamp({ mode: "date", withTimezone: true }).notNull(),
});

export type DrizzleEvent = InferSelectModel<typeof events>;
export type DrizzleEventInsert = InferInsertModel<typeof events>;
export type DrizzleClosedDay = InferSelectModel<typeof closedDays>;
export type DrizzleClosedDayInsert = InferInsertModel<typeof closedDays>;
