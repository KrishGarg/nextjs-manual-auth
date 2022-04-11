import { genSalt, hash, compare } from "bcrypt";
import { createTokens, Tokens } from "@/lib/tokens";
import { createUser, findUserByEmail } from "@/lib/db";

type LoginType = (
  email: string,
  password: string,
  userAgent: string | undefined
) => Promise<Tokens>;

const login: LoginType = async (email, password, userAgent) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("No user with the given email exists.");
  }

  if (!(await compare(password, user.password))) {
    throw new Error("Incorrect password.");
  }

  const tokens = createTokens({
    id: user.id,
  });

  if (!userAgent) userAgent = "Unknown";

  return tokens;
};

type SignupType = (email: string, password: string) => Promise<Tokens>;

const signup: SignupType = async (email, password) => {
  const user = await findUserByEmail(email);

  if (user) {
    throw new Error("User with the given email already exists.");
  }

  const passwordHash = await hash(password, await genSalt());

  const newUser = await createUser(email, passwordHash);

  const tokens = createTokens({
    id: newUser.id,
  });

  return tokens;
};

export { login, signup };
