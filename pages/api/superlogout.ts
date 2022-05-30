import {
  authNeeded,
  createHandler,
  handleErr,
} from "@/lib/auth/backend/helpers";
import { removeAllUserSessions } from "@/lib/db";
import { StatusCodes } from "http-status-codes";

const handler = createHandler();

handler.post(authNeeded, async (req, res) => {
  try {
    await removeAllUserSessions(req.userId);
  } catch (e) {
    return handleErr({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      e,
    });
  }
  return res.json({
    message: "All user sessions successfully removed",
    error: false,
  });
});

export default handler;
