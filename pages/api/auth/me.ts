import type { NextApiHandler } from "next";
import { decodeToken } from "@/lib/tokens";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Data {
  user?: {
    id: string;
    email: string; // Can attach more user details like avatar and username too.
  };
  message: string;
  error: boolean;
}

const handler: NextApiHandler<Data> = async (req, res) => {
  try {
    if (req.cookies["access-token"]) {
      const payload = decodeToken(req.cookies["access-token"], "access");

      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

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
    } else {
      return res.status(403).json({
        message: "The access token is missing.",
        error: true,
      });
    }
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
