import { StatusCodes } from "http-status-codes";

import {
  deleteAccessAndRefreshTokenCookies,
  getTokensFromCookies,
} from "@/lib/cookies";
import { createHandler, handleErr } from "@/lib/helpers";
import { logout } from "@/lib/auth";

const handler = createHandler();
handler.post(async (req, res) => {
  const { refreshToken } = getTokensFromCookies(req);

  if (!refreshToken) {
    return handleErr({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "User isn't logged in",
    });
  }

  // Setting the cookies anyways to prevent any issues.
  deleteAccessAndRefreshTokenCookies(res);

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
});

export default handler;
