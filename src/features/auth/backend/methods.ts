import { hash, verify } from "argon2";
import * as trpc from "@trpc/server";

import {
  createUser,
  findUserByEmail,
  addTokenSession,
  findTokenByID,
  deleteTokenByID,
} from "src/features/auth/backend/db";
import {
  createTokens,
  decodeToken,
  Tokens,
} from "@/features/auth/backend/tokens";

type LoginType = (
  email: string,
  password: string,
  userAgent: string | undefined,
  ip: string | null
) => Promise<Tokens>;

const login: LoginType = async (email, password, userAgent, ip) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new trpc.TRPCError({
      message: "No user with the given email exists.",
      code: "FORBIDDEN",
    });
  }

  if (!(await verify(user.password, password))) {
    throw new trpc.TRPCError({
      message: "Incorrect password.",
      code: "FORBIDDEN",
    });
  }

  userAgent ??= "Unknown";
  ip ??= "Unknown";

  const tokenInfo = await addTokenSession(user.id, ip, userAgent);

  const { accessToken, refreshToken } = createTokens(
    {
      userId: user.id,
    },
    tokenInfo.id
  );

  return { accessToken, refreshToken };
};

type SignupType = (
  email: string,
  password: string,
  userAgent: string | undefined,
  ip: string | null
) => Promise<Tokens>;

const signup: SignupType = async (email, password, userAgent, ip) => {
  const user = await findUserByEmail(email);

  if (user) {
    throw new trpc.TRPCError({
      message: "User with the given email already exists.",
      code: "FORBIDDEN",
    });
  }

  const passwordHash = await hash(password);

  const newUser = await createUser(email, passwordHash);

  userAgent ??= "Unknown";
  ip ??= "Unknown";

  const tokenInfo = await addTokenSession(newUser.id, ip, userAgent);

  const { accessToken, refreshToken } = createTokens(
    {
      userId: newUser.id,
    },
    tokenInfo.id
  );

  return { accessToken, refreshToken };
};

type RefreshTokensType = (
  oldRefreshToken: string,
  ip: string | null,
  userAgent: string | undefined
) => Promise<Tokens>;

const refreshTokens: RefreshTokensType = async (
  oldRefreshToken,
  ip,
  userAgent
) => {
  const { userId, tokenId } = decodeToken(oldRefreshToken, "refresh");

  if (!tokenId) {
    throw new trpc.TRPCError({
      message: "Invalid refresh token.",
      code: "FORBIDDEN",
    });
  }

  const token = await findTokenByID(tokenId);

  if (!token) {
    throw new trpc.TRPCError({
      message: "Invalid refresh token.",
      code: "FORBIDDEN",
    });
  }

  if (token.userId !== userId) {
    throw new trpc.TRPCError({
      message: "Invalid refresh token.",
      code: "FORBIDDEN",
    });
  }

  userAgent ??= "Unknown";
  ip ??= "Unknown";

  // remove old token data
  await deleteTokenByID(token.id);

  // add new token data
  const newToken = await addTokenSession(userId, ip, userAgent);

  const { accessToken, refreshToken } = createTokens(
    {
      userId,
    },
    newToken.id
  );

  return { accessToken, refreshToken };
};

type LogoutType = (refreshToken: string) => Promise<void>;

const logout: LogoutType = async (refreshToken) => {
  const { userId, tokenId } = decodeToken(refreshToken, "refresh");
  if (userId && tokenId) {
    try {
      await deleteTokenByID(tokenId);
    } catch (e) {}
  }
};

export { login, signup, refreshTokens, logout };
