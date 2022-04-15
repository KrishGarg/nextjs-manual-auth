import { ApiHandler } from "@/lib/constants";
import { createIndexes } from "@/lib/db";
import { handleServerErr } from "@/lib/helpers";

const handler: ApiHandler = async (_, res) => {
  try {
    await createIndexes();
  } catch (e) {
    return handleServerErr(res, e);
  }
  res.json({
    message: "API is up and running",
    error: false,
  });
};

export default handler;
