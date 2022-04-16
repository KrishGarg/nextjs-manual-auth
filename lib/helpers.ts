import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { ApiData, MW, Req, Res } from "@/lib/constants";
import { getTokensFromCookies } from "@/lib/cookies";
import { decodeToken, Payload } from "@/lib/tokens";

const getUserIDFromReq = (req: NextApiRequest): string | null => {
  const { accessToken } = getTokensFromCookies(req);
  if (!accessToken) {
    return null;
  }
  let payload: Payload;
  try {
    payload = decodeToken(accessToken, "access");
  } catch (e) {
    return null;
  }
  return payload.userId;
};

interface HandleErrOpt {
  res: NextApiResponse<ApiData>;
  statusCode: StatusCodes;
  message?: string;
  e?: unknown;
}

const handleErr = ({ res, statusCode, message, e }: HandleErrOpt) => {
  if (!e) {
    return res.status(statusCode).json({
      message: message ? message : getReasonPhrase(statusCode),
      error: true,
    });
  } else {
    let messageToSend;

    if (typeof e === "string") {
      messageToSend = e;
    } else if (e instanceof Error) {
      messageToSend = e.message;
    } else {
      if (message) {
        messageToSend = message;
      } else {
        messageToSend = getReasonPhrase(statusCode);
      }
    }

    return res.status(statusCode).json({
      message: messageToSend,
      error: true,
    });
  }
};

const handleServerErr = (res: NextApiResponse<ApiData>, e?: unknown) =>
  handleErr({
    res,
    e,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });

const methodNotAllowed = (res: NextApiResponse<ApiData>) =>
  handleErr({
    res,
    statusCode: StatusCodes.NOT_FOUND,
  });

const createHandler = () => {
  return nc<Req, Res>({
    onError: (err, _, res, next) => {
      handleServerErr(res as NextApiResponse, err);
      next();
    },
    onNoMatch: (_, res) => {
      methodNotAllowed(res as NextApiResponse);
    },
  });
};

const authNeeded: MW = (req, res, next) => {
  const id = getUserIDFromReq(req);
  if (!id) {
    return handleErr({
      res: res as NextApiResponse,
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
  req.userId = id;
  next();
};

export {
  getUserIDFromReq,
  handleServerErr,
  methodNotAllowed,
  handleErr,
  createHandler,
  authNeeded,
};
