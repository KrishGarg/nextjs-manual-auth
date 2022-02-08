import { serialize, CookieSerializeOptions } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/constants";

interface SetCookiesParams {
  res: NextApiResponse;
  cookies: {
    name: string;
    value: string;
    cookieSerializeOptions?: CookieSerializeOptions;
  }[];
}

type SetCookiesType = (options: SetCookiesParams) => void;

export const setCookies: SetCookiesType = ({ res, cookies }) => {
  res.setHeader(
    "Set-Cookie",
    cookies.map(
      ({
        name,
        value,
        cookieSerializeOptions = { httpOnly: true, secure: true },
      }) => serialize(name, value, cookieSerializeOptions)
    )
  );
};

type SetAccessTokenCookiesType = (
  res: NextApiResponse,
  accessToken: string
) => void;

export const setAccessTokenCookie: SetAccessTokenCookiesType = (
  res,
  accessToken
) => {
  setCookies({
    res,
    cookies: [
      {
        name: ACCESS_TOKEN_COOKIE_NAME,
        value: accessToken,
        cookieSerializeOptions: {
          maxAge: ACCESS_TOKEN_MAX_AGE,
          httpOnly: true,
          secure: true,
        },
      },
    ],
  });
};

type SetAccessAndRefreshTokenCookiesType = (
  res: NextApiResponse,
  accessToken: string,
  refreshToken: string
) => void;

export const setAccessAndRefreshTokenCookies: SetAccessAndRefreshTokenCookiesType =
  (res, accessToken, refreshToken) => {
    setCookies({
      res,
      cookies: [
        {
          name: ACCESS_TOKEN_COOKIE_NAME,
          value: accessToken,
          cookieSerializeOptions: {
            maxAge: ACCESS_TOKEN_MAX_AGE,
            httpOnly: true,
            secure: true,
          },
        },
        {
          name: REFRESH_TOKEN_COOKIE_NAME,
          value: refreshToken,
          cookieSerializeOptions: {
            maxAge: REFRESH_TOKEN_MAX_AGE,
            httpOnly: true,
            secure: true,
          },
        },
      ],
    });
  };

type DeleteAccessAndRefreshTokenCookiesType = (res: NextApiResponse) => void;

export const deleteAccessAndRefreshTokenCookies: DeleteAccessAndRefreshTokenCookiesType =
  (res) => {
    setCookies({
      res,
      cookies: [
        {
          name: ACCESS_TOKEN_COOKIE_NAME,
          value: "",
          cookieSerializeOptions: {
            expires: new Date(1),
            httpOnly: true,
            secure: true,
          },
        },
        {
          name: REFRESH_TOKEN_COOKIE_NAME,
          value: "",
          cookieSerializeOptions: {
            expires: new Date(1),
            httpOnly: true,
            secure: true,
          },
        },
      ],
    });
  };

interface NullibleTokens {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

type GetTokensFromCookiesType = (req: NextApiRequest) => NullibleTokens;

export const getTokensFromCookies: GetTokensFromCookiesType = (req) => {
  return {
    accessToken: req.cookies[ACCESS_TOKEN_COOKIE_NAME] ?? undefined,
    refreshToken: req.cookies[REFRESH_TOKEN_COOKIE_NAME] ?? undefined,
  };
};
