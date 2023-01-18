import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"
import { DeleteResult } from "mongodb"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running removeDate", req.body.dateId)
  try {
    const client = await clientPromise
    const db = client.db()
    const dateId = parseInt(req.body.dateId)

    if (dateId) {
      let resp: DeleteResult = await db.collection("dates").deleteOne({ dateId })
      console.log("resp", resp.deletedCount)
      return { message: "aok", resp }
    } else res.status(500).json("Error: bad parameter dateId")
  } catch (e) {
    console.log("catch error", e)
  }
}

export default handler
