import { signup } from "@/lib/auth";
import { Tokens } from "@/lib/tokens";
import type { NextApiHandler } from "next";
import { setAccessAndRefreshTokenCookies } from "@/lib/easyCookie";

interface Data {
  message: string;
  error: boolean;
}

const handler: NextApiHandler<Data> = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(404).json({
        message: `${req.method} not allowed.`,
        error: true,
      });
    }

    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        message: `There was no ${
          !email && !password
            ? "email and password"
            : email && !password
            ? "password"
            : "email"
        } in the request.`,
        error: true,
      });
    }

    let tokens: Tokens;

    try {
      tokens = await signup(email, password);
    } catch (e) {
      let message = "Account Already Exists";
      if (e instanceof Error) {
        message = e.message;
      }

      return res.status(403).json({
        message,
        error: true,
      });
    }

    const { accessToken, refreshToken } = tokens;
    setAccessAndRefreshTokenCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Signup Successful",
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
