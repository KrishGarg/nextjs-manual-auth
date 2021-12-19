import { genSalt, hash, compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { createTokens, Tokens } from "@/lib/tokens";

const prisma = new PrismaClient();

type LoginType = (email: string, password: string) => Promise<Tokens>;

const login: LoginType = async (email, password) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("No user with the given email exists.");
  }

  if (!(await compare(password, user.password))) {
    throw new Error("Incorrect password.");
  }

  const tokens = createTokens({
    id: user.id,
    email: user.email,
  });

  return tokens;
};

type SignupType = (email: string, password: string) => Promise<Tokens>;

const signup: SignupType = async (email, password) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user) {
    throw new Error("User with the given email already exists.");
  }

  const passwordHash = await hash(password, await genSalt());

  const newUser = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  const tokens = createTokens({
    id: newUser.id,
    email: newUser.email,
  });

  return tokens;
};

export { login, signup };
