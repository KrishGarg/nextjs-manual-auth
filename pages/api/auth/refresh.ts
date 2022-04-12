import type { NextApiHandler } from "next";
import { ApiData } from "@/lib/constants";
import { StatusCodes } from "http-status-codes";
import { refreshTokens } from "@/lib/auth";
import {
  getTokensFromCookies,
  setAccessAndRefreshTokenCookies,
} from "@/lib/cookies";
import { getClientIp } from "request-ip";
import { handleErr, handleServerErr, methodNotAllowed } from "@/lib/helpers";

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
        message: "The refresh token is missing.",
      });
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await refreshTokens(
          refreshToken,
          getClientIp(req),
          req.headers["user-agent"]
        );
      setAccessAndRefreshTokenCookies(res, accessToken, newRefreshToken);
    } catch (e) {
      return handleErr({
        res,
        e,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Invalid Token",
      });
    }

    return res.status(StatusCodes.OK).json({
      error: false,
      message: "Tokens successfully refreshed",
    });
  } catch (e) {
    return handleServerErr(res, e);
  }
};

export default handler;
