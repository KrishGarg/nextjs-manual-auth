import { NextApiRequest, NextApiResponse } from "next";
import { Middleware } from "next-connect";

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
