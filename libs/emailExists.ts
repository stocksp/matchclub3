import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise
    const db = client.db()
    const email = decodeURIComponent(req.query.email as string)
    console.log("starting emailExists:", email);

    const member = await db
      .collection("members")
      .findOne({ email: email });

    console.log("found member", member?.alias);
    if (member)
      return {
        member: true,
        memberId: member.memberId,
        alias: member.alias,
        role: member.role,
      };
    else return { member: false };
  } catch (error) {
    return error;
  }
};
export default handler
