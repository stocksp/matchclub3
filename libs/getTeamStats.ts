import clientPromise from "libs/mongo"
import { getSeason, startOfSeason } from "./utils"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getTeamStats")
    const client = await clientPromise
    const db = client.db()
    const docs = await db
      .collection("memberstats")
      .find({ season: getSeason() })
      .project({ _id: 0 })
      .sort({ average: -1 })
      .toArray()
    console.log("found", docs.length)
    return { message: "ok", docs }
  } catch (error) {
    return error
  }
}

export default handler
