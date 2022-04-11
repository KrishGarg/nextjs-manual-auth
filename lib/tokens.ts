import { JwtPayload, sign, verify } from "jsonwebtoken";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "@/lib/constants";
import { nanoid } from "nanoid";

interface Payload extends JwtPayload {
  userId: string;
  tokenId?: string;
}

type CreateAccessTokenType = (data: Payload) => string;

const createAccessToken: CreateAccessTokenType = (data) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("No access token secret found.");
  }

  return sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_MAX_AGE,
  });
};

type CreateRefreshTokenType = (data: Payload) => {
  refreshToken: string;
  tokenId: string;
};

const createRefreshToken: CreateRefreshTokenType = (data) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("No refresh token secret found.");
  }

  const id = nanoid();

  const refreshToken = sign(
    { ...data, tokenId: id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_MAX_AGE,
    }
  );

  return {
    refreshToken,
    tokenId: id,
  };
};

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface TokensWithID extends Tokens {
  tokenId: string;
}

type CreateTokensType = (data: Payload) => TokensWithID;

const createTokens: CreateTokensType = (data) => {
  const { refreshToken, tokenId } = createRefreshToken(data);
  return {
    accessToken: createAccessToken(data),
    refreshToken,
    tokenId,
  };
};

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
