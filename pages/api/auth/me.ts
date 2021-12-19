import type { NextApiHandler } from "next";

const handler: NextApiHandler<string> = async (req, res) => {
  res.status(200).send("Hi");
};

export default handler;
