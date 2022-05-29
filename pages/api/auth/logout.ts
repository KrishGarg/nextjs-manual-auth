import { StatusCodes } from "http-status-codes";

import {
  createHandler,
  getRefreshTokenFromRequest,
  handleErr,
} from "@/authhelpers";
import { logout } from "@/lib/auth/backend/auth";

import { Req, Res } from "@/types/general";
import { LogoutRequestBody, LogoutResponseBody } from "@/types/endpoint";

const handler = createHandler();
handler.post(
  async (req: Req<LogoutRequestBody>, res: Res<LogoutResponseBody>) => {
    const refreshToken = getRefreshTokenFromRequest(req);

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

    return res.status(StatusCodes.OK).json({
      message: "Successfully logged out",
      error: false,
    });
  }
);

export default handler;
