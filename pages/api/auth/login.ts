import type { NextApiHandler, NextApiRequest } from "next";
import { StatusCodes } from "http-status-codes";
import { getClientIp } from "request-ip";

import { login } from "@/lib/auth";
import { Tokens } from "@/lib/tokens";
import {
  getTokensFromCookies,
  setAccessAndRefreshTokenCookies,
} from "@/lib/cookies";
import { ApiData } from "@/lib/constants";
import { handleErr, handleServerErr, methodNotAllowed } from "@/lib/helpers";

interface WithBodyReq extends NextApiRequest {
  body: {
    email?: string;
    password?: string;
  };
}

const handler: NextApiHandler<ApiData> = async (req: WithBodyReq, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  try {
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

    const { accessToken: accessTokenFromCookie } = getTokensFromCookies(req);

    if (accessTokenFromCookie) {
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
    setAccessAndRefreshTokenCookies(res, accessToken, refreshToken);

    return res.status(StatusCodes.OK).json({
      message: "Login Successful",
      error: false,
    });
  } catch (e) {
    return handleServerErr(res, e);
  }
};

export default handler;
