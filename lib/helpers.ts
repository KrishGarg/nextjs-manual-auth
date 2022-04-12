import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiData } from "./constants";
import { getTokensFromCookies } from "./cookies";
import { decodeToken, Payload } from "./tokens";

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
    // try catch based non internal server error
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
    statusCode: StatusCodes.METHOD_NOT_ALLOWED,
  });

export { getUserIDFromReq, handleServerErr, methodNotAllowed, handleErr };
