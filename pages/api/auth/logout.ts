import { StatusCodes } from "http-status-codes";

import {
  createHandler,
  getRefreshTokenFromRequest,
  handleErr,
} from "@/lib/helpers";
import { logout } from "@/lib/auth";
import { Req, Res } from "@/lib/constants";
import { LogoutRequestBody, LogoutResponseBody } from "@/lib/sharedTypes";

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
