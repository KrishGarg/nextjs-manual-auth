import type { NextApiHandler } from "next";
import { findUserById } from "@/lib/db";
import { ApiData } from "@/lib/constants";
import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";
import {
  getUserIDFromReq,
  handleErr,
  handleServerErr,
  methodNotAllowed,
} from "@/lib/helpers";

interface Data extends ApiData {
  user?: Omit<User, "password">;
}

const handler: NextApiHandler<Data> = async (req, res) => {
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
