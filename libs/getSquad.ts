import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getSquad:", req.query.dateId)
    const client = await clientPromise
    const db = client.db()
    const dateId = req.query.dateId as string

    const docs = await db
      .collection("dates")
      .find({ dateId: parseInt(dateId) })
      .project({ squad: 1, _id: 0 })
      .toArray()

    console.log("founda doc", docs[0])
    return { message: "ok", doc: docs[0] }
  } catch (error) {
    res.json("Error: " + error.toString())
  }
}
export default handler
