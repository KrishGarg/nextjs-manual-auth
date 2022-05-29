import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";

import { findUserById } from "@/lib/db";
import { authNeeded, createHandler, handleErr } from "@/authhelpers";

import { Req, Res } from "@/types/general";
import { MeRequestBody, MeResponseBody } from "@/types/endpoint";

const handler = createHandler();
handler.get(
  authNeeded,
  async (req: Req<MeRequestBody>, res: Res<MeResponseBody>) => {
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
  }
);

export default handler;
