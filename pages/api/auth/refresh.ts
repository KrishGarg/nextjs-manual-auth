import { StatusCodes } from "http-status-codes";
import { getClientIp } from "request-ip";

import { refreshTokens } from "@/lib/auth/backend/auth";
import {
  createHandler,
  getRefreshTokenFromRequest,
  handleErr,
} from "@/authhelpers";
import { Tokens } from "@/lib/auth/backend/tokens";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  Req,
  Res,
} from "@/lib/auth/backend/constants";
import {
  RefreshRequestBody,
  RefreshResponseBody,
} from "@/lib/auth/sharedTypes";

const handler = createHandler();
handler.post(
  async (req: Req<RefreshRequestBody>, res: Res<RefreshResponseBody>) => {
    const refreshToken = getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      return handleErr({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "The refresh token is missing.",
      });
    }

    let tokens: Tokens;

    try {
      tokens = await refreshTokens(
        refreshToken,
        getClientIp(req),
        req.headers["user-agent"]
      );
    } catch (e) {
      return handleErr({
        res,
        e,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Invalid Token",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = tokens;

    return res.status(StatusCodes.OK).json({
      error: false,
      message: "Tokens successfully refreshed",
      tokens: {
        access: {
          token: accessToken,
          expiresInSeconds: ACCESS_TOKEN_MAX_AGE,
        },
        refresh: {
          token: newRefreshToken,
          expiresInSeconds: REFRESH_TOKEN_MAX_AGE,
        },
      },
    });
  }
);

export default handler;
