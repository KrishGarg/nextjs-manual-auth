import { CookieSerializeOptions } from "cookie";

const ACCESS_TOKEN_COOKIE_NAME = "access-token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";

// Below in seconds.
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

const COOKIE_PATH = "/api";

interface ApiData {
  message: string;
  error: boolean;
}

const DEFAULT_COOKIE_SERIALIZE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  path: COOKIE_PATH,
};

export {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  COOKIE_PATH,
  DEFAULT_COOKIE_SERIALIZE_OPTIONS,
};

export type { ApiData };
