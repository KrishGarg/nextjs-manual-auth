import { PrismaClient } from "@prisma/client";

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

export { findUserByEmail, createUser, findUserById };
