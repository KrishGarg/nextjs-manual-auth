import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";

import { findUserById } from "@/lib/db";
import { authNeeded, createHandler, handleErr } from "@/lib/helpers";
import { Res } from "@/lib/constants";

interface Resp {
  user?: Omit<User, "password">;
}

const handler = createHandler();
handler.get(authNeeded, async (req, res: Res<Resp>) => {
  const user = await findUserById(req.userId, true);

  if (!user) {
    return handleErr({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: "User not found",
    });
  }

  const userToSend = (({ password, ...o }: User) => o)(user); // remove password

  return res.status(StatusCodes.OK).json({
    user: userToSend,
    message: "User successfully found",
    error: false,
  });
});

export default handler;
