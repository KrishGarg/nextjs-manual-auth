import type { NextApiHandler } from "next";
import { ApiData } from "@/lib/constants";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { refreshTokens } from "@/lib/auth";
import {
  getTokensFromCookies,
  setAccessAndRefreshTokenCookies,
} from "@/lib/easyCookie";
import { getClientIp } from "request-ip";

const handler: NextApiHandler<ApiData> = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      message: ReasonPhrases.METHOD_NOT_ALLOWED,
      error: true,
    });
  }

  const { refreshToken } = getTokensFromCookies(req);
  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "The refresh token is missing.",
      error: true,
    });
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(
      refreshToken,
      getClientIp(req),
      req.headers["user-agent"]
    );
    setAccessAndRefreshTokenCookies(res, accessToken, newRefreshToken);
  } catch (e) {
    let message = "Invalid Token";
    if (e instanceof Error) {
      message = e.message;
    }
    return res.status(StatusCodes.FORBIDDEN).json({
      message,
      error: true,
    });
  }

  return res.status(StatusCodes.OK).json({
    error: false,
    message: "Tokens successfully refreshed",
  });
};

export default handler;
