import * as trpc from "@trpc/server";
import { z } from "zod";
import { getClientIp } from "request-ip";

import { createRouter } from "../createRouter";
import { login, logout, refreshTokens, signup } from "@/lib/auth/backend/auth";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth/backend/constants";

const auth = createRouter()
  .mutation("login", {
    input: z.object({
      email: z.string().email(),
      password: z.string().min(4),
    }),
    async resolve({ input, ctx }) {
      const { email, password } = input;

      if (ctx.userId) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "You are already logged in",
        });
      }

      const { accessToken, refreshToken } = await login(
        email,
        password,
        ctx.req.headers["user-agent"],
        getClientIp(ctx.req)
      );

      return {
        tokens: {
          access: {
            token: accessToken,
            expiresInSeconds: ACCESS_TOKEN_MAX_AGE,
          },
          refresh: {
            token: refreshToken,
            expiresInSeconds: REFRESH_TOKEN_MAX_AGE,
          },
        },
      };
    },
  })

  .mutation("signup", {
    input: z.object({
      email: z.string().email(),
      password: z.string().min(4),
    }),
    async resolve({ input, ctx }) {
      const { email, password } = input;

      if (ctx.userId) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "You are already logged in",
        });
      }

      const { accessToken, refreshToken } = await signup(
        email,
        password,
        ctx.req.headers["user-agent"],
        getClientIp(ctx.req)
      );

      return {
        tokens: {
          access: {
            token: accessToken,
            expiresInSeconds: ACCESS_TOKEN_MAX_AGE,
          },
          refresh: {
            token: refreshToken,
            expiresInSeconds: REFRESH_TOKEN_MAX_AGE,
          },
        },
      };
    },
  })

  .mutation("logout", {
    input: z.object({
      refreshToken: z.string(),
    }),
    async resolve({ input }) {
      const { refreshToken } = input;

      await logout(refreshToken);
      return {};
    },
  })

  .mutation("refresh", {
    input: z.object({
      refreshToken: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { refreshToken } = input;

      const { accessToken, refreshToken: newRefreshToken } =
        await refreshTokens(
          refreshToken,
          getClientIp(ctx.req),
          ctx.req.headers["user-agent"]
        );

      return {
        tokens: {
          access: {
            token: accessToken,
            expiresInSeconds: ACCESS_TOKEN_MAX_AGE,
          },
          refresh: {
            token: newRefreshToken,
            expiresInSeconds: REFRESH_TOKEN_MAX_AGE,
          },
        },
      };
    },
  });

export default auth;