import clientPromise from "libs/mongo"
import { getSeason, startOfSeason } from "./utils"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getHighScores")
    const client = await clientPromise
    const db = client.db()
    const dateResults = await db
      .collection("dateResults")
      .find({ season: getSeason() })
      .project({ _id: 0, match: 0, season: 0 })
      .toArray()

    const docs = await db
      .collection("highScores")
      .find({ season: getSeason() })
      .project({ _id: 0 })
      .toArray()
    console.log("found", docs.length)
    return { message: "ok", results: docs, dateResults }
  } catch (error) {
    return error
    //res.json("Error: " + error.toString());
  }
}

export default handler
