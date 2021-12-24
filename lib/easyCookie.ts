import { serialize, CookieSerializeOptions } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { Tokens } from "./tokens";

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
        name: "access-token",
        value: accessToken,
        cookieSerializeOptions: {
          maxAge: 60 * 15, // 15 minutes
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
          name: "access-token",
          value: accessToken,
          cookieSerializeOptions: {
            maxAge: 60 * 15, // 15 minutes
            httpOnly: true,
            secure: true,
          },
        },
        {
          name: "refresh-token",
          value: refreshToken,
          cookieSerializeOptions: {
            maxAge: 60 * 60 * 24 * 7, // 1 week
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
          name: "access-token",
          value: "",
          cookieSerializeOptions: {
            expires: new Date(1),
            httpOnly: true,
            secure: true,
          },
        },
        {
          name: "refresh-token",
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
    accessToken: req.cookies["access-token"] ?? undefined,
    refreshToken: req.cookies["refresh-token"] ?? undefined,
  };
};
