import { NextApiHandler } from "next";

// TODO: Shift `me` to TRPC function
// INFO: this route will return user info (except password)

const handler: NextApiHandler = (_, res) => {
  return res.end();
};

export default handler;
