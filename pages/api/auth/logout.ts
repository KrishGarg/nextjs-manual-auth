import { ApiData } from "@/lib/constants";
import {
  deleteAccessAndRefreshTokenCookies,
  getTokensFromCookies,
} from "@/lib/easyCookie";
import type { NextApiHandler } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { decodeToken } from "@/lib/tokens";
import { findUserById, overrideTokens } from "@/lib/db";

const handler: NextApiHandler<ApiData> = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        message: ReasonPhrases.METHOD_NOT_ALLOWED,
        error: true,
      });
    }

    const { refreshToken } = getTokensFromCookies(req);

    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User isn't logged in",
        error: true,
      });
    }

    try {
      const { userId, tokenId } = decodeToken(refreshToken, "refresh");
      if (userId && tokenId) {
        const user = await findUserById(userId);
        if (user) {
          const otherTokens = user.tokens.filter((t) => t.tokenId !== tokenId);
          await overrideTokens(userId, otherTokens);
        }
      }
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

    deleteAccessAndRefreshTokenCookies(res);
    return res.status(StatusCodes.OK).json({
      message: "Successfully logged out",
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
