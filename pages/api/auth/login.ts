import { login } from "@/lib/auth";
import { Tokens } from "@/lib/tokens";
import type { NextApiHandler } from "next";
import {
  getTokensFromCookies,
  setAccessAndRefreshTokenCookies,
} from "@/lib/easyCookie";
import { ApiData } from "@/lib/constants";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getClientIp } from "request-ip";

const handler: NextApiHandler<ApiData> = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        message: ReasonPhrases.METHOD_NOT_ALLOWED,
        error: true,
      });
    }

    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `There was ${
          !email && !password
            ? "neither email nor password"
            : email && !password
            ? "no password"
            : "no email"
        } in the request.`,
        error: true,
      });
    }

    const { accessToken: accessTokenFromCookie } = getTokensFromCookies(req);

    if (accessTokenFromCookie) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        message: "You are already logged in.",
        error: true,
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
      let message = "Incorrect Credentials";
      if (e instanceof Error) {
        message = e.message;
      }

      return res.status(StatusCodes.FORBIDDEN).json({
        message,
        error: true,
      });
    }

    const { accessToken, refreshToken } = tokens;
    setAccessAndRefreshTokenCookies(res, accessToken, refreshToken);

    return res.status(StatusCodes.OK).json({
      message: "Login Successful",
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
