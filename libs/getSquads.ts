import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getSquads")
    const client = await clientPromise
    const db = client.db()
    const now = new Date()
    //set now time to 0 hours to allow squad changes for entire match day
    now.setHours(0)
    now.setMinutes(0)
    const docs = await db
      .collection("dates")
      .find({ date: { $gte: now } })
      .sort({ date: 1 })
      .project({ _id: 0 })
      .toArray()

    console.log("found squads", docs.length)
    return { message: "ok", docs }
  } catch (error) {
    res.json("Error: " + error.toString())
  }
}
export default handler
