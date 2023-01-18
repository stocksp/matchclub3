import clientPromise from "libs/mongo"

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getGoogleMap:", req.query.location)
    const client = await clientPromise
    const db = client.db()

    const location = await db.collection("locations").findOne({ name: req.query.location })
    if (location) {
      let from_address = "300%20Golf%20Course%20Drive,Rohnert%20Park,CA"
      let to_address = `${location.address},${location.city},${location.state}`
      let plain_address = `${location.address}, ${location.city}, ${location.state}`
      to_address = to_address.replace(/ /g, "%20")

      let link = `http://maps.google.com/maps?f=d&source=s_d&saddr=${from_address}&daddr=${to_address}`
      console.log("link", link)
      res.json([link, plain_address])
    }
  } catch (error) {
    res.json("Error: " + error.toString())
  }
}
export default handler
