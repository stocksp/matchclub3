import clientPromise from "libs/mongo"

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running updateSquad", req.body.dateId)
  try {
    const dateId = parseInt(req.body.dateId)
    const squad = req.body.squad ? req.body.squad : []
    const season = req.body.season

    if (dateId && squad) {
      const client = await clientPromise
      const db = client.db()
      // update the dateResults
      let resp = await db.collection("dates").updateOne({ dateId }, { $set: { squad } })
      console.log("resp modified", resp.modifiedCount)

      res.json({ message: "aok", resp })
    } else res.json({ message: "not good data" })
  } catch (e) {
    console.log("catch error", e)
  }
}

export default handler
