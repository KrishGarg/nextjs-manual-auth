import { JwtPayload, sign, verify } from "jsonwebtoken";
import * as trpc from "@trpc/server";

import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "@/features/auth/backend/constants";

interface Payload extends JwtPayload {
  userId: string;
  tokenId?: string;
}

type CreateAccessTokenType = (data: Payload) => string;

const createAccessToken: CreateAccessTokenType = (data) => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new trpc.TRPCError({
      message: "No access token secret found.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  return sign(data, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_MAX_AGE,
  });
};

type CreateRefreshTokenType = (data: Payload, tokenId: string) => string;

const createRefreshToken: CreateRefreshTokenType = (data, tokenId) => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new trpc.TRPCError({
      message: "No refresh token secret found.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const refreshToken = sign(
    { ...data, tokenId } as Payload,
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_MAX_AGE,
    }
  );

  return refreshToken;
};

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

type CreateTokensType = (data: Payload, tokenId: string) => Tokens;

const createTokens: CreateTokensType = (data, tokenId) => {
  return {
    accessToken: createAccessToken(data),
    refreshToken: createRefreshToken(data, tokenId),
  };
};

type DecodeTokenType = (token: string, type: "access" | "refresh") => Payload;

const decodeToken: DecodeTokenType = (token, type) => {
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new trpc.TRPCError({
      message: "No access or refresh token secret found.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

  return verify(token, secret) as Payload;
};

export { createAccessToken, createRefreshToken, createTokens, decodeToken };
export type { Tokens, Payload };
