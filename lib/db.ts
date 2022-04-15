import { PrismaClient } from "@prisma/client";
import { REFRESH_TOKEN_MAX_AGE } from "./constants";

const prisma = new PrismaClient();

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

const findUserById = async (id: string, tokens: boolean = false) =>
  await prisma.user.findUnique({
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

// mongodb should ignore the trial of recreation of index with same name
prisma.$runCommandRaw({
  createIndexes: "Token",
  indexes: [
    {
      key: {
        createdAt: 1,
      },
      name: "Token_createdAt_ttl_index",
      expireAfterSeconds: REFRESH_TOKEN_MAX_AGE,
    },
  ],
});

export {
  findUserByEmail,
  createUser,
  findUserById,
  addTokenSession,
  findTokenByID,
  deleteTokenByID,
};
