import { createRouter } from "../createRouter";

import auth from "./auth";
import user from "./user";
import other from "./other";

const appRouter = createRouter()
  .merge("auth.", auth)
  .merge("user.", user)
  .merge("other.", other);

export type AppRouter = typeof appRouter;
export default appRouter;
