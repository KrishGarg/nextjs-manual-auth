import { genSalt, hash, compare } from "bcrypt";
import { createTokens, decodeToken, Tokens } from "@/lib/tokens";
import {
  addClientDataToUser,
  createUser,
  findUserByEmail,
  findUserById,
  overrideTokens,
} from "@/lib/db";
import { LoggedInClient } from "@prisma/client";

type LoginType = (
  email: string,
  password: string,
  userAgent: string | undefined,
  ip: string | null
) => Promise<Tokens>;

const login: LoginType = async (email, password, userAgent, ip) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("No user with the given email exists.");
  }

  if (!(await compare(password, user.password))) {
    throw new Error("Incorrect password.");
  }

  const { accessToken, refreshToken, tokenId } = createTokens({
    userId: user.id,
  });

  if (!userAgent) userAgent = "Unknown";
  if (!ip) ip = "Unknown";
  addClientDataToUser(user.id, ip, userAgent, tokenId);

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
    throw new Error("User with the given email already exists.");
  }

  const passwordHash = await hash(password, await genSalt());

  const newUser = await createUser(email, passwordHash);

  const { accessToken, refreshToken, tokenId } = createTokens({
    userId: newUser.id,
  });

  if (!userAgent) userAgent = "Unknown";
  if (!ip) ip = "Unknown";
  addClientDataToUser(newUser.id, ip, userAgent, tokenId);

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

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("No user with the given ID exists.");
  }

  if (!user.tokens.some((t) => t.tokenId === tokenId)) {
    throw new Error("Invalid refresh token.");
  }

  const {
    accessToken,
    refreshToken,
    tokenId: newTokenID,
  } = createTokens({
    userId,
    tokenId,
  });

  if (!userAgent) userAgent = "Unknown";
  if (!ip) ip = "Unknown";

  const otherTokens = user.tokens.filter((t) => t.tokenId !== tokenId);
  const newTokens = [
    ...otherTokens,
    { client: userAgent, tokenId: newTokenID, ip },
  ] as LoggedInClient[];

  await overrideTokens(userId, newTokens);

  return { accessToken, refreshToken };
};

export { login, signup, refreshTokens };
