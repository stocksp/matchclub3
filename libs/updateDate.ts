import { isValid } from "date-fns"
import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

type data = {
  host: string,
  guest: string,
  location: string,
  teamsizemax: number,
  date: Date,
  hasmeeting: boolean,
  season: string,
  squad?: any[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running updateDate", req.body.dateId)
  try {
    const client = await clientPromise
    const db = client.db()
    const dateId = parseInt(req.body.dateId)
    const host = req.body.host
    const guest = req.body.guest
    const location = req.body.location
    const teamsizemax = parseInt(req.body.teamsizemax)
    const date = new Date(req.body.date)
    const hasmeeting = req.body.hasmeeting
    const season = req.body.season
    const squad = req.body.squad

    if (season && dateId && host && guest && location && !isNaN(teamsizemax) && isValid(date)) {
      const data: data = {
        host,
        guest,
        location,
        teamsizemax,
        date,
        hasmeeting,
        season,
        squad,
      }

      let resp = await db.collection("dates").updateOne(
        { dateId },
        {
          $set: data,
        },
        {
          upsert: true,
        }
      )
      console.log("resp", resp.modifiedCount)
      return { message: "aok", resp }
    } else return { message: "not good data" }
  } catch (e) {
    console.log("catch error", e)
  }
}

export default handler
