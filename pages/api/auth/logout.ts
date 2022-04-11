import {
  deleteAccessAndRefreshTokenCookies,
  getTokensFromCookies,
} from "@/lib/easyCookie";
import type { NextApiHandler } from "next";

interface Data {
  message: string;
  error: boolean;
}

const handler: NextApiHandler<Data> = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: `${req.method} not allowed.`,
      error: true,
    });
  }

  const { refreshToken } = getTokensFromCookies(req);

  if (!refreshToken) {
    return res.status(400).json({
      message: "User isn't logged in",
      error: true,
    });
  }

  deleteAccessAndRefreshTokenCookies(res);
  return res.status(200).json({
    message: "Successfully logged out",
    error: false,
  });
};

export default handler;
