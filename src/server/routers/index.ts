import { createRouter } from "../createRouter";

import auth from "./auth";

const appRouter = createRouter().merge("auth.", auth);

export type AppRouter = typeof appRouter;
export default appRouter;
