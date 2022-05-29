import { StatusCodes } from "http-status-codes";
import { getClientIp } from "request-ip";

import { signup } from "@/lib/auth/backend/auth";
import { Tokens } from "@/lib/auth/backend/tokens";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth/backend/constants";
import {
  createHandler,
  getAccessTokenFromRequest,
  handleErr,
} from "@/authhelpers";

import { SignupRequestBody, SignupResponseBody } from "@/types/endpoint";
import { Req, Res } from "@/types/general";

const handler = createHandler();
handler.post(
  async (req: Req<SignupRequestBody>, res: Res<SignupResponseBody>) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleErr({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "The email or/and password is/are missing.",
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
      tokens = await signup(
        email,
        password,
        req.headers["user-agent"],
        getClientIp(req)
      );
    } catch (e) {
      return handleErr({
        res,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Account Already Exists",
      });
    }

    const { accessToken, refreshToken } = tokens;

    return res.status(StatusCodes.OK).json({
      message: "Signup Successful",
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
