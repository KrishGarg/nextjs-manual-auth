import { serialize, CookieSerializeOptions } from "cookie";
import type { NextApiResponse } from "next";

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
