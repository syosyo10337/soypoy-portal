import { z } from "zod";
import { EventType, PublicationStatus } from "@/domain/entities";
import { imageFileSchema } from "./ImageFileSchema";

/**
 * イベントバリデーションスキーマ（Domain層）
 *
 * このスキーマはビジネスルール（ドメイン制約）を表現しています：
 * - タイトルは必須
 * - 日付は必須
 * - イベントタイプは定義された値のみ
 * - 公開ステータスは定義された値のみ
 *
 * UI層（フォーム）とAPI層（tRPC）の両方で使用されます。
 */

const publicationStatusValues = [
  PublicationStatus.Draft,
  PublicationStatus.Published,
  PublicationStatus.Archived,
] as const;

const eventTypeValues = [
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
] as const;

export const baseSchema = z.object({
  title: z.string({ message: "タイトルを入力してください" }).min(1, {
    message: "タイトルは必須です",
  }),
  date: z.string({ message: "日付を選択してください" }).min(1, {
    message: "日付は必須です",
  }),
  description: z.string().optional(),
  type: z.enum(eventTypeValues, {
    message: "イベントの種類を選択してください",
  }),
});

export const createEventFormSchema = baseSchema.extend({
  thumbnail: z.union([imageFileSchema, z.url()]).optional().nullable(),
  isPickup: z.boolean().optional(),
});

export const createEventSchema = baseSchema.extend({
  thumbnail: z.url().optional().nullable(),
  isPickup: z.boolean().default(false),
});

// NOTE: react-hook-formのnullable対応のため、optionalとnullableを両方指定
export const updateEventFormSchema = baseSchema.extend({
  publicationStatus: z.enum(publicationStatusValues),
  thumbnail: z.union([imageFileSchema, z.url()]).optional().nullable(),
  isPickup: z.boolean().optional(),
});

// NOTE: react-hook-formのnullable対応のため、optionalとnullableを両方指定
export const updateEventSchema = baseSchema.extend({
  publicationStatus: z.enum(publicationStatusValues),
  thumbnail: z.url().optional().nullable(),
  isPickup: z.boolean().default(false),
});

// 型エクスポート
export type CreateEventFormData = z.infer<typeof createEventFormSchema>;
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventFormSchema>;
export type UpdateEventData = z.infer<typeof updateEventSchema>;
