import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";

import { findUserById } from "@/lib/db";
import { ApiHandler } from "@/lib/constants";
import {
  getUserIDFromReq,
  handleErr,
  handleServerErr,
  methodNotAllowed,
} from "@/lib/helpers";

interface Res {
  user?: Omit<User, "password">;
}

const handler: ApiHandler<Res> = async (req, res) => {
  if (req.method !== "GET") {
    return methodNotAllowed(res);
  }

  try {
    const id = getUserIDFromReq(req);

    if (!id) {
      return handleErr({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const user = await findUserById(id);

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
  } catch (e) {
    return handleServerErr(res, e);
  }
};

export default handler;
