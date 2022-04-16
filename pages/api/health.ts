import { createIndexes } from "@/lib/db";
import { createHandler, handleServerErr } from "@/lib/helpers";

const handler = createHandler();
handler.get(async (_, res) => {
  try {
    await createIndexes();
  } catch (e) {
    return handleServerErr(res, e);
  }
  res.json({
    message: "API is up and running",
    error: false,
  });
});

export default handler;
