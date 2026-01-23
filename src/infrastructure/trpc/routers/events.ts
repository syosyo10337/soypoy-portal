import { z } from "zod";
import { createEventSchema, updateEventSchema } from "@/domain/validation";
import { adminProcedure, publicProcedure, router } from "../context";

/**
 * イベント操作ルーター

 * ctx.eventService: コンテキストからService層を取得
 * input: フロントエンドから送られてくるデータ（Zodでバリデーション済み）
 */
export const eventsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.eventService.getAllEvents();
  }),
  listByMonth: publicProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.eventService.getEventsByMonth(input.year, input.month);
    }),
  getPublishedById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.eventService.getPublishedEventById(input);
    }),
  getById: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.eventService.getEventById(input);
    }),
  create: adminProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.eventService.createEvent(input);
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateEventSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.eventService.updateEvent(input.id, input.data);
    }),
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.eventService.deleteEvent(input);
  }),
});
