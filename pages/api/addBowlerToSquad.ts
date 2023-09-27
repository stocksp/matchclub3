import clientPromise from "libs/mongo"

const { format } = require("date-fns")

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running addBowlerToSquad", req.body.dateId, req.body.bowlerId, req.body.name)
  try {
    const client = await clientPromise
    const db = client.db()
    const dateId = parseInt(req.body.dateId)
    const bowlerId = parseInt(req.body.bowlerId)
    const bowler = await db.collection("members").findOne({ memberId: bowlerId })
    const dateData = await db.collection("dates").findOne({ dateId: dateId })

    const name = req.body.name

    if (dateId && bowlerId && name) {
      const theSquad = dateData.squad
      //sort it just to be safe
      theSquad.sort((a, b) => a.pos - b.pos)
      //add new one
      theSquad.push({ name, pos: dateData.squad.length + 1, id: bowlerId })
      // console.log("squad", dateData.squad)
      // now add it
      let result = await db.collection("dates").updateOne({ dateId }, { $set: { squad: theSquad } })

      res.json({ message: "aok", result: result.modifiedCount })
      // send to db
      let result2 = await db.collection("signups").insertOne({
        name: bowler.alias,
        date: dateData.date,
        location: dateData.location,
        what: "add",
        when: new Date(),
        emailSent: false,
      })
    } else {
      res.json({ message: "no update!" })
    }
  } catch (e) {
    console.log("catch error", e)
  }
}

export default handler
