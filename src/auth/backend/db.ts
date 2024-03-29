import { Token, User } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  REFRESH_TOKEN_MAX_AGE,
  TOKEN_CREATED_AT_INDEX_NAME,
} from "@/auth/backend/constants";

const findUserByEmail = async (email: string) =>
  await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

const createUser = async (email: string, hashedPassword: string) =>
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

type FindUserById = <B extends boolean = false>(
  id: string,
  tokens?: B
) => B extends true
  ? Promise<
      | User & {
          tokens: Token[];
        }
    >
  : Promise<User>;

const findUserById: FindUserById = async (
  id: string,
  tokens: boolean = false
) =>
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      tokens,
    },
  });

const addTokenSession = async (userId: string, ip: string, userAgent: string) =>
  await prisma.token.create({
    data: {
      client: userAgent,
      ip,
      userId,
    },
  });

const findTokenByID = async (id: string) =>
  await prisma.token.findUnique({
    where: {
      id,
    },
  });

const deleteTokenByID = async (id: string) =>
  await prisma.token.delete({
    where: {
      id,
    },
  });

const createIndexes = async () => {
  // mongodb should ignore the trial of recreation of index with same name
  await prisma.$runCommandRaw({
    createIndexes: "Token",
    indexes: [
      {
        key: {
          createdAt: 1,
        },
        name: TOKEN_CREATED_AT_INDEX_NAME,
        expireAfterSeconds: REFRESH_TOKEN_MAX_AGE,
      },
    ],
  });
};

const removeAllUserSessions = async (userId: string) =>
  await prisma.token.deleteMany({
    where: {
      userId,
    },
  });

// INFO: You can add more auth related db functions here

export {
  findUserByEmail,
  createUser,
  findUserById,
  addTokenSession,
  findTokenByID,
  deleteTokenByID,
  createIndexes,
  removeAllUserSessions,
};
