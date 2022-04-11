import { LoggedInClient, PrismaClient } from "@prisma/client";

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

const findUserById = async (id: string) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
  });

const addClientDataToUser = async (
  userId: string,
  ip: string,
  userAgent: string,
  tokenId: string
) =>
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tokens: {
        push: {
          client: userAgent,
          tokenId,
          ip,
        },
      },
    },
  });

const overrideTokens = async (userId: string, newTokens: LoggedInClient[]) =>
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tokens: {
        set: newTokens,
      },
    },
  });

export {
  findUserByEmail,
  createUser,
  findUserById,
  addClientDataToUser,
  overrideTokens,
};
