import { NextApiHandler } from "next";

// TODO: Shift `superlogout` to TRPC function
// INFO: will logout the user from all devices

const handler: NextApiHandler = (_, res) => {
  return res.end();
};

export default handler;
