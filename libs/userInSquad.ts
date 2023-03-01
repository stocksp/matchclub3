import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise
    const db = client.db()
    const userId = parseInt(req.query.memberId as string)
    const dateId = parseInt(req.query.dateId as string)
    console.log("starting userInSquad:", dateId, userId)

    const date = await db.collection("dates").findOne({ dateId })
    const squad = date.squad

    console.log("found squad", squad.length)
    const foundIt = squad.find((s) => s.id === userId)
    if (foundIt)
      return {
        member: true,
      }
    else return { member: false }
  } catch (error) {
    return error
  }
}
export default handler
