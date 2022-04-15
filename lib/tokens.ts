import { JwtPayload, sign, verify } from "jsonwebtoken";

import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "@/lib/constants";

interface Payload extends JwtPayload {
  userId: string;
  tokenId?: string;
}

type CreateAccessTokenType = (data: Payload) => string;

const createAccessToken: CreateAccessTokenType = (data) => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("No access token secret found.");
  }

  return sign(data, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_MAX_AGE,
  });
};

type CreateRefreshTokenType = (data: Payload, tokenId: string) => string;

const createRefreshToken: CreateRefreshTokenType = (data, tokenId) => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("No refresh token secret found.");
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
    throw new Error("No access or refresh token secret.");
  }

  const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

  return verify(token, secret) as Payload;
};

export { createAccessToken, createRefreshToken, createTokens, decodeToken };
export type { Tokens, Payload };
