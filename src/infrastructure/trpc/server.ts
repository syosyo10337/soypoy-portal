import "server-only";

import { adminService, closedDayService, eventService } from "@/services";
import { createContext } from "./context";
import { appRouter } from "./router";

/**
 * Server Component (RSC) 用の tRPC Caller（認証あり）
 *
 * headers() を使用するため、このcallerを使うルートは dynamic になる。
 * Admin ページなど認証が必要な場合に使用する。
 */
export const createServerCaller = async () => {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
};

/**
 * Server Component (RSC) 用の tRPC Caller（認証なし・public用）
 *
 * headers() を使用しないため、static/ISR レンダリングが可能。
 * 公開ページで publicProcedure のみ呼び出す場合に使用する。
 */
export const createPublicServerCaller = async () => {
  return appRouter.createCaller({
    session: null,
    eventService,
    closedDayService,
    adminService,
  });
};
