import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getAllMembers")
    const client = await clientPromise
    const db = client.db()
    const docs = await db.collection("members").find({}).project({ _id: 0 }).toArray()
    console.log("found", docs.length)
    return { message: "ok", docs }
  } catch (error) {
    return error
  }
}

export default handler
