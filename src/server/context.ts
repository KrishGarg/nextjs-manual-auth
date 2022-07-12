import { getUserIDFromReq } from "@/features/auth/backend/helpers";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const _default = {
    req,
    res,
  };

  const userId = getUserIDFromReq(req);
  return {
    ..._default,
    userId,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
