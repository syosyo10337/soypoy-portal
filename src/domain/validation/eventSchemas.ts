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

// === 構造化フィールド用スキーマ ===

/**
 * 料金区分スキーマ
 */
export const pricingTierSchema = z.object({
  label: z.string().min(1, { message: "料金名を入力してください" }),
  amount: z.coerce
    .number({ message: "金額を入力してください" })
    .min(0, { message: "金額は0以上を入力してください" }),
  note: z.string().optional(),
});

/**
 * 会場スキーマ
 */
export const venueSchema = z
  .object({
    type: z.enum(["preset", "custom"]),
    presetId: z.string().optional(),
    customName: z.string().optional(),
    instagramHandle: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "preset") {
        return !!data.presetId;
      }
      if (data.type === "custom") {
        return !!data.customName;
      }
      return false;
    },
    {
      message: "会場を選択または入力してください",
    },
  );

/**
 * 出演者スキーマ
 */
export const performerSchema = z.object({
  name: z.string().min(1, { message: "出演者名を入力してください" }),
  role: z.string().optional(),
  instagramHandle: z.string().optional(),
});

/**
 * ハッシュタグスキーマ
 */
export const hashtagSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[^\s#]+$/, { message: "#とスペースは使用できません" });

/**
 * 構造化フィールドスキーマ
 */
export const structuredFieldsSchema = z.object({
  openTime: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  pricing: z.array(pricingTierSchema).optional().nullable(),
  venue: venueSchema.optional().nullable(),
  performers: z.array(performerSchema).optional().nullable(),
  hashtags: z.array(hashtagSchema).max(30).optional().nullable(),
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
  .merge(structuredFieldsSchema)
  .extend({
    thumbnail: z.union([imageFileSchema, z.url()]).optional().nullable(),
  });

export const createEventSchema = createEventFormSchema.extend({
  thumbnail: z.url().optional().nullable(),
});

// NOTE: react-hook-formのnullable対応のため、optionalとnullableを両方指定
export const updateEventFormSchema = baseSchema
  .merge(structuredFieldsSchema)
  .extend({
    publicationStatus: z.enum(publicationStatusValues),
    thumbnail: z.union([imageFileSchema, z.url()]).optional().nullable(),
  });

// NOTE: react-hook-formのnullable対応のため、optionalとnullableを両方指定
export const updateEventSchema = baseSchema.merge(structuredFieldsSchema).extend({
  publicationStatus: z.enum(publicationStatusValues),
  thumbnail: z.url().optional().nullable(),
});

// 型エクスポート
export type CreateEventFormData = z.infer<typeof createEventFormSchema>;
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventFormSchema>;
export type UpdateEventData = z.infer<typeof updateEventSchema>;
