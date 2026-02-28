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

/** HH:mm 形式の時刻文字列（必須） */
const timeStringSchema = z.iso.time({
  precision: -1,
  message: "時間を選択してください",
});

/** 料金区分 */
export const pricingTierSchema = z.object({
  label: z.string().min(1, "ラベルを入力してください"),
  amount: z.number().min(0, "0以上の金額を入力してください"),
  note: z.string().optional(),
});

/** 出演者 */
export const performerSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  role: z.string().optional(),
  instagramHandle: z.string().optional(),
});

/** 構造化フィールド（時間・料金・出演者・ハッシュタグ） */
const structuredFieldsSchema = z.object({
  openTime: timeStringSchema,
  startTime: timeStringSchema,
  pricing: z.array(pricingTierSchema).optional().nullable(),
  performers: z.array(performerSchema).optional().nullable(),
  hashtags: z.array(z.string()).optional().nullable(),
});

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

export const createEventFormSchema = baseSchema
  .extend({
    thumbnail: z.union([imageFileSchema, z.url()]).optional().nullable(),
    isPickup: z.boolean().optional(),
  })
  .merge(structuredFieldsSchema);

export const createEventSchema = baseSchema
  .extend({
    thumbnail: z.url().optional().nullable(),
    isPickup: z.boolean().default(false),
  })
  .merge(structuredFieldsSchema);

// NOTE: react-hook-formのnullable対応のため、optionalとnullableを両方指定
export const updateEventFormSchema = baseSchema
  .extend({
    publicationStatus: z.enum(publicationStatusValues),
    thumbnail: z.union([imageFileSchema, z.url()]).optional().nullable(),
    isPickup: z.boolean().optional(),
  })
  .merge(structuredFieldsSchema);

// NOTE: react-hook-formのnullable対応のため、optionalとnullableを両方指定
export const updateEventSchema = baseSchema
  .extend({
    publicationStatus: z.enum(publicationStatusValues),
    thumbnail: z.url().optional().nullable(),
    isPickup: z.boolean().default(false),
  })
  .merge(structuredFieldsSchema);

// 型エクスポート
export type CreateEventFormData = z.infer<typeof createEventFormSchema>;
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventFormSchema>;
export type UpdateEventData = z.infer<typeof updateEventSchema>;
