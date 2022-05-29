import { StatusCodes } from "http-status-codes";
import { getClientIp } from "request-ip";

import { refreshTokens } from "@/lib/auth";
import {
  createHandler,
  getRefreshTokenFromRequest,
  handleErr,
} from "@/lib/helpers";
import { Tokens } from "@/lib/tokens";
import { Req, Res } from "@/lib/constants";
import { RefreshRequestBody, RefreshResponseBody } from "@/lib/sharedTypes";

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
      accessToken,
      refreshToken: newRefreshToken,
    });
  }
);

export default handler;
