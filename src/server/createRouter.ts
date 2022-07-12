import * as trpc from "@trpc/server";
import { Context } from "./context";

export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter() {
  return createRouter().middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
      throw new trpc.TRPCError({
        code: "FORBIDDEN",
        message: "You are not logged in",
      });
    }

    return next({
      ctx: {
        ...ctx,
        userId: ctx.userId,
      },
    });
  });
}
