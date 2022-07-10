import { createIndexes } from "@/lib/db";
import { createHandler, handleServerErr } from "@/authhelpers";

import { HealthRequestBody, HealthResponseBody } from "@/types/endpoint";
import { Req, Res } from "@/types/general";

const handler = createHandler();
handler.get(async (_: Req<HealthRequestBody>, res: Res<HealthResponseBody>) => {
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
