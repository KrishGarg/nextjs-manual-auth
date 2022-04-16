import { CookieSerializeOptions } from "cookie";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Middleware } from "next-connect";

export const ACCESS_TOKEN_COOKIE_NAME = "access-token";
export const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";

// Below in seconds.
export const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export const COOKIE_PATH = "/api";

export const DEFAULT_COOKIE_SERIALIZE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  path: COOKIE_PATH,
};

export interface ApiData {
  message: string;
  error: boolean;
}

export interface Req<Body = {}> extends NextApiRequest {
  userId: string;
  body: Body;
}
export interface Res<Response = {}>
  extends NextApiResponse<ApiData & Response> {}

export type MW = Middleware<Req, NextApiResponse<ApiData>>;

export const TOKEN_CREATED_AT_INDEX_NAME = "Token_createdAt_ttl_index";

// env vars
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
