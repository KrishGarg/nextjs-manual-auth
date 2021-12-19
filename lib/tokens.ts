import { sign, verify, JwtPayload } from "jsonwebtoken";

type CreateAccessTokenType = (data: object) => string;

const createAccessToken: CreateAccessTokenType = (data) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("No access token secret found.");
  }

  return sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

type CreateRefreshTokenType = (data: object) => string;

const createRefreshToken: CreateRefreshTokenType = (data) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("No refresh token secret found.");
  }

  return sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1 week" });
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

interface DecodeTokenParam {
  token: string;
  type: "access" | "refresh";
}

type DecodeTokenType = (data: DecodeTokenParam) => JwtPayload;

const decodeToken: DecodeTokenType = ({ token, type }) => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("No access or refresh token.");
  }

  const secret =
    type === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  return verify(token, secret) as JwtPayload;
};

export { createAccessToken, createRefreshToken, createTokens, decodeToken };
export type { Tokens };
