import { findUserById } from "@/auth/backend/db";
import { createProtectedRouter } from "@/server/createRouter";
import { User } from "@prisma/client";

const router = createProtectedRouter().query("me", {
  async resolve({ ctx }) {
    const user = await findUserById(ctx.userId, true);
    const userToSend = (({ password, ...o }: User) => o)(user); // remove password
    return userToSend;
  },
});

export default router;
