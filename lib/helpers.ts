import { getReasonPhrase, StatusCodes } from "http-status-codes";
import nc from "next-connect";

import { MW, Req, Res } from "@/lib/constants";
import { decodeToken, Payload } from "@/lib/tokens";

const getAccessTokenFromRequest = (req: Req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    return null;
  }
  return token;
};

const getRefreshTokenFromRequest = (req: Req<{ refreshToken?: string }>) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return null;
  }
  return refreshToken;
};

const getUserIDFromReq = (req: Req): string | null => {
  const accessToken = getAccessTokenFromRequest(req);
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
  res: Res<any>;
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

const handleServerErr = (res: Res, e?: unknown) =>
  handleErr({
    res,
    e,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });

const methodNotAllowed = (res: Res) =>
  handleErr({
    res,
    statusCode: StatusCodes.NOT_FOUND,
  });

const createHandler = () => {
  return nc<Req, Res>({
    onError: (err, _, res, next) => {
      handleServerErr(res as Res, err);
      next();
    },
    onNoMatch: (_, res) => {
      methodNotAllowed(res as Res);
    },
  });
};

const authNeeded: MW = (req, res, next) => {
  const id = getUserIDFromReq(req);
  if (!id) {
    return handleErr({
      res: res as Res,
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
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
};
