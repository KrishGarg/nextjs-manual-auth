import { createIndexes } from "@/auth/backend/db";
import { createRouter } from "@/server/createRouter";

const router = createRouter().query("health", {
  async resolve() {
    await createIndexes();
    return "ok";
  },
});

export default router;
