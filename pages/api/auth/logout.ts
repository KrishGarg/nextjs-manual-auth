import { ApiData } from "@/lib/constants";
import {
  deleteAccessAndRefreshTokenCookies,
  getTokensFromCookies,
} from "@/lib/cookies";
import type { NextApiHandler } from "next";
import { StatusCodes } from "http-status-codes";
import { handleErr, handleServerErr, methodNotAllowed } from "@/lib/helpers";
import { logout } from "@/lib/auth";

const handler: NextApiHandler<ApiData> = async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  try {
    const { refreshToken } = getTokensFromCookies(req);

    if (!refreshToken) {
      return handleErr({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "User isn't logged in",
      });
    }

    try {
      await logout(refreshToken);
    } catch (e) {
      return handleErr({
        res,
        e,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Invalid Token",
      });
    }

    deleteAccessAndRefreshTokenCookies(res);
    return res.status(StatusCodes.OK).json({
      message: "Successfully logged out",
      error: false,
    });
  } catch (e) {
    return handleServerErr(res, e);
  }
};

export default handler;
