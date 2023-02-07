import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSeason } from "./utils"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getBests:", req.query.dateId)
    const client = await clientPromise
    const db = client.db()
    const dateId = req.query.dateId as string

    const docs = await db
      .collection("improvements")
      .find({ dateId: parseInt(dateId), season: getSeason() })
      .toArray()

    console.log("founda doc", docs[0])
    return { message: "ok", docs }
  } catch (error) {
    res.json("Error: " + error.toString())
  }
}
export default handler
