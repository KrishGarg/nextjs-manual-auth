import { serialize, CookieSerializeOptions } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  DEFAULT_COOKIE_SERIALIZE_OPTIONS,
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

const setCookies: SetCookiesType = ({ res, cookies }) => {
  res.setHeader(
    "Set-Cookie",
    cookies.map(
      ({
        name,
        value,
        cookieSerializeOptions = DEFAULT_COOKIE_SERIALIZE_OPTIONS,
      }) => serialize(name, value, cookieSerializeOptions)
    )
  );
};

type SetAccessAndRefreshTokenCookiesType = (
  res: NextApiResponse,
  accessToken: string,
  refreshToken: string
) => void;

const setAccessAndRefreshTokenCookies: SetAccessAndRefreshTokenCookiesType = (
  res,
  accessToken,
  refreshToken
) => {
  setCookies({
    res,
    cookies: [
      {
        name: ACCESS_TOKEN_COOKIE_NAME,
        value: accessToken,
        cookieSerializeOptions: {
          ...DEFAULT_COOKIE_SERIALIZE_OPTIONS,
          maxAge: ACCESS_TOKEN_MAX_AGE,
        },
      },
      {
        name: REFRESH_TOKEN_COOKIE_NAME,
        value: refreshToken,
        cookieSerializeOptions: {
          ...DEFAULT_COOKIE_SERIALIZE_OPTIONS,
          maxAge: REFRESH_TOKEN_MAX_AGE,
        },
      },
    ],
  });
};

type DeleteAccessAndRefreshTokenCookiesType = (res: NextApiResponse) => void;

const deleteAccessAndRefreshTokenCookies: DeleteAccessAndRefreshTokenCookiesType =
  (res) => {
    setCookies({
      res,
      cookies: [
        {
          name: ACCESS_TOKEN_COOKIE_NAME,
          value: "",
          cookieSerializeOptions: {
            ...DEFAULT_COOKIE_SERIALIZE_OPTIONS,
            expires: new Date(1),
          },
        },
        {
          name: REFRESH_TOKEN_COOKIE_NAME,
          value: "",
          cookieSerializeOptions: {
            ...DEFAULT_COOKIE_SERIALIZE_OPTIONS,
            expires: new Date(1),
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

const getTokensFromCookies: GetTokensFromCookiesType = (req) => {
  return {
    accessToken: req.cookies[ACCESS_TOKEN_COOKIE_NAME] ?? undefined,
    refreshToken: req.cookies[REFRESH_TOKEN_COOKIE_NAME] ?? undefined,
  };
};

export {
  setAccessAndRefreshTokenCookies,
  deleteAccessAndRefreshTokenCookies,
  getTokensFromCookies,
  setCookies,
};
