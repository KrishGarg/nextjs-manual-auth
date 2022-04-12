import type { NextApiHandler } from "next";
import { decodeAccessTokenOrUndef } from "@/lib/tokens";
import { findUserById } from "@/lib/db";
import { getTokensFromCookies } from "@/lib/easyCookie";
import { ApiData } from "@/lib/constants";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";

interface Data extends ApiData {
  user?: Omit<User, "password">;
}

const handler: NextApiHandler<Data> = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      message: ReasonPhrases.METHOD_NOT_ALLOWED,
      error: true,
    });
  }

  try {
    const { accessToken } = getTokensFromCookies(req);

    if (!accessToken) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "The access token is missing.",
        error: true,
      });
    }

    const payload = decodeAccessTokenOrUndef(accessToken);

    if (!payload) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Invalid Token",
        error: true,
      });
    }

    const user = await findUserById(payload.userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No user with the ID given exists.",
        error: true,
      });
    }

    const userToSend = (({ password, ...o }: User) => o)(user); // remove password

    return res.status(StatusCodes.OK).json({
      user: userToSend,
      message: "User successfully found",
      error: false,
    });
  } catch (e) {
    let message: string;

    if (typeof e === "string") {
      message = e;
    } else if (e instanceof Error) {
      message = e.message;
    } else {
      message = "Unknown Error";
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message,
      error: true,
    });
  }
};

export default handler;
