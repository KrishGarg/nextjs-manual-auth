import type { NextApiHandler } from "next";
import { decodeAccessTokenOrUndef } from "@/lib/tokens";
import { findUserById } from "@/lib/db";
import { getTokensFromCookies } from "@/lib/easyCookie";

interface Data {
  user?: {
    id: string;
    email: string; // Can attach more user details like avatar and username too.
  };
  message: string;
  error: boolean;
}

const handler: NextApiHandler<Data> = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(404).json({
      message: `${req.method} not allowed.`,
      error: true,
    });
  }

  try {
    const { accessToken } = getTokensFromCookies(req);

    if (!accessToken) {
      return res.status(403).json({
        message: "The access token is missing.",
        error: true,
      });
    }

    const payload = decodeAccessTokenOrUndef(accessToken);

    if (!payload) {
      return res.status(403).json({
        message: "Invalid Token",
        error: true,
      });
    }

    const user = await findUserById(payload.id);

    if (!user) {
      return res.status(404).json({
        message: "No user with the ID given exists.",
        error: true,
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
      },
      message: "User successfully found",
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

    return res.status(500).json({
      message,
      error: true,
    });
  }
};

export default handler;
