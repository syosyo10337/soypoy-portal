import { DateTime } from "luxon";
import { z } from "zod";

const dateString = z.iso.date().refine((val) => {
  return DateTime.fromISO(val).isValid;
}, "有効な日付を指定してください");

export const syncMonthSchema = z
  .object({
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12),
    dates: z.array(dateString),
  })
  .superRefine((data, ctx) => {
    for (const [i, d] of data.dates.entries()) {
      const dt = DateTime.fromISO(d);
      if (dt.year !== data.year || dt.month !== data.month) {
        ctx.addIssue({
          code: "custom",
          path: ["dates", i],
          message: `${d} は ${data.year}年${data.month}月に属しません`,
        });
      }
    }
  });
