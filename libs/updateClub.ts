import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running updateClub")
  try {
    const client = await clientPromise
    const db = client.db()
    const locationId = parseInt(req.body.locationId)
    const clubId = parseInt(req.body.clubId)
    const name = req.body.name
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const phone = req.body.phone
    const houseName = req.body.houseName

    if (locationId && clubId && name && address && city && state && zip && phone && houseName) {
      let resp = await db.collection("clubs").updateOne(
        { clubId },
        { $set: { name, address, city, state, zip, phone, houseName, locationId } },
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
