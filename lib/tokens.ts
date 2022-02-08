import { JwtPayload, sign, verify } from "jsonwebtoken";
import { NextApiResponse } from "next";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "@/lib/constants";

type CreateAccessTokenType = (data: object) => string;

const createAccessToken: CreateAccessTokenType = (data) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("No access token secret found.");
  }

  return sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_MAX_AGE,
  });
};

type CreateRefreshTokenType = (data: object) => string;

const createRefreshToken: CreateRefreshTokenType = (data) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("No refresh token secret found.");
  }

  return sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_MAX_AGE,
  });
};

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

type CreateTokensType = (data: object) => Tokens;

const createTokens: CreateTokensType = (data) => {
  return {
    accessToken: createAccessToken(data),
    refreshToken: createRefreshToken(data),
  };
};

interface Payload extends JwtPayload {
  id: string;
}

type DecodeTokenType = (token: string, type: "access" | "refresh") => Payload;

const decodeToken: DecodeTokenType = (token, type) => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("No access or refresh token.");
  }

  const secret =
    type === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  return verify(token, secret) as Payload;
};

const decodeAccessTokenOrUndef = (accessToken: string) => {
  try {
    return decodeToken(accessToken, "access");
  } catch (e) {
    return undefined;
  }
};

export {
  createAccessToken,
  createRefreshToken,
  createTokens,
  decodeToken,
  decodeAccessTokenOrUndef,
};
export type { Tokens, Payload };
