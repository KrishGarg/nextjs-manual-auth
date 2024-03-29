import { decodeToken, Payload } from "@/auth/backend/tokens";
import { NextApiRequest } from "next";

const getAccessTokenFromRequest = (req: NextApiRequest) => {
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

const getUserIDFromReq = (req: NextApiRequest): string | null => {
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

export { getUserIDFromReq, getAccessTokenFromRequest };
