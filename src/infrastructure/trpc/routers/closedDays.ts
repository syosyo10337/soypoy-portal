import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ClosedDayConflictError } from "@/services/errors/closedDayConflictError";
import { adminProcedure, publicProcedure, router } from "../context";
import { syncMonthSchema } from "../schemas/closedDay";

/**
 * 休業日操作ルーター
 */
export const closedDaysRouter = router({
  listByMonth: publicProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.closedDayService.getClosedDaysByMonth(
        input.year,
        input.month,
      );
    }),

  syncMonth: adminProcedure
    .input(syncMonthSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.closedDayService.syncMonth(
          input.year,
          input.month,
          input.dates,
        );
      } catch (error) {
        if (error instanceof ClosedDayConflictError) {
          throw new TRPCError({
            code: "CONFLICT",
            message: error.message,
          });
        }
        throw error;
      }
    }),
});
