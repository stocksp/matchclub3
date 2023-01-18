import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running updateLocation")
  const client = await clientPromise
  const db = client.db()
  try {
    const locationId = parseInt(req.body.locationId)
    const name = req.body.name
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const phone = req.body.phone

    if (locationId && name && address && city && state && zip && phone) {
      let resp = await db.collection("locations").updateOne(
        { locationId },
        { $set: { name, address, city, state, zip, phone } },
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
