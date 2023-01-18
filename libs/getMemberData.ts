import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req.query.id as string
    console.log("starting getMemberData:", id)
    const client = await clientPromise
    const db = client.db()

    const doc = await db.collection("members").findOne({ memberId: parseInt(id) })

    console.log("found member", doc.alias)
    return { message: "ok", doc }
  } catch (error) {
    return error
  }
}
export default handler
