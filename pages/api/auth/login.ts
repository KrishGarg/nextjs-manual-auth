import { StatusCodes } from "http-status-codes";
import { getClientIp } from "request-ip";

import { login } from "@/lib/auth/backend/auth";
import { Tokens } from "@/lib/auth/backend/tokens";
import {
  createHandler,
  handleErr,
  getAccessTokenFromRequest,
} from "@/authhelpers";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth/backend/constants";

import { LoginRequestBody, LoginResponseBody } from "@/types/endpoint";
import { Req, Res } from "@/types/general";

const handler = createHandler();
handler.post(
  async (req: Req<LoginRequestBody>, res: Res<LoginResponseBody>) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleErr({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: `There was ${
          !email && !password
            ? "neither email nor password"
            : email && !password
            ? "no password"
            : "no email"
        } in the request.`,
      });
    }

    const accessTokenFromRequest = getAccessTokenFromRequest(req);

    if (accessTokenFromRequest) {
      return handleErr({
        res,
        statusCode: StatusCodes.NOT_ACCEPTABLE,
        message: "You are already logged in.",
      });
    }

    let tokens: Tokens;
    try {
      tokens = await login(
        email,
        password,
        req.headers["user-agent"],
        getClientIp(req)
      );
    } catch (e) {
      return handleErr({
        res,
        e,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Incorrect Credentials",
      });
    }

    const { accessToken, refreshToken } = tokens;

    return res.status(StatusCodes.OK).json({
      message: "Login Successful",
      error: false,
      tokens: {
        access: {
          token: accessToken,
          expiresInSeconds: ACCESS_TOKEN_MAX_AGE,
        },
        refresh: {
          token: refreshToken,
          expiresInSeconds: REFRESH_TOKEN_MAX_AGE,
        },
      },
    });
  }
);

export default handler;
