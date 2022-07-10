import { NextApiHandler } from "next";

// TODO: Shift `health` to TRPC function
// INFO: create `ensureIndexes` function

const handler: NextApiHandler = (_, res) => {
  return res.end();
};

export default handler;
